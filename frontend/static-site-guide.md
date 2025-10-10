# Static Site Generation Guide

Generate a static, deployable version of your ApostropheCMS + Astro site.

## Overview

This starter kit includes scripts that convert your dynamic CMS-powered site into a fully static website that can be deployed anywhere. The generator fetches all pages and content from your Apostrophe backend and renders them as static HTML files.

## Prerequisites

- Your ApostropheCMS backend is running and accessible
- You have content published in Apostrophe
- Node.js v18 or higher

## Important: Working Directory

**All commands in this guide should be run from the `frontend/` directory** (where your Astro project lives), not the project root.

```bash
# Navigate to the frontend directory first
cd frontend
```

All file paths mentioned (`.env`, `locale-config.js`, `scripts/`, etc.) are relative to the `frontend/` directory.

## Available npm Scripts

The starter kit includes these predefined scripts in `frontend/package.json`:

- `npm run build:static` - Generate static site (single locale)
- `npm run build:production` - Generate to `dist/` directory
- `npm run build:multilang` - Generate with multi-locale support (requires `locale-config.js`)
- `npm run preview:static` - Preview the generated static site locally

You can also run the script directly with `node scripts/generate-static-site.js` for more control.

## Quick Start

### 1. Configure API Access

The `APOS_EXTERNAL_FRONT_KEY` is the same key you use when starting your Apostrophe backend.

You have two options for providing the API key:

**Option A: Pass as environment variable (recommended for one-off builds)**

```bash
APOS_HOST=http://localhost:3000 \
APOS_EXTERNAL_FRONT_KEY=my-secret-key \
npm run build:static
```

**Option B: Create a `.env` file (recommended for frequent builds)**

Create `frontend/.env`:

```bash
# frontend/.env
APOS_HOST=http://localhost:3000
APOS_EXTERNAL_FRONT_KEY=my-secret-key
```

Then simply run:
```bash
npm run build:static
```

**Important:** If using `.env`, it's already in `.gitignore` - never commit your API key!

### 2. Generate Your Static Site

#### Single-Locale Sites (Default)

From the `frontend/` directory, run:

```bash
npm run build:static
```

Or with inline environment variables:

```bash
APOS_HOST=http://localhost:3000 \
APOS_EXTERNAL_FRONT_KEY=my-secret-key \
npm run build:static
```

**What happens behind the scenes:**
1. **Builds your Astro site** - Runs `npm run build` to create production assets
2. **Starts Astro's built-in preview server** - Temporarily serves your built site locally (on port 4321 by default)
3. **Fetches URLs from Apostrophe** - Contacts your CMS to get a list of all pages and content
4. **Renders each page** - Visits each URL through the preview server to get the final HTML
5. **Downloads images and assets** - Copies or downloads all uploads from your CMS (if they're not already on S3/CDN)
6. **Saves static files** - Writes everything to `static-dist/` directory
7. **Shuts down preview server** - Cleans up automatically when finished

The preview server is an internal step - you don't need to interact with it. The script handles starting and stopping it automatically.

> **Note:** The npm script `build:static` runs `node scripts/generate-static-site.js` behind the scenes.

#### Multi-Locale Sites

If your site uses multiple languages, first create a locale configuration file.

**Create `locale-config.js` in your `frontend/` directory:**

```javascript
// frontend/locale-config.js
export default {
  en: {
    baseUrl: 'https://yourdomain.com',
    prefix: '' // English at root
  },
  fr: {
    baseUrl: 'https://yourdomain.com',
    prefix: '/fr'
  },
  es: {
    baseUrl: 'https://yourdomain.com',
    prefix: '/es'
  }
  // Add more locales as needed
};
```

**Important:** The `prefix` values must match your Apostrophe locale configuration exactly.

Then run from the `frontend/` directory:

```bash
npm run build:multilang
```

Or with custom config path:

```bash
# Using npm script with custom config
npm run build:static -- --localeConfig=./locale-config.prod.js

# Or direct node command
node scripts/generate-static-site.js --localeConfig=./locale-config.prod.js
```

> **Note:** The npm script `build:multilang` uses `./locale-config.js` by default. For other config files, pass the path as shown above.

## Configuration Options

Customize the generation process with command-line options.

### Using npm Scripts with Options

You can pass options through npm scripts using `--`:

```bash
# Custom output directory
npm run build:static -- --out=build

# Use a different port (if 4321 is taken)
npm run build:static -- --port=3333

# Adjust concurrency for slower machines
npm run build:static -- --concurrency=4

# Increase retries for unreliable networks
npm run build:static -- --retries=5

# Combine multiple options
npm run build:static -- --out=build --concurrency=6 --retries=2
```

### Direct Script Usage

You can also run the script directly for more control:

```bash
node scripts/generate-static-site.js --out=build --concurrency=6
```

### All Available Options

| Option | Default | Description |
|--------|---------|-------------|
| `--out` | `static-dist` | Output directory for generated files |
| `--port` | `4321` | Port for Astro preview server |
| `--host` | `127.0.0.1` | Host for preview server |
| `--concurrency` | CPU count (max 8) | Max concurrent page fetches |
| `--retries` | `3` | Number of retries for failed fetches |
| `--pieceTypes` | Auto-discover | Force specific piece types: `article,product` |
| `--aposHost` | `$APOS_HOST` | Override Apostrophe host URL |
| `--localeConfig` | None | Path to locale configuration file |

### Example with Multiple Options

```bash
# Using npm script
npm run build:static -- --out=build --concurrency=6 --retries=2

# Or direct node command with locale config
node scripts/generate-static-site.js \
  --out=build \
  --concurrency=6 \
  --retries=2 \
  --localeConfig=./locale-config.js
```

## Using with Remote Apostrophe

For production builds using a remote CMS, from the `frontend/` directory:

```bash
# Pass environment variables inline
APOS_HOST=https://cms.yourdomain.com \
APOS_EXTERNAL_FRONT_KEY=your-production-key \
npm run build:static -- --out=production-build
```

Or add to your `frontend/.env`:
```bash
# frontend/.env
APOS_HOST=https://cms.yourdomain.com
APOS_EXTERNAL_FRONT_KEY=your-production-key
```

Then run:
```bash
npm run build:static -- --out=production-build
```

## Testing Your Static Site

After generation, test the static site locally. From the `frontend/` directory:

```bash
# Using npx serve (recommended)
npx serve static-dist

# Using Python
cd static-dist && python3 -m http.server 8080

# Using PHP
cd static-dist && php -S localhost:8080
```

Visit `http://localhost:3000` (for serve) or the appropriate port in your browser.

## Understanding the Output

Your generated static site in `frontend/static-dist/` will look like this:

```
static-dist/
├── index.html              # Homepage
├── about/
│   └── index.html          # /about/ page
├── contact/
│   └── index.html          # /contact/ page
├── _astro/                 # Astro assets (JS, CSS)
│   ├── index.abc123.css
│   └── index.def456.js
├── uploads/                # CMS images and files
│   └── attachments/
│       └── example.jpg
├── 404.html               # Not found page
└── [locale folders if multi-locale]
```

## Deploying Your Static Site

The `frontend/static-dist/` directory contains your complete static website ready for deployment.

### Quick Deploy Options

From the `frontend/` directory:

**Netlify:**
```bash
npx netlify-cli deploy --prod --dir=static-dist
```

**Vercel:**
```bash
npx vercel --prod static-dist
```

**Cloudflare Pages:**
```bash
npx wrangler pages deploy static-dist
```

**AWS S3 + CloudFront:**
```bash
aws s3 sync static-dist/ s3://your-bucket-name/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**GitHub Pages:**
```bash
# From frontend directory, push static-dist contents to gh-pages branch
git subtree push --prefix static-dist origin gh-pages
```

### Important Hosting Configuration

Make sure your hosting provider is configured to:
- ✅ Serve `index.html` for directory URLs (`/about/` → `/about/index.html`)
- ✅ Use `404.html` for not-found pages
- ✅ Set cache headers: Long cache for `/_astro/*`, short for HTML
- ✅ Enable gzip/brotli compression
- ✅ Configure redirects if needed

## Adding npm Scripts

For convenience, add these to your `frontend/package.json`:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "build:static": "node scripts/generate-static-site.js",
    "build:production": "node scripts/generate-static-site.js --out=dist",
    "build:multilang": "node scripts/generate-static-site.js --localeConfig=./locale-config.js",
    "preview:static": "npx serve static-dist"
  }
}
```

Then use from the `frontend/` directory:
```bash
npm run build:static
npm run preview:static
```

## Troubleshooting

### "APOS_EXTERNAL_FRONT_KEY is required"

**Problem:** The API key environment variable is not set.

**Solution:** 

Option 1 - Pass inline (no .env file needed):
```bash
APOS_EXTERNAL_FRONT_KEY=my-secret-key npm run build:static
```

Option 2 - Add to `frontend/.env` file:
```bash
APOS_EXTERNAL_FRONT_KEY=my-secret-key
```

Option 3 - Export in your terminal session:
```bash
export APOS_EXTERNAL_FRONT_KEY=my-secret-key
npm run build:static
```

### "Preview server did not respond"

**Problem:** Port 4321 is already in use or the build is taking too long.

**Solutions:**
```bash
# Try a different port
npm run build:static -- --port=3333

# Check what's using the port
lsof -i :4321  # macOS/Linux
netstat -ano | findstr :4321  # Windows
```

### "No URLs found to render"

**Problem:** The script can't fetch content from Apostrophe.

**Solutions:**
1. Verify your backend is running: `curl $APOS_HOST/api/v1/@apostrophecms/page`
2. Check that `APOS_HOST` is correct in `.env`
3. Verify your API key has read permissions
4. Ensure you have published pages in Apostrophe

### "Failed to download: /uploads/..."

**Problem:** Upload assets can't be downloaded.

**Solutions:**
- Check that uploads exist in `backend/public/uploads/`
- For remote backends, verify URLs are publicly accessible
- Check network connectivity to your Apostrophe host
- Ensure your API key has permission to access uploads

### Some Pages Fail to Render

**Problem:** Individual pages return errors during rendering.

**Solutions:**
```bash
# Increase retry attempts
npm run build:static -- --retries=5

# Reduce concurrency (helps with rate limiting)
npm run build:static -- --concurrency=2

# Check the Astro preview server logs for errors
# The script shows which pages failed
```

### Multi-Locale Issues

**Problem:** Locales not generating correctly.

**Solutions:**
1. Verify `locale-config.js` prefixes match Apostrophe exactly
2. Check that content exists for all locales in Apostrophe
3. Test API manually: `curl "$APOS_HOST/api/v1/@apostrophecms/page?aposLocale=fr"`
4. Ensure locale codes match between both configurations

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml` in your **project root**:

```yaml
name: Build and Deploy Static Site

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'frontend/package-lock.json'
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Generate static site
        working-directory: ./frontend
        env:
          APOS_HOST: ${{ secrets.APOS_HOST }}
          APOS_EXTERNAL_FRONT_KEY: ${{ secrets.APOS_EXTERNAL_FRONT_KEY }}
        run: npm run build:static -- --out=dist
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './frontend/dist'
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

**Remember to add secrets in GitHub:** Settings → Secrets → Actions

### GitLab CI Example

Create `.gitlab-ci.yml` in your **project root**:

```yaml
stages:
  - build
  - deploy

variables:
  NODE_VERSION: "18"

build:
  stage: build
  image: node:${NODE_VERSION}
  before_script:
    - cd frontend
  script:
    - npm ci
    - npm run build:static -- --out=dist
  artifacts:
    paths:
      - frontend/dist/
  only:
    - main

deploy:
  stage: deploy
  image: node:${NODE_VERSION}
  before_script:
    - cd frontend
  script:
    - npx netlify-cli deploy --prod --dir=dist
  only:
    - main
```

## Performance Tips

### Optimize Generation Speed

1. **Adjust concurrency** based on your machine:
   ```bash
   # Faster machines
   npm run build:static -- --concurrency=12
   
   # Slower machines or to be gentle on CMS
   npm run build:static -- --concurrency=2
   ```

2. **Use local uploads** when possible:
   - Place uploads in `backend/public/uploads/`
   - Much faster than downloading from remote server

3. **Force specific piece types** if auto-discovery is slow:
   ```bash
   npm run build:static -- --pieceTypes=article,news,event
   ```

### Optimize Output Size

1. **Image optimization**: Use Apostrophe's image processing
2. **Minification**: Already handled by Astro build
3. **Compression**: Enable gzip/brotli on your hosting

## Best Practices

### Version Control

The `frontend/.gitignore` is already configured to exclude:
- `static-dist/` (generated output)
- `.env` (sensitive credentials)
- `node_modules/`

Do commit:
- The generation scripts (already included in `frontend/scripts/`)
- Your `frontend/locale-config.js` (if using multi-locale)

### Content Update Workflow

1. **Edit content** in Apostrophe CMS
2. **Regenerate** the static site from the `frontend/` directory:
   ```bash
   cd frontend
   npm run build:static
   ```
3. **Test** locally: `npm run preview:static`
4. **Deploy** to your hosting provider

Consider setting up:
- Webhooks from Apostrophe to trigger regeneration
- Scheduled builds (e.g., nightly)
- Manual triggers for immediate updates

### Monitoring

After deployment, monitor:
- 404 errors (broken links)
- Page load times
- Core Web Vitals
- Asset delivery from CDN

## Advanced Usage

### Custom Piece Types

If you have custom piece types that aren't auto-discovered:

```bash
npm run build:static -- --pieceTypes=article,news,product,event,testimonial
```

### Environment-Specific Configs

Create different configs for different environments in your `frontend/` directory:

```bash
# Development config
cp locale-config.js locale-config.dev.js

# Production config
cp locale-config.js locale-config.prod.js

# Use specific config
node scripts/generate-static-site.js --localeConfig=./locale-config.prod.js
```

### Incremental Builds

For large sites, consider:
1. Tracking changed content in Apostrophe
2. Regenerating only changed pages (requires custom implementation)
3. Using a CDN with smart invalidation

## Next Steps

- ✅ Configure your deployment target
- ✅ Set up automated builds on content changes
- ✅ Configure CDN caching rules
- ✅ Set up monitoring and analytics
- ✅ Document your deployment process for your team

## Getting Help

If you encounter issues:

1. **Check the console output** - The script provides detailed error messages
2. **Test components separately** - Verify Apostrophe API, Astro build, and preview server individually
3. **Review this guide** - Many common issues are covered in Troubleshooting
4. **Check documentation**:
   - [Apostrophe Docs](https://docs.apostrophecms.org/)
   - [Astro Docs](https://docs.astro.build/)

---

**Your static site is ready to deploy! 🚀**