// frontend/src/lib/staticAssets.js
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

/**
 * Downloads and copies assets from ApostropheCMS to the static build
 * This ensures uploaded images and files are available in the static site
 */
export async function copyStaticAssets() {
  if (process.env.APOS_STATIC_BUILD !== 'true') {
    return;
  }

  const aposHost = process.env.APOS_HOST || 'http://localhost:3000';

  // Check if we're in the frontend directory or root directory
  const isInFrontend = fs.existsSync(path.join(process.cwd(), 'public'));
  const publicDir = isInFrontend
    ? path.join(process.cwd(), 'public')
    : path.join(process.cwd(), 'frontend', 'public');

  const uploadsDir = path.join(publicDir, 'uploads');

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  try {
    // Fetch list of all attachments from ApostropheCMS
    const response = await fetch(`${aposHost}/api/v1/@apostrophecms/attachment`, {
      headers: {
        'APOS-EXTERNAL-FRONT-KEY': process.env.APOS_EXTERNAL_FRONT_KEY || process.env.APOS_EXTERNAL_FRON_KEY
      }
    });

    if (!response.ok) {
      console.warn('Could not fetch attachments list');
      return;
    }

    const data = await response.json();
    const attachments = data.results || [];

    console.log(`Found ${attachments.length} attachments to copy`);

    // Download each attachment
    for (const attachment of attachments) {
      if (attachment._urls) {
        for (const [size, url] of Object.entries(attachment._urls)) {
          try {
            await downloadFile(`${aposHost}${url}`, path.join(publicDir, url));
          } catch (error) {
            console.warn(`Failed to download ${url}:`, error.message);
          }
        }
      }
    }

    console.log('Asset copying complete');

  } catch (error) {
    console.error('Error copying static assets:', error);
  }
}

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      resolve();
      return;
    }

    const file = fs.createWriteStream(filePath);
    const httpModule = url.startsWith('https:') ? https : http;

    httpModule.get(url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

    }).on('error', (error) => {
      fs.unlink(filePath, () => { }); // Delete the file on error
      reject(error);
    });
  });
}