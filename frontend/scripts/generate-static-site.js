#!/usr/bin/env node
// Builds the Astro site, starts a local preview server, generates a sitemap by
// reading from an ApostropheCMS backend, crawls all pages concurrently, writes
// HTML to a static output directory, copies Astro assets, and pulls Apostrophe
// uploads either from local FS (monorepo) or by downloading referenced image URLs.
//
// Multi-locale support: Pass --localeConfig=path/to/config.js to enable multi-locale generation
//
// Usage:
//   APOS_HOST=http://localhost:3000 APOS_EXTERNAL_FRONT_KEY=... node scripts/generate-static-site.js --out static-dist
// Options:
//   --out=dir            Output directory (default: static-dist)
//   --port=4321          Preview port (default: 4321)
//   --host=127.0.0.1     Preview host (default: 127.0.0.1)
//   --concurrency=8      Max concurrent fetches (default: CPU count, capped at 8)
//   --pieceTypes=a,b,c   Optional: force specific piece types (skips discovery)
//   --aposHost=...       Override Apostrophe host (defaults to APOS_HOST env)
//   --localeConfig=...   Path to locale configuration file (enables multi-locale)
//   --retries=3          Number of retries for failed fetches (default: 3)

import os from "os";
import fs from "fs";
import path from "path";
import { spawn, execSync } from "child_process";
import { generateSitemap } from "./generateSitemap.js";

function parseCliArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (const arg of args) {
    const [key, value] = arg.split("=");
    if (key === "--out") options.out = value;
    if (key === "--port") options.port = Number(value);
    if (key === "--host") options.host = value;
    if (key === "--concurrency") options.concurrency = Number(value);
    if (key === "--retries") options.retries = Number(value);
    if (key === "--pieceTypes") {
      options.pieceTypes = value.split(",").map(type => type.trim()).filter(Boolean);
    }
    if (key === "--aposHost") options.aposHost = value;
    if (key === "--localeConfig") options.localeConfig = value;
  }
  
  return options;
}

function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);
  
  return fetch(url, { ...options, signal: abortController.signal })
    .finally(() => clearTimeout(timeoutId));
}

async function fetchWithRetry(url, options = {}, timeoutMs = 30000, retries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options, timeoutMs);
      if (response.ok) return response;
      
      // Don't retry 4xx errors (except 429 rate limit)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error;
    }
    
    if (attempt < retries) {
      const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // Exponential backoff, max 5s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

async function waitForServer(url, { timeoutMs = 60000, intervalMs = 500 } = {}) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await fetchWithTimeout(url, {}, intervalMs);
      if (response.ok) return true;
    } catch (error) {
      // Server not ready yet, continue waiting
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  throw new Error(`Preview server did not respond at ${url} within ${timeoutMs}ms`);
}

function cleanDir(directory) {
  fs.rmSync(directory, { recursive: true, force: true });
  fs.mkdirSync(directory, { recursive: true });
}

function copyDir(sourceDir, destDir) {
  if (!fs.existsSync(sourceDir)) return;
  
  fs.mkdirSync(destDir, { recursive: true });
  
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

function writeHtmlForPath(rootDir, urlPath, html) {
  // Map '/about/' -> '<out>/about/index.html', '/' -> '<out>/index.html'
  const isFile = /\.[a-z0-9]+$/i.test(urlPath);
  let outputPath;
  
  if (isFile) {
    outputPath = path.join(rootDir, urlPath.replace(/^\//, ""));
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  } else if (urlPath === "/") {
    outputPath = path.join(rootDir, "index.html");
  } else {
    outputPath = path.join(rootDir, urlPath.replace(/^\//, ""), "index.html");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }
  
  fs.writeFileSync(outputPath, html);
}

async function extractImagesFromHtml(staticDir, aposHost) {
  // Scan generated HTML and download remote images under uploads/
  const htmlFiles = [];
  
  (function walkDirectory(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const filePath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        walkDirectory(filePath);
      } else if (entry.isFile() && entry.name.endsWith(".html")) {
        htmlFiles.push(filePath);
      }
    }
  })(staticDir);

  const uploadUrls = new Set();
  const escapedHost = aposHost.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const urlRegex = new RegExp(
    `(?:src|href)=["'](?:${escapedHost})?/uploads/[^"']+["']`, 
    "gi"
  );

  for (const htmlFile of htmlFiles) {
    const htmlContent = fs.readFileSync(htmlFile, "utf8");
    const matches = htmlContent.matchAll(urlRegex);
    
    for (const match of matches) {
      // Extract URL from the matched attribute
      const urlMatch = match[0].match(/["']([^"']+)["']/);
      if (urlMatch) {
        uploadUrls.add(urlMatch[1]);
      }
    }
  }

  if (uploadUrls.size === 0) {
    console.log("   No upload URLs found in HTML");
    return;
  }

  console.log(`   Downloading ${uploadUrls.size} upload assets...`);
  let downloaded = 0;
  let failed = 0;

  for (const uploadUrl of uploadUrls) {
    try {
      const fullUrl = uploadUrl.startsWith("http") ? uploadUrl : `${aposHost}${uploadUrl}`;
      const relativePath = fullUrl.replace(/^https?:\/\/[^/]+/, ""); // /uploads/...
      const destPath = path.join(staticDir, relativePath);
      
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      
      const response = await fetchWithRetry(fullUrl, {}, 60000, 2);
      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(destPath, buffer);
      downloaded++;
    } catch (error) {
      failed++;
      console.warn(`   ⚠️  Failed to download: ${uploadUrl}`);
    }
  }

  console.log(`   ✓ Downloaded ${downloaded} assets${failed > 0 ? `, ${failed} failed` : ''}`);
}

async function copyAposUploadsFromFs(staticDir) {
  // Best-effort local paths for monorepo setups
  const candidatePaths = [
    path.join(process.cwd(), "..", "backend", "public", "uploads"),
    path.join(process.cwd(), "backend", "public", "uploads"),
    path.join(process.cwd(), "..", "..", "backend", "public", "uploads"),
    path.join(process.cwd(), "public", "uploads")
  ];
  
  for (const candidatePath of candidatePaths) {
    if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isDirectory()) {
      const files = fs.readdirSync(candidatePath);
      if (files.length > 0) {
        console.log(`   Copying from: ${candidatePath}`);
        copyDir(candidatePath, path.join(staticDir, "uploads"));
        return true;
      }
    }
  }
  
  return false;
}

async function mapLimit(items, limit, worker) {
  const queue = [...items];
  const results = { success: 0, failed: 0, errors: [] };
  
  const runners = Array.from({ length: limit }, async function processQueue() {
    while (queue.length) {
      const item = queue.shift();
      try {
        await worker(item);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({ item, error: error.message });
      }
    }
  });
  
  await Promise.all(runners);
  return results;
}

async function loadLocaleConfig(configPath) {
  try {
    const fullPath = path.resolve(configPath);
    const config = (await import(fullPath)).default;
    
    // Validate config structure
    if (!config || typeof config !== 'object') {
      throw new Error('Locale config must export a default object');
    }
    
    for (const [locale, settings] of Object.entries(config)) {
      if (!settings.baseUrl) {
        throw new Error(`Locale "${locale}" missing baseUrl`);
      }
      if (settings.prefix === undefined) {
        settings.prefix = ''; // Default to empty prefix
      }
    }
    
    return config;
  } catch (error) {
    throw new Error(`Failed to load locale config from ${configPath}: ${error.message}`);
  }
}

function applyLocalePrefix(urls, localePrefix) {
  if (!localePrefix) return urls;
  
  return urls.map(url => {
    // Don't double-prefix
    if (url.startsWith(localePrefix + '/') || url === localePrefix) {
      return url;
    }
    
    // Add prefix to all paths
    if (url === '/') {
      return localePrefix + '/';
    }
    
    return localePrefix + url;
  });
}

async function fetchCustom404(previewUrl, outputDir, retries) {
  // Try to fetch custom 404 page from the preview server
  try {
    const response = await fetchWithRetry(`${previewUrl}/404`, {}, 30000, retries);
    if (response.ok) {
      const html = await response.text();
      fs.writeFileSync(path.join(outputDir, "404.html"), html);
      console.log("   ✓ Custom 404 page generated");
      return true;
    }
  } catch (error) {
    // Custom 404 not available, will create default
  }
  return false;
}

async function main() {
  const cliOptions = parseCliArgs();
  const outputDir = path.resolve(cliOptions.out ?? "static-dist");
  const port = cliOptions.port ?? 4321;
  const host = cliOptions.host ?? "127.0.0.1";
  const previewUrl = `http://${host}:${port}`;
  const concurrency = Math.min(8, Math.max(2, cliOptions.concurrency ?? os.cpus().length));
  const retries = cliOptions.retries ?? 3;
  const aposHost = cliOptions.aposHost ?? (process.env.APOS_HOST || "http://localhost:3000");
  const frontKey = process.env.APOS_EXTERNAL_FRONT_KEY;
  
  if (!frontKey) {
    console.error("❌ APOS_EXTERNAL_FRONT_KEY is required");
    process.exit(1);
  }

  // Load locale configuration if provided
  let localeConfig = null;
  if (cliOptions.localeConfig) {
    localeConfig = await loadLocaleConfig(cliOptions.localeConfig);
    console.log(`🌍 Multi-locale mode enabled with locales: ${Object.keys(localeConfig).join(', ')}`);
  }

  console.log("🛠️  Building Astro...");
  try {
    execSync("npm run build", { stdio: "inherit" });
  } catch (error) {
    console.error("❌ Astro build failed");
    process.exit(1);
  }

  console.log("🌐 Starting Astro preview...");
  const astroProcess = spawn(
    "npm", 
    ["run", "preview", "--", "--host", host, "--port", String(port)], 
    {
      stdio: ["ignore", "inherit", "inherit"],
      detached: process.platform !== "win32"
    }
  );

  function shutdown() {
    if (!astroProcess.killed) {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", String(astroProcess.pid), "/T", "/F"]);
      } else {
        try {
          process.kill(-astroProcess.pid, "SIGTERM");
        } catch {
          try {
            astroProcess.kill("SIGTERM");
          } catch {}
        }
      }
    }
  }
  
  // Ensure cleanup on any exit
  process.on("exit", shutdown);
  process.on("SIGINT", () => { shutdown(); process.exit(1); });
  process.on("SIGTERM", () => { shutdown(); process.exit(1); });
  process.on("uncaughtException", (error) => { 
    console.error("❌ Uncaught exception:", error);
    shutdown(); 
    process.exit(1); 
  });

  try {
    console.log(`⏳ Waiting for preview at ${previewUrl} ...`);
    await waitForServer(previewUrl, { timeoutMs: 90000, intervalMs: 800 });
    console.log("✅ Preview is up.");

    console.log("🧭 Generating sitemap from Apostrophe...");
    
    let allUrls = [];
    
    if (localeConfig) {
      // Multi-locale: generate sitemap for each locale and combine
      for (const [locale, config] of Object.entries(localeConfig)) {
        console.log(`   📋 Fetching URLs for locale: ${locale}`);
        const urls = await generateSitemap({ 
          aposHost, 
          locale,
          pieceTypes: cliOptions.pieceTypes 
        });
        
        // Apply locale prefix if configured
        const prefixedUrls = applyLocalePrefix(urls, config.prefix);
        
        allUrls.push(...prefixedUrls);
        console.log(`   ✓ ${prefixedUrls.length} URLs for ${locale}`);
      }
      
      // Remove duplicates and sort
      allUrls = Array.from(new Set(allUrls)).sort();
    } else {
      // Single locale (existing behavior)
      allUrls = await generateSitemap({ aposHost, pieceTypes: cliOptions.pieceTypes });
    }
    
    if (allUrls.length === 0) {
      console.error("❌ No URLs found to render. Check your Apostrophe connection and data.");
      throw new Error("Empty sitemap");
    }
    
    console.log(`📄 ${allUrls.length} total URLs to render.`);

    console.log("📂 Preparing output directory:", outputDir);
    cleanDir(outputDir);

    // Copy browser assets
    const distDir = path.join(process.cwd(), "dist");
    const distClientDir = path.join(distDir, "client");
    
    if (fs.existsSync(distClientDir)) {
      console.log("📦 Detected SSR build shape – copying dist/client/* to output root...");
      copyDir(distClientDir, outputDir);
    } else if (fs.existsSync(distDir)) {
      console.log("📦 Detected static build shape – copying dist/* to output root...");
      copyDir(distDir, outputDir);
    } else {
      console.warn("⚠️  No dist directory found - assets may be missing");
    }

    console.log(`🚚 Rendering pages (concurrency: ${concurrency}, retries: ${retries})...`);
    let completedPages = 0;
    const totalPages = allUrls.length;
    
    const renderResults = await mapLimit(allUrls, concurrency, async (urlPath) => {
      const pageUrl = new URL(urlPath, previewUrl).toString();
      const response = await fetchWithRetry(pageUrl, {}, 60000, retries);
      
      const html = await response.text();
      writeHtmlForPath(outputDir, new URL(urlPath, "http://dummy").pathname, html);
      
      completedPages += 1;
      // Update progress more frequently for better feedback
      if (completedPages % 5 === 0 || completedPages === totalPages) {
        const percentage = Math.round((completedPages / totalPages) * 100);
        process.stdout.write(`\r   ${completedPages}/${totalPages} pages (${percentage}%)`);
      }
    });
    
    process.stdout.write("\n");
    
    if (renderResults.failed > 0) {
      console.warn(`⚠️  ${renderResults.failed} pages failed to render:`);
      renderResults.errors.slice(0, 5).forEach(({ item, error }) => {
        console.warn(`   - ${item}: ${error}`);
      });
      if (renderResults.errors.length > 5) {
        console.warn(`   ... and ${renderResults.errors.length - 5} more`);
      }
    }

    console.log("🖼️  Handling uploads...");
    const uploadsCopied = await copyAposUploadsFromFs(outputDir);
    
    if (!uploadsCopied) {
      console.log("   No local uploads found – scanning HTML and downloading referenced assets...");
      await extractImagesFromHtml(outputDir, aposHost);
    }

    // Try to get custom 404, fallback to default
    const has404 = await fetchCustom404(previewUrl, outputDir, retries);
    if (!has404) {
      const notFoundPath = path.join(outputDir, "404.html");
      if (!fs.existsSync(notFoundPath)) {
        fs.writeFileSync(
          notFoundPath, 
          "<!doctype html><meta charset='utf-8'><title>Not found</title><h1>404</h1>"
        );
        console.log("   ✓ Default 404 page created");
      }
    }

    console.log("🎉 Static export complete:", outputDir);
    
    if (renderResults.failed > 0) {
      console.log(`\n⚠️  Warning: Export completed with ${renderResults.failed} failed pages`);
      shutdown();
      process.exit(1); // Exit with error code if some pages failed
    }
    
    shutdown();
  } catch (error) {
    console.error("\n❌ Export failed:", error.message);
    shutdown();
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}