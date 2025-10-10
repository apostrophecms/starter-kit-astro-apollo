// scripts/generateSitemap.js
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
  const opts = {};
  for (const a of args) {
    const [k, v] = a.split("=");
    if (k === "--pieceTypes") {
      opts.pieceTypes = v.split(",").map(s => s.trim()).filter(Boolean);
    }
    if (k === "--aposHost") opts.aposHost = v;
    if (k === "--locale") opts.locale = v;
  }
  return opts;
}

function fetchWithTimeout(url, opts = {}, ms = 30000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  return fetch(url, { ...opts, signal: ctl.signal }).finally(() => clearTimeout(t));
}

function normalizeUrl(u) {
  // Ensure leading slash; drop query/hash; keep trailing slash consistency
  try {
    const url = new URL(u, "http://dummy");
    let p = url.pathname;
    if (!p.startsWith("/")) p = "/" + p;
    // Normalize: directories end with slash; file-like we leave as-is
    if (!p.endsWith(".html") && !p.endsWith(".htm") && !p.includes(".")) {
      if (!p.endsWith("/")) p = p + "/";
    }
    return p;
  } catch {
    // If it's already a path
    let p = u.split("?")[0].split("#")[0];
    if (!p.startsWith("/")) p = "/" + p;
    if (!p.endswith && notFileLike(p) && !p.endsWith("/")) p += "/";
    return p;
  }
}
function notFileLike(p) {
  return !/\.[a-z0-9]+$/i.test(p);
}

async function fetchAllPages(aposHost, headers, locale = null) {
  // Primary shape (A3): flat page API
  let url = `${aposHost}/api/v1/@apostrophecms/page?all=1&flat=1&published=1`;
  if (locale) {
    url += `&aposLocale=${locale}`;
  }
  
  const res = await fetchWithTimeout(url, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch pages: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  // Accept either { results: [...] } or array forms
  const pages = Array.isArray(json) ? json : (json.results ?? json);
  const urls = [];
  for (const p of pages || []) {
    if (typeof p._url === "string") urls.push(normalizeUrl(p._url));
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
    if (!urls.includes("/")) urls.push("/");
  }
  
  // Dedup and sort
  return Array.from(new Set(urls)).sort();
}

async function probeCandidates(aposHost, headers) {
  // Try to GET /api/v1 and treat JSON keys as candidate endpoints (common in many setups)
  try {
    const res = await fetchWithTimeout(`${aposHost}/api/v1/`, { headers });
    if (!res.ok) return [];
    const data = await res.json();
    // Expect an object that may enumerate subresources, but this varies by project.
    if (data && typeof data === "object" && !Array.isArray(data)) {
      return Object.keys(data)
        .filter(k => typeof data[k] !== "function")
        .filter(k => !k.startsWith("@apostrophecms/")) // skip core endpoints
        .filter(k => !["search", "page"].includes(k)); // skip known non-piece
    }
  } catch {}
  return [];
}

async function isPieceEndpoint(aposHost, headers, key, locale = null) {
  // We will probe /api/v1/<key>?perPage=1 looking for { results: [ { _url } ] }
  try {
    let url = `${aposHost}/api/v1/${key}?perPage=1`;
    if (locale) {
      url += `&aposLocale=${locale}`;
    }
    
    const res = await fetchWithTimeout(url, { headers }, 15000);
    if (!res.ok) return false;
    const json = await res.json();
    const results = json?.results;
    if (Array.isArray(results) && results.length) {
      return Boolean(results[0]?._url);
    }
    // Some projects return [] but still piece endpoints—try page=1 anyway
    if (Array.isArray(results) && results.length === 0) return true;
  } catch {}
  return false;
}

async function discoverPieceTypes(aposHost, headers, locale = null) {
  // 1) Try to enumerate via /api/v1 root
  const candidates = await probeCandidates(aposHost, headers);

  // 2) Filter candidates by shape
  const out = [];
  for (const key of candidates) {
    if (await isPieceEndpoint(aposHost, headers, key, locale)) out.push(key);
  }

  // 3) If nothing found, try a heuristics pass:
  //    Request a likely piece list endpoint found in many projects.
  const heuristics = ["article", "news", "product", "blog", "event"];
  for (const key of heuristics) {
    if (!out.includes(key) && await isPieceEndpoint(aposHost, headers, key, locale)) {
      out.push(key);
    }
  }
  return Array.from(new Set(out));
}

async function fetchAllPieces(aposHost, headers, pieceType, locale = null) {
  const urls = [];
  let page = 1;
  const perPage = 100;
  for (;;) {
    let url = `${aposHost}/api/v1/${pieceType}?page=${page}&perPage=${perPage}`;
    if (locale) {
      url += `&aposLocale=${locale}`;
    }
    
    const res = await fetchWithTimeout(url, { headers }, 30000);
    if (!res.ok) break;
    const json = await res.json();
    const results = json?.results ?? [];
    for (const piece of results) {
      if (piece?._url) urls.push(normalizeUrl(piece._url));
    }
    if (results.length < perPage) break;
    page += 1;
  }
  return urls;
}

export async function generateSitemap(opts = {}) {
  const cli = parseCliArgs();
  const aposHost = opts.aposHost ?? cli.aposHost ?? (process.env.APOS_HOST || "http://localhost:3000");
  const locale = opts.locale ?? cli.locale ?? null;
  
  const frontKey = process.env.APOS_EXTERNAL_FRONT_KEY;
  if (!frontKey) {
    throw new Error("APOS_EXTERNAL_FRONT_KEY is required in env to read the API");
  }
  const headers = { "APOS-EXTERNAL-FRONT-KEY": frontKey };

  // Pages
  const pageUrls = await fetchAllPages(aposHost, headers, locale);

  // Piece types: either CLI override or discover
  let pieceTypes = opts.pieceTypes ?? cli.pieceTypes;
  if (!pieceTypes) {
    pieceTypes = await discoverPieceTypes(aposHost, headers, locale);
  }

  const pieceUrls = [];
  for (const t of pieceTypes) {
    const urls = await fetchAllPieces(aposHost, headers, t, locale);
    pieceUrls.push(...urls);
  }

  // Merge, dedupe, sort
  const all = Array.from(new Set([...pageUrls, ...pieceUrls])).sort();
  return all;
}

// Allow running directly: prints JSON array to stdout
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap().then(list => {
    process.stdout.write(JSON.stringify(list, null, 2) + "\n");
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}