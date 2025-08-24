#!/usr/bin/env node
// Builds the Astro site, starts a local preview server, generates a sitemap by
// reading from an ApostropheCMS backend, crawls all pages concurrently, writes
// HTML to a static output directory, copies Astro assets, and pulls Apostrophe
// uploads either from local FS (monorepo) or by downloading referenced image URLs.
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


import os from "os";
import fs from "fs";
import path from "path";
import { spawn, execSync } from "child_process";
import { generateSitemap } from "./generateSitemap.js";

function parseCliArgs() {
  const args = process.argv.slice(2);
  const opts = {};
  for (const a of args) {
    const [k, v] = a.split("=");
    if (k === "--out") opts.out = v;
    if (k === "--port") opts.port = Number(v);
    if (k === "--host") opts.host = v;
    if (k === "--concurrency") opts.concurrency = Number(v);
    if (k === "--pieceTypes") opts.pieceTypes = v.split(",").map(s => s.trim()).filter(Boolean);
    if (k === "--aposHost") opts.aposHost = v;
  }
  return opts;
}

function fetchWithTimeout(url, opts = {}, ms = 30000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  return fetch(url, { ...opts, signal: ctl.signal }).finally(() => clearTimeout(t));
}

async function waitForServer(url, { timeoutMs = 60000, intervalMs = 500 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetchWithTimeout(url, {}, intervalMs);
      if (res.ok) return true;
    } catch {}
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error(`Preview server did not respond at ${url} within ${timeoutMs}ms`);
}

function cleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function writeHtmlForPath(rootDir, urlPath, html) {
  // Map '/about/' -> '<out>/about/index.html', '/' -> '<out>/index.html'
  const isFile = /\.[a-z0-9]+$/i.test(urlPath);
  let outPath;
  if (isFile) {
    outPath = path.join(rootDir, urlPath.replace(/^\//, ""));
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
  } else if (urlPath === "/") {
    outPath = path.join(rootDir, "index.html");
  } else {
    outPath = path.join(rootDir, urlPath.replace(/^\//, ""), "index.html");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
  }
  fs.writeFileSync(outPath, html);
}

async function extractImagesFromHtml(staticDir, aposHost) {
  // Scan generated HTML and download remote images under uploads/
  const htmlFiles = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(p);
    }
  })(staticDir);

  const uploadUrls = new Set();
  const re = new RegExp(`(?:src|href)=(?:"|')(?:${aposHost.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})?/uploads/[^"']+`, "gi");

  for (const f of htmlFiles) {
    const html = fs.readFileSync(f, "utf8");
    const matches = html.match(re) || [];
    for (const m of matches) {
      const url = m.split(/=|['"]/).pop();
      uploadUrls.add(url);
    }
  }

  for (const u of uploadUrls) {
    try {
      const full = u.startsWith("http") ? u : `${aposHost}${u}`;
      const rel = full.replace(/^https?:\/\/[^/]+/, ""); // /uploads/...
      const dest = path.join(staticDir, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const res = await fetchWithTimeout(full, {}, 60000);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buf);
      }
    } catch {}
  }
}

async function copyAposUploadsFromFs(staticDir) {
  // Best-effort local paths for monorepo setups
  const candidates = [
    path.join(process.cwd(), "..", "backend", "public", "uploads"),
    path.join(process.cwd(), "backend", "public", "uploads"),
    path.join(process.cwd(), "..", "..", "backend", "public", "uploads"),
    path.join(process.cwd(), "public", "uploads")
  ];
  for (const p of candidates) {
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
      copyDir(p, path.join(staticDir, "uploads"));
      return true;
    }
  }
  return false;
}

async function mapLimit(items, limit, worker) {
  const q = [...items];
  const runners = Array.from({ length: limit }, async function run() {
    while (q.length) {
      const it = q.shift();
      try { await worker(it); } catch (e) { console.warn("Fetch error:", e.message); }
    }
  });
  await Promise.all(runners);
}

async function main() {
  const cli = parseCliArgs();
  const outDir = path.resolve(cli.out ?? "static-dist");
  const port = cli.port ?? 4321;
  const host = cli.host ?? "127.0.0.1";
  const previewUrl = `http://${host}:${port}`;
  const concurrency = Math.min(8, Math.max(2, cli.concurrency ?? os.cpus().length));
  const aposHost = cli.aposHost ?? (process.env.APOS_HOST || "http://localhost:3000");
  const frontKey = process.env.APOS_EXTERNAL_FRONT_KEY;
  if (!frontKey) {
    console.error("APOS_EXTERNAL_FRONT_KEY is required");
    process.exit(1);
  }

  console.log("🛠️  Building Astro...");
  execSync("npm run build", { stdio: "inherit" });

  console.log("🌐 Starting Astro preview...");
  const astro = spawn("npm", ["run", "preview", "--", "--host", host, "--port", String(port)], {
    stdio: ["ignore", "inherit", "inherit"],
    detached: process.platform !== "win32"
  });

  function shutdown() {
    if (!astro.killed) {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", String(astro.pid), "/T", "/F"]);
      } else {
        try { process.kill(-astro.pid, "SIGTERM"); } catch { try { astro.kill("SIGTERM"); } catch {} }
      }
    }
  }
  process.on("exit", shutdown);
  process.on("SIGINT", () => { shutdown(); process.exit(1); });
  process.on("SIGTERM", () => { shutdown(); process.exit(1); });

  console.log(`⏳ Waiting for preview at ${previewUrl} ...`);
  await waitForServer(previewUrl, { timeoutMs: 90000, intervalMs: 800 });
  console.log("✅ Preview is up.");

  console.log("🧭 Generating sitemap from Apostrophe...");
  const urls = await generateSitemap({ aposHost, pieceTypes: cli.pieceTypes });
  console.log(`📄 ${urls.length} URLs to render.`);

  console.log("📂 Preparing output directory:", outDir);
  cleanDir(outDir);

  // Copy **browser assets** in a way that matches the HTML:
  // - For SSR builds: copy `dist/client/*` directly into `<out>/`
  // - For SSG builds: copy `dist/*` (which already has `/_astro` etc. at root)
  const dist = path.join(process.cwd(), "dist");
  const distClient = path.join(dist, "client");
  if (fs.existsSync(distClient)) {
    console.log("📦 Detected SSR build shape — copying dist/client/* to output root...");
    copyDir(distClient, outDir);
  } else if (fs.existsSync(dist)) {
    console.log("📦 Detected static build shape — copying dist/* to output root...");
    copyDir(dist, outDir);
  }

  console.log(`🚚 Rendering pages (concurrency: ${concurrency})...`);
  let done = 0;
  await mapLimit(urls, concurrency, async (u) => {
    const pageUrl = new URL(u, previewUrl).toString();
    const res = await fetchWithTimeout(pageUrl, {}, 60000);
    if (!res.ok) throw new Error(`GET ${pageUrl} -> ${res.status}`);
    const html = await res.text();
    writeHtmlForPath(outDir, new URL(u, "http://dummy").pathname, html);
    done += 1;
    if (done % 10 === 0 || done === urls.length) {
      process.stdout.write(`\r   ${done}/${urls.length} pages`);
    }
  });
  process.stdout.write("\n");

  console.log("🖼️ Handling uploads...");
  const copied = await copyAposUploadsFromFs(outDir);
  if (!copied) {
    console.log("   No local uploads found — scanning HTML and downloading referenced assets...");
    await extractImagesFromHtml(outDir, aposHost);
  }

  const notFound = path.join(outDir, "404.html");
  if (!fs.existsSync(notFound)) {
    fs.writeFileSync(notFound, "<!doctype html><meta charset='utf-8'><title>Not found</title><h1>404</h1>");
  }

  console.log("🎉 Static export complete:", outDir);
  shutdown();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}