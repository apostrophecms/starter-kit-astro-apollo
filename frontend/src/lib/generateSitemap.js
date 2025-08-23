// frontend/src/lib/generateSitemap.js
import fs from 'fs';
import path from 'path';

/**
 * Generates a sitemap of all pages and pieces from ApostropheCMS
 * This will be used during static build to know which pages to generate
 */
export async function generateSitemap() {
  const aposHost = process.env.APOS_HOST || 'http://localhost:3000';

  try {
    // Fetch all pages from the site tree
    const pagesResponse = await fetch(`${aposHost}/api/v1/@apostrophecms/page?all=1&flat=1`, {
      headers: {
        'APOS-EXTERNAL-FRONT-KEY': process.env.APOS_EXTERNAL_FRONT_KEY || process.env.APOS_EXTERNAL_FRON_KEY
      }
    });

    if (!pagesResponse.ok) {
      throw new Error(`Failed to fetch pages: ${pagesResponse.statusText}`);
    }

    const pagesData = await pagesResponse.json();
    const pages = pagesData.results || [];

    // Collect all page URLs
    const urls = new Set();

    // Add pages from the page tree
    pages.forEach(page => {
      if (page._url && page._url !== '#') {
        urls.add(page._url);
      }
    });

    // Fetch piece page URLs (like articles)
    // You may need to adjust this based on your piece types
    const pieceTypes = ['article']; // Add your piece types here

    for (const pieceType of pieceTypes) {
      try {
        const piecesResponse = await fetch(`${aposHost}/api/v1/${pieceType}`, {
          headers: {
            'APOS-EXTERNAL-FRONT-KEY': process.env.APOS_EXTERNAL_FRONT_KEY || process.env.APOS_EXTERNAL_FRON_KEY
          }
        });

        if (piecesResponse.ok) {
          const piecesData = await piecesResponse.json();
          const pieces = piecesData.results || [];

          pieces.forEach(piece => {
            if (piece._url) {
              urls.add(piece._url);
            }
          });
        }
      } catch (error) {
        console.warn(`Could not fetch ${pieceType} pieces:`, error.message);
      }
    }

    // Convert to array and sort
    const urlList = Array.from(urls).sort();

    // Write sitemap to file
    // Check if we're in the frontend directory or root directory
    const isInFrontend = fs.existsSync(path.join(process.cwd(), 'src'));
    const sitemapPath = isInFrontend
      ? path.join(process.cwd(), 'src', 'generated-sitemap.json')
      : path.join(process.cwd(), 'frontend', 'src', 'generated-sitemap.json');

    // Ensure the directory exists
    const sitemapDir = path.dirname(sitemapPath);
    if (!fs.existsSync(sitemapDir)) {
      fs.mkdirSync(sitemapDir, { recursive: true });
    }

    fs.writeFileSync(sitemapPath, JSON.stringify(urlList, null, 2));

    console.log(`Generated sitemap with ${urlList.length} URLs`);
    console.log('URLs:', urlList);

    return urlList;

  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}

// Allow running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}