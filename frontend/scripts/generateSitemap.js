// Generate a list of URLs to statically render by querying an ApostropheCMS backend.
//
// Features:
// - Fetches all pages (flat) via the Apostrophe Page API
// - Discovers piece-type APIs automatically by probing /api/v1 for subresources, then testing which return {_url}s
// - Fully paginates piece API endpoints
// - Deduplicates, sorts, and normalizes URLs
// - CLI override: --pieceTypes=article,product to force types (skips discovery)
// - Multi-locale support: pass locale to fetch locale-specific content
//
// Usage:
//   node scripts/generateSitemap.js > sitemap.json
//
// Exported:
//   generateSitemap({ aposHost?, headers?, pieceTypes?, locale? }) -> Promise<string[]>
//
// Notes:
// - Requires an external front key with read permissions for pages and pieces.

import fs from "fs";
import path from "path";

function parseCliArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (const arg of args) {
    const [key, value] = arg.split("=");
    
    if (key === "--pieceTypes") {
      options.pieceTypes = value.split(",").map(type => type.trim()).filter(Boolean);
    }
    if (key === "--aposHost") options.aposHost = value;
    if (key === "--locale") options.locale = value;
  }
  
  return options;
}

function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);
  
  return fetch(url, { ...options, signal: abortController.signal })
    .finally(() => clearTimeout(timeoutId));
}

function normalizeUrl(urlString) {
  // Ensure leading slash; drop query/hash; keep trailing slash consistency
  try {
    const url = new URL(urlString, "http://dummy");
    let pathname = url.pathname;
    
    if (!pathname.startsWith("/")) {
      pathname = "/" + pathname;
    }
    
    // Normalize: directories end with slash; file-like we leave as-is
    if (!pathname.endsWith(".html") && !pathname.endsWith(".htm") && !pathname.includes(".")) {
      if (!pathname.endsWith("/")) {
        pathname = pathname + "/";
      }
    }
    
    return pathname;
  } catch {
    // If it's already a path
    let pathname = urlString.split("?")[0].split("#")[0];
    
    if (!pathname.startsWith("/")) {
      pathname = "/" + pathname;
    }
    
    if (!isFileLike(pathname) && !pathname.endsWith("/")) {
      pathname += "/";
    }
    
    return pathname;
  }
}

function isFileLike(pathname) {
  return /\.[a-z0-9]+$/i.test(pathname);
}

async function fetchAllPages(aposHost, headers, locale = null) {
  // Primary shape (A3): flat page API
  let url = `${aposHost}/api/v1/@apostrophecms/page?all=1&flat=1&published=1`;
  
  if (locale) {
    url += `&aposLocale=${locale}`;
  }
  
  const response = await fetchWithTimeout(url, { headers });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch pages: ${response.status} ${response.statusText}`);
  }
  
  const json = await response.json();
  
  // Accept either { results: [...] } or array forms
  const pages = Array.isArray(json) ? json : (json.results ?? json);
  const urls = [];
  
  for (const page of pages || []) {
    if (typeof page._url === "string") {
      urls.push(normalizeUrl(page._url));
    }
  }
  
  // Ensure homepage exists - but respect locale context
  if (locale) {
    // For localized requests, look for locale-prefixed homepage
    const expectedHomepage = `/${locale}/`;
    if (!urls.includes(expectedHomepage) && !urls.includes("/")) {
      // Only add bare "/" if no localized homepage found
      urls.push("/");
    }
  } else {
    // For non-localized requests, ensure bare homepage
    if (!urls.includes("/")) {
      urls.push("/");
    }
  }
  
  // Dedup and sort
  return Array.from(new Set(urls)).sort();
}

async function probeCandidates(aposHost, headers) {
  // Try to GET /api/v1 and treat JSON keys as candidate endpoints (common in many setups)
  try {
    const response = await fetchWithTimeout(`${aposHost}/api/v1/`, { headers });
    if (!response.ok) return [];
    
    const data = await response.json();
    
    // Expect an object that may enumerate subresources, but this varies by project.
    if (data && typeof data === "object" && !Array.isArray(data)) {
      return Object.keys(data)
        .filter(key => typeof data[key] !== "function")
        .filter(key => !key.startsWith("@apostrophecms/")) // skip core endpoints
        .filter(key => !["search", "page"].includes(key)); // skip known non-piece
    }
  } catch (error) {
    // Probing failed, return empty array
  }
  
  return [];
}

async function isPieceEndpoint(aposHost, headers, endpointKey, locale = null) {
  // We will probe /api/v1/<key>?perPage=1 looking for { results: [ { _url } ] }
  try {
    let url = `${aposHost}/api/v1/${endpointKey}?perPage=1`;
    
    if (locale) {
      url += `&aposLocale=${locale}`;
    }
    
    const response = await fetchWithTimeout(url, { headers }, 15000);
    if (!response.ok) return false;
    
    const json = await response.json();
    const results = json?.results;
    
    if (Array.isArray(results) && results.length) {
      return Boolean(results[0]?._url);
    }
    
    // Some projects return [] but still piece endpoints—try page=1 anyway
    if (Array.isArray(results) && results.length === 0) {
      return true;
    }
  } catch (error) {
    // Endpoint check failed
  }
  
  return false;
}

async function discoverPieceTypes(aposHost, headers, locale = null) {
  // 1) Try to enumerate via /api/v1 root
  const candidates = await probeCandidates(aposHost, headers);

  // 2) Filter candidates by shape
  const discoveredTypes = [];
  for (const key of candidates) {
    if (await isPieceEndpoint(aposHost, headers, key, locale)) {
      discoveredTypes.push(key);
    }
  }

  // 3) If nothing found, try a heuristics pass:
  //    Request a likely piece list endpoint found in many projects.
  const heuristicTypes = ["article", "news", "product", "blog", "event"];
  
  for (const heuristicType of heuristicTypes) {
    if (!discoveredTypes.includes(heuristicType) && 
        await isPieceEndpoint(aposHost, headers, heuristicType, locale)) {
      discoveredTypes.push(heuristicType);
    }
  }
  
  return Array.from(new Set(discoveredTypes));
}

async function fetchAllPieces(aposHost, headers, pieceType, locale = null) {
  const urls = [];
  let currentPage = 1;
  const itemsPerPage = 100;
  
  for (;;) {
    let url = `${aposHost}/api/v1/${pieceType}?page=${currentPage}&perPage=${itemsPerPage}`;
    
    if (locale) {
      url += `&aposLocale=${locale}`;
    }
    
    const response = await fetchWithTimeout(url, { headers }, 30000);
    if (!response.ok) break;
    
    const json = await response.json();
    const results = json?.results ?? [];
    
    for (const piece of results) {
      if (piece?._url) {
        urls.push(normalizeUrl(piece._url));
      }
    }
    
    if (results.length < itemsPerPage) break;
    currentPage += 1;
  }
  
  return urls;
}

export async function generateSitemap(options = {}) {
  const cliOptions = parseCliArgs();
  const aposHost = options.aposHost ?? cliOptions.aposHost ?? (process.env.APOS_HOST || "http://localhost:3000");
  const locale = options.locale ?? cliOptions.locale ?? null;
  
  const frontKey = process.env.APOS_EXTERNAL_FRONT_KEY;
  if (!frontKey) {
    throw new Error("APOS_EXTERNAL_FRONT_KEY is required in env to read the API");
  }
  
  const headers = { "APOS-EXTERNAL-FRONT-KEY": frontKey };

  // Fetch pages
  const pageUrls = await fetchAllPages(aposHost, headers, locale);

  // Piece types: either CLI override or discover
  let pieceTypes = options.pieceTypes ?? cliOptions.pieceTypes;
  if (!pieceTypes) {
    pieceTypes = await discoverPieceTypes(aposHost, headers, locale);
  }

  // Fetch all pieces
  const pieceUrls = [];
  for (const pieceType of pieceTypes) {
    const urls = await fetchAllPieces(aposHost, headers, pieceType, locale);
    pieceUrls.push(...urls);
  }

  // Merge, dedupe, sort
  const allUrls = Array.from(new Set([...pageUrls, ...pieceUrls])).sort();
  return allUrls;
}

// Allow running directly: prints JSON array to stdout
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap().then(urlList => {
    process.stdout.write(JSON.stringify(urlList, null, 2) + "\n");
  }).catch(error => {
    console.error(error);
    process.exit(1);
  });
}