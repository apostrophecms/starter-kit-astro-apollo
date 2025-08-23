#!/usr/bin/env node
// scripts/generate-static-site.js

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { generateSitemap } from '../src/lib/generateSitemap.js';

let astroProcess = null;

async function generateStaticSite() {
  console.log('🚀 Starting static site generation...');
  
  try {
    // Step 1: Ensure ApostropheCMS backend is running
    console.log('📡 Checking ApostropheCMS backend...');
    const aposHost = process.env.APOS_HOST || 'http://localhost:3000';
    
    try {
      const response = await fetch(`${aposHost}/api/v1/@apostrophecms/page?limit=1`, {
        headers: {
          'APOS-EXTERNAL-FRONT-KEY': process.env.APOS_EXTERNAL_FRONT_KEY
        }
      });
      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}: ${response.statusText}`);
      }
      console.log('✅ Backend accessible');
    } catch (error) {
      console.error('❌ ApostropheCMS backend is not accessible at', aposHost);
      console.error('Please ensure the backend is running and accessible');
      process.exit(1);
    }

    // Step 2: Generate sitemap
    console.log('🗺️  Generating sitemap...');
    const sitemap = await generateSitemap();
    console.log(`Found ${sitemap.length} URLs to generate`);

    // Step 3: Start Astro in production mode
    console.log('🏗️  Starting Astro server...');
    
    // Build the Astro project first
    console.log('Building Astro project...');
    execSync('npm run build:ssr', { stdio: 'inherit' });
    
    // Start the Astro server
    astroProcess = spawn('npm', ['run', 'preview'], {
      stdio: 'pipe',
      env: {
        ...process.env,
        PORT: '4321',
        APOS_HOST: process.env.APOS_HOST || 'http://localhost:3000',
        APOS_EXTERNAL_FRONT_KEY: process.env.APOS_EXTERNAL_FRONT_KEY
      }
    });

    // Wait for server to be ready
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Astro server failed to start within 30 seconds'));
      }, 30000);

      let serverReady = false;

      astroProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log('Astro:', output.trim());
        
        if (output.includes('Local') || output.includes('preview') || output.includes('4321')) {
          if (!serverReady) {
            serverReady = true;
            setTimeout(() => {
              clearTimeout(timeout);
              resolve();
            }, 2000); // Give it a couple extra seconds to be fully ready
          }
        }
      });

      astroProcess.stderr.on('data', (data) => {
        console.error('Astro Error:', data.toString());
      });

      astroProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      astroProcess.on('exit', (code) => {
        if (code !== 0) {
          clearTimeout(timeout);
          reject(new Error(`Astro process exited with code ${code}`));
        }
      });
    });

    console.log('✅ Astro server started');

    // Step 4: Test server connectivity
    console.log('🔌 Testing server connectivity...');
    const astroHost = 'http://localhost:4321';
    let serverReady = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!serverReady && attempts < maxAttempts) {
      try {
        const testResponse = await fetch(`${astroHost}/`, {
          headers: {
            'User-Agent': 'Static Site Generator'
          }
        });
        
        if (testResponse.ok) {
          serverReady = true;
          console.log('✅ Server responding correctly');
        } else {
          console.log(`Attempt ${attempts + 1}: Server returned ${testResponse.status}`);
        }
      } catch (error) {
        console.log(`Attempt ${attempts + 1}: ${error.message}`);
      }
      
      if (!serverReady) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      }
    }

    if (!serverReady) {
      throw new Error('Could not connect to Astro server after 10 attempts');
    }

    // Step 5: Create static output directory
    const staticDir = path.join(process.cwd(), 'static-dist');
    if (fs.existsSync(staticDir)) {
      fs.rmSync(staticDir, { recursive: true });
    }
    fs.mkdirSync(staticDir, { recursive: true });

    // Step 6: Fetch and save each page
    console.log('📄 Generating static pages...');
    
    for (const url of sitemap) {
      try {
        console.log(`Generating: ${url}`);
        
        const response = await fetch(`${astroHost}${url}`, {
          headers: {
            'User-Agent': 'Static Site Generator'
          }
        });

        if (!response.ok) {
          console.warn(`⚠️  Failed to fetch ${url}: ${response.status} ${response.statusText}`);
          
          // Try to get more details about the error
          try {
            const errorText = await response.text();
            console.warn(`Error details: ${errorText.substring(0, 200)}...`);
          } catch (e) {
            // Ignore if we can't read the error
          }
          continue;
        }

        const html = await response.text();
        
        // Basic validation that we got HTML
        if (!html.includes('<html') && !html.includes('<!DOCTYPE')) {
          console.warn(`⚠️  ${url} returned content that doesn't look like HTML`);
          console.warn(`First 100 chars: ${html.substring(0, 100)}`);
          continue;
        }
        
        // Determine output path
        let outputPath;
        if (url === '/') {
          outputPath = path.join(staticDir, 'index.html');
        } else {
          const urlPath = url.slice(1); // Remove leading slash
          outputPath = path.join(staticDir, urlPath, 'index.html');
        }

        // Ensure directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write HTML file
        fs.writeFileSync(outputPath, html);
        console.log(`✅ Generated: ${outputPath}`);
        
      } catch (error) {
        console.warn(`⚠️  Failed to generate ${url}:`, error.message);
        
        // Add more detailed error information
        if (error.code === 'ECONNREFUSED') {
          console.warn('   Connection refused - is the Astro server still running?');
        } else if (error.code === 'ENOTFOUND') {
          console.warn('   Host not found - check the server URL');
        } else if (error.name === 'AbortError') {
          console.warn('   Request timed out');
        }
      }
    }

    // Step 6: Copy static assets
    console.log('📁 Copying static assets...');
    const distDir = path.join(process.cwd(), 'dist');
    const publicDir = path.join(process.cwd(), 'public');
    
    // Copy built assets from dist (CSS, JS, etc.)
    if (fs.existsSync(distDir)) {
      console.log('Copying built assets from dist/');
      
      // Copy the client assets (CSS, JS, images)
      const clientDir = path.join(distDir, 'client');
      if (fs.existsSync(clientDir)) {
        console.log('Found client assets directory');
        copyDir(clientDir, staticDir);
      }
      
      // Also copy any root assets from dist
      const distEntries = fs.readdirSync(distDir, { withFileTypes: true });
      for (const entry of distEntries) {
        if (entry.isFile()) {
          const srcPath = path.join(distDir, entry.name);
          const destPath = path.join(staticDir, entry.name);
          fs.copyFileSync(srcPath, destPath);
          console.log(`Copied: ${entry.name}`);
        }
      }
    } else {
      console.log('No dist directory found');
    }
    
    // Copy public assets
    if (fs.existsSync(publicDir)) {
      console.log('Copying public assets/');
      copyDir(publicDir, staticDir);
    } else {
      console.log('No public directory found');
    }

    // Step 7: Copy uploads from ApostropheCMS backend
    console.log('🖼️  Copying ApostropheCMS uploads...');
    await copyAposUploads(staticDir);

    console.log('✅ Static site generation complete!');
    console.log(`📦 Output directory: ${staticDir}`);
    console.log('🌐 Ready to deploy to any static hosting provider!');
    
  } catch (error) {
    console.error('❌ Static site generation failed:', error.message);
    process.exit(1);
  } finally {
    // Clean up: Stop Astro server
    if (astroProcess) {
      console.log('🛑 Stopping Astro server...');
      astroProcess.kill();
    }
  }
}

// Helper function to copy directories
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source directory doesn't exist: ${src}`);
    return;
  }
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  console.log(`Copying ${entries.length} items from ${src}`);
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    try {
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`  Copied file: ${entry.name}`);
      }
    } catch (error) {
      console.warn(`  Failed to copy ${entry.name}:`, error.message);
    }
  }
}

// Helper function to copy uploads from ApostropheCMS backend
async function copyAposUploads(staticDir) {
  // Try to find the backend uploads directory
  const possiblePaths = [
    path.join(process.cwd(), '..', 'backend', 'public', 'uploads'),
    path.join(process.cwd(), '..', '..', 'backend', 'public', 'uploads'),
    path.join(process.cwd(), '..', 'public', 'uploads')
  ];
  
  let backendUploadsDir = null;
  
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      backendUploadsDir = possiblePath;
      console.log(`Found backend uploads at: ${possiblePath}`);
      break;
    }
  }
  
  if (!backendUploadsDir) {
    console.warn('Could not find backend uploads directory. Tried:');
    possiblePaths.forEach(p => console.warn(`  - ${p}`));
    console.warn('You may need to manually copy uploads or adjust the path.');
    return;
  }
  
  const staticUploadsDir = path.join(staticDir, 'uploads');
  
  console.log(`Copying uploads from ${backendUploadsDir} to ${staticUploadsDir}`);
  copyDir(backendUploadsDir, staticUploadsDir);
  
  // Count files to show progress
  try {
    const files = countFiles(staticUploadsDir);
    console.log(`✅ Copied ${files} upload files`);
  } catch (error) {
    console.log('✅ Upload copy completed');
  }
}

// Helper function to count files in a directory
function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  
  let count = 0;
  
  function countInDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        countInDir(path.join(currentDir, entry.name));
      } else {
        count++;
      }
    }
  }
  
  countInDir(dir);
  return count;
}

// Helper function to find all HTML files
function findHtmlFiles(dir) {
  const htmlFiles = [];
  
  function scanDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    }
  }
  
  scanDir(dir);
  return htmlFiles;
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  if (astroProcess) {
    astroProcess.kill();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (astroProcess) {
    astroProcess.kill();
  }
  process.exit(0);
});

// Allow running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateStaticSite();
}

export { generateStaticSite };