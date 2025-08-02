# Apollo Starter Kit for ApostropheCMS + Astro Integration

**Build lightning-fast websites with the editing experience your content team actually wants to use.**

A production-ready template combining [ApostropheCMS](https://docs.apostrophecms.org/) as a headless backend with [Astro](https://astro.build/) as a modern frontend framework. This template includes a beautiful design system and rich content features, all completely free and open source.

## ✨ What Makes This Special

- **🚀 Headless CMS with Frontend Integration** - Full ApostropheCMS Admin UI with in-context editing
- **⚡ Modern Frontend** - Astro for optimal performance and developer experience  
- **🎨 Production Styled** - Beautiful Bulma-based design system included
- **📱 Fully Responsive** - Mobile-first approach with modern web standards
- **💰 Completely Free** - No license fees, perfect for any project size

## ApostropheCMS + Astro Starter Kits

**Choose the right foundation for your project:**

## 🌟 Apollo Starter Kit (This Repository)
**Perfect if you want:** A production-ready foundation with beautiful design included

- **Production-Ready Design**: Complete Bulma-based design system with modern styling
- **Rich Feature Set**: Advanced widgets, layouts, and pre-styled components
- **Faster Time-to-Market**: Launch professional sites with minimal additional styling
- **Content-Rich Sites**: Built-in blog, author relationships, and content management features
- **Best for**: Teams who want to focus on content and functionality over design from scratch

## 🎯 [Astro Essentials Starter Kit](https://github.com/apostrophecms/starter-kit-astro-essentials)
**Perfect if you want:** A clean, minimal foundation to build your own design system

- **Minimal & Non-opinionated**: Essential building blocks without imposed design decisions
- **Core Components**: Basic page types, essential widgets, and clean architecture  
- **Maximum Flexibility**: Build your own styling approach and component library
- **Learning Focus**: Understand the ApostropheCMS + Astro integration from the ground up
- **Best for**: Developers who want full creative control and custom design systems

---

**Ready for enterprise features?** [Upgrade to Apollo Pro](https://apostrophecms.com/contact-us) for advanced permissions, automated translations, SEO optimization, document versioning, and more professional capabilities.

## Table of Contents
<!-- TOC -->
- [Apollo Starter Kit for ApostropheCMS + Astro Integration](#apollo-starter-kit-for-apostrophecms--astro-integration)
  - [✨ What Makes This Special](#-what-makes-this-special)
  - [ApostropheCMS + Astro Starter Kits](#apostrophecms--astro-starter-kits)
  - [🌟 Apollo Starter Kit (This Repository)](#-apollo-starter-kit-this-repository)
  - [🎯 Astro Essentials Starter Kit](#-astro-essentials-starter-kit)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Quick Start](#quick-start)
    - [Alternative: Empty Database Setup](#alternative-empty-database-setup)
  - [🏗️ Project Architecture](#️-project-architecture)
    - [How It Works](#how-it-works)
    - [Project Structure](#project-structure)
    - [For ApostropheCMS Developers](#for-apostrophecms-developers)
    - [For Astro Developers](#for-astro-developers)
    - [Routing and Templates](#routing-and-templates)
    - [Widget Flexibility](#widget-flexibility)
    - [Configuration Notes](#configuration-notes)
  - [🌟 Features \& Widgets](#-features--widgets)
    - [Widgets](#widgets)
    - [Pieces](#pieces)
    - [Pages](#pages)
  - [🖼️ Image Helper Functions](#️-image-helper-functions)
    - [Overview](#overview)
    - [Working with Image Relationships](#working-with-image-relationships)
    - [Working with Direct Attachments](#working-with-direct-attachments)
    - [Image Cropping and Sizes](#image-cropping-and-sizes)
    - [Working with Focal Points](#working-with-focal-points)
    - [Core Functions Reference](#core-functions-reference)
  - [🖌️ Theming](#️-theming)
    - [Steps to Customize](#steps-to-customize)
    - [Example: Overriding Common Variables](#example-overriding-common-variables)
    - [Full List of Variables](#full-list-of-variables)
    - [Notes](#notes)
    - [Troubleshooting](#troubleshooting)
  - [⚙️ Package scripts](#️-package-scripts)
    - [Root `package.json` scripts](#root-packagejson-scripts)
    - [Frontend folder scripts](#frontend-folder-scripts)
    - [Backend folder scripts](#backend-folder-scripts)
  - [🚀 Deploying to production](#-deploying-to-production)
    - [**Using ApostropheCMS hosting (Recommended)**](#using-apostrophecms-hosting-recommended)
    - [**Using 3rd-party hosting**](#using-3rd-party-hosting)
      - [Backend (ApostropheCMS) Deployment](#backend-apostrophecms-deployment)
      - [Frontend (Astro) Deployment](#frontend-astro-deployment)
      - [Netlify Deployment Example](#netlify-deployment-example)
  - [💎 Ready for More?](#-ready-for-more)
    - [🚀 **Apollo Pro Features**](#-apollo-pro-features)
  - [🚑 Need Help?](#-need-help)
  - [📚 Learn More](#-learn-more)
  - [License](#license)


## Introduction
Overall, this project utilizes ApostropheCMS as a headless backend with Astro as a frontend. What sets this apart from the typical headless use of ApostropheCMS is the addition of a package, [apostrophe-astro](https://github.com/apostrophecms/apostrophe-astro) in the Astro frontend project. This allows for full use of the ApostropheCMS Admin UI, including in-context editing. At the same time, this package also largely automates and simplifies fetching content from the ApostropheCMS backend without writing REST API calls into your code.

## 🚀 Getting Started

### Prerequisites
**Required:**
- Node.js v20 or later (v22 recommended)
- MongoDB v6.0 or later (local server or Atlas). See the [ApostropheCMS documentation](https://docs.apostrophecms.org/guide/development-setup.html) for setup.

**Windows Users:**
- Windows Subsystem for Linux 2 (WSL2) required for Apostrophe development. This ensures consistent behavior with image processing tools and file system operations. Learn more about setting up WSL2 from [Microsoft](https://learn.microsoft.com/en-us/windows/wsl/install) and in our [documentation](https://docs.apostrophecms.org/cookbook/windows-development.html).

### Quick Start

The codebases located in the `backend` and `frontend` folders should be treated as interlinked but separate projects.

To simplify dependency management, this repository includes several root-level scripts for convenience. The `postinstall` script automatically installs dependencies for both the `frontend` and `backend` folders when you run `npm install` at the root.

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Load starter content** (optional, but recommended)
   ```bash
   npm run load-starter-content
   ```
   This fetches a starter database and media files. You'll be prompted to set an admin password.

3. **Start development servers**
   Open two terminals:
   - **Mac/Linux users**: One terminal in `frontend` folder, one in `backend` folder
   - **Windows users**: WSL terminal for `backend` folder, WSL or Windows terminal for `frontend` folder

   ```bash
   # Terminal 1 - Backend (use WSL on Windows)
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

   > **That's it!** The `npm run dev` scripts automatically handle authentication between the frontend and backend in development mode setting the `APOS_EXTERNAL_FRONT_KEY` to "dev". For production or when you are starting your frontend or backend with a different command you will have to set this environment variable to the same value for both.

   **Optional:** If running the backend on a different server/port, set the frontend's backend URL:
   ```bash
   # In the frontend terminal only
   export APOS_HOST=your-backend-url
   ```

Your site will be available at `http://localhost:4321` (Astro frontend). The ApostropheCMS backend will be available at `http://localhost:3000`, but it just gives notification of whether it is connected to the Astro frontend. In most cases you never need to access this page.

> **Note:** Astro is less stringent about project setup in development mode. Before deployment, run `npm run build` followed by `npm run preview` in the `frontend` folder to test production behavior. We don't recommend using the root `npm run serve-frontend` script during development - it's used for ApostropheCMS hosting.

### Alternative: Empty Database Setup
⚠️ If you prefer to start with an empty database instead of the starter content you will need to add an admin user:

```bash
cd backend
node app @apostrophecms/user:add admin admin
```
This creates a user named `admin` with the correct privileges. You will be asked to enter a password.

---

## 🏗️ Project Architecture

### How It Works
This project utilizes ApostropheCMS as a headless backend with Astro as a frontend. What sets this apart from typical headless setups is the [apostrophe-astro](https://github.com/apostrophecms/apostrophe-astro) package in the Astro frontend project. This enables full use of the ApostropheCMS Admin UI, including in-context editing, while largely automating content fetching from the backend without writing REST API calls.

### Project Structure
```
├── backend/               # ApostropheCMS application
│   ├── modules/           # Custom modules (pages, pieces, widgets)
│   ├── app.js             # Main configuration
│   ├── package.json       # ApostropheCMS-specific scripts
│   └── ...
├── frontend/              # Astro application
│   ├── src/
│   │   ├── pages/         # Single [...slug].astro route
│   │   ├── templates/     # Page templates
│   │   ├── widgets/       # Widget templates
│   │   └── components/    # Astro components
│   ├── astro.config.mjs   # Astro configuration
│   ├── package.json       # Astro-specific scripts
│   └── ...
└── README.md              # This file
└── package.json.          # Whole project scripts
```

### For ApostropheCMS Developers

If you've worked with ApostropheCMS previously, the backend should look familiar. Custom modules for pages, pieces, and widgets are in the `modules` folder, with core module configuration in `modules/@apostrophecms`.

**What stays the same:**
- Module registration in `app.js`
- Page types added to `modules/@apostrophecms/page/index.js`
- Most [module configuration settings](https://docs.apostrophecms.org/reference/module-api/module-overview.html#module-configuration) for Admin UI, request routing, and MongoDB interaction

**Key differences:**
- **No frontend code in modules** - Stylesheets, templates (implemented as Astro components), and client-side JavaScript go in the Astro project instead
- **No template helpers** - Skip `helper()`, `extendHelpers()`, `components()`, and `renderRoutes()` functions
- **Schema sharing** - Some widget schemas have been moved to `lib/schema-mixins` for reuse between widgets and pages

The `modules/@apostrophecms/home-page` module loads the core `views/layout.html` file, which has been modified to show project status information instead of the Admin UI.

### For Astro Developers

The Astro portion follows standard conventions with components in `src` and assets in `public`. Configuration is managed through `astro.config.mjs` following standard practices.

**What stays the same:**
- Standard Astro project organization
- Normal component and template patterns
- Client-side asset management

**Key differences:**
- **Single route system** - Instead of multiple routes in `pages`, there's one `[...slug].astro` file that handles all routing
- **Template mapping** - Pages map to templates in the `templates` folder, mapped by the `index.js` file in that folder. Each template corresponds to an ApostropheCMS page type, including `index.html` and `show.html` piece-page types
- **Widget system** - The `widgets` folder contains templates for ApostropheCMS widgets, mapped through an `index.js` file in that folder.
- **Required configuration** - The `apostrophe` integration and `output: 'server'` settings must remain for backend integration

### Routing and Templates

Unlike typical Astro projects with multiple route files, this project uses a single `[...slug].astro` route that:

1. Handles all URL routing using pages from the CMS backend
2. Maps page types to corresponding templates in the `templates` folder
3. Populates template content with data from the CMS
4. Renders widgets using templates from the `widgets` folder

Each page template corresponds to a registered ApostropheCMS page or piece-page type. Content is populated by data from the CMS backend and inserted into slots in the main `[...slug].astro` file. Widget data is handled through the mapped templates and added to page templates using the `AposArea` helper component.

Read more in the [`apostrophe-astro` documentation](https://github.com/apostrophecms/apostrophe-astro)  or in the [Apollo tutorial series](https://docs.apostrophecms.org/tutorials/astro/apostrophecms-and-astro.html).

### Widget Flexibility

This architecture allows widget templates to be used outside specialized `area` schema fields, providing design flexibility without code repetition. However, this means widget schema fields for content must also be added to page schemas. The `backend/lib/schema-mixins` folder facilitates this by allowing schema imports in both widget modules and page templates.

### Configuration Notes

The `astro.config.mjs` includes required settings for ApostropheCMS integration:
- `apostrophe` integration in the integrations array
- `output: 'server'` for server-side rendering
- Custom preprocessor options (this project uses a different SASS compiler for [Bulma CSS framework](https://bulma.io/) compatibility)

Read more in the [`apostrophe-astro` documentation](https://github.com/apostrophecms/apostrophe-astro).

## 🌟 Features & Widgets
This project is more opinionated than some of our other project starter kits. It uses the [Bulma CSS framework](https://bulma.io/). For a more streamlined starting point you can use the [Astro Essentials starter kit](https://github.com/apostrophecms/starter-kit-astro-essentials) repository.

### Widgets
This project provides the core ApostropheCMS widgets, plus seven additional widgets:

- Layout
    - rows-widget: adds rows with varying numbers of columns for responsive content layout
    - grid-layout-widget: adds custom or predefined CSS grid-based layouts
- Content
    - hero-widget: a customizable hero section with options for color gradient, image, or video backgrounds
    - slideshow-widget: a customizable slideshow widget
    - accordion-widget: adds an accordion for organizing content into collapsible sections
    - card-widget: allows for the creation of multiple different customizable card-types
    - link-widget: adds links that can be styled as text or a highly customizable button

### Pieces
This project creates two pieces. The first is an `article` piece for the creation of content pieces like blog posts or news articles. The second is an `author` piece that is used in relationship with the article pieces.

### Pages
This project creates core `default` and `@apostrophecms/home-page` pages. It also creates two pages for displaying the article pieces.

The home-page has three potential layouts selected from the utility menus on the right-side of the page manager. The 'Minimal' layout inherits the header and footer components that is added to all the project pages. It also has a single area that can take any of the project widgets. The 'Foundation' layout adds a hero section at the top of the page, while the 'Showcase' adds a slideshow.

The default page has a layout that is identical to the 'Minimal' home-page layout.

Piece-type pages in ApostropheCMS only projects are used to either display multiple pieces (`index.html`) or individual pieces (`show.html`). This project has both types of pages, mapping the index of all pieces to the `ArticleIndexPage.astro` template and the display of the individual pieces to the `ArticleShowPage.astro` template. Both of these page types have three layouts for you to select from. Depending on the index layout, there are three or four additional areas for adding widgets with content before and after the piece content. The index page also demonstrates how to handle pagination in a hybrid project.

## 🖼️ Image Helper Functions

### Overview
These helper functions are designed to work with images in your Astro frontend that come from ApostropheCMS through relationships or attachment fields. If you're using the image widget within an area, you should use the `AposArea` helper instead - these utilities are specifically for handling images that are part of your content model.

**Important:** These helpers expect a single attachment object, not an array. When working with relationships or array fields, make sure to pass a single image object (e.g., `page.relationship._image[0]`) rather than the full array.

### Working with Image Relationships
When you have a relationship field to `@apostrophecms/image` in your content type, you'll typically need to:
1. Get the image URL (potentially at different sizes for responsive images)
2. Handle focal points if configured
3. Get the image dimensions including any cropping that should be applied
4. Set up proper alt text

Here's a typical example:
```js
---
import {
  getAttachmentUrl,
  getAttachmentSrcset,
  getFocalPoint,
  getWidth,
  getHeight
} from '../lib/attachments.js';

// Get first image from relationship
const image = relationshipField._image[0];
---

<img
  src={getAttachmentUrl(image, { size: 'full' })}
  srcset={getAttachmentSrcset(image)}
  sizes="(max-width: 800px) 100vw, 800px"
  alt={image.alt || image.title || 'Image description'}
  width={getWidth(image)}
  height={getHeight(image)}
  style={`object-position: ${getFocalPoint(image)};`}
/>
```

### Working with Direct Attachments
For attachment fields (like logo fields), the pattern is similar:

```js
<img 
  src={getAttachmentUrl(attachmentField)}
  width={getWidth(attachmentField)}
  height={getHeight(attachmentField)}
  alt="Logo"
/>
```

### Image Cropping and Sizes

**Automatic Crop Handling**

If you set a crop region for an image in the ApostropheCMS Admin UI, all the helper methods will automatically respect that crop. You don't need to do anything special in your code - the cropped version will be used when generating URLs and srcsets.

**Size Variants**

The default size variants are:
- `one-sixth` (190×350px)
- `one-third` (380×700px)
- `one-half` (570×700px)
- `two-thirds` (760×760px)
- `full` (1140×1140px)
- `max` (1600×1600px)

These sizes will be used to generate the srcset and can be selected by name for the `getAttachmentUrl()` method:

```
getAttachmentUrl(image, { size: 'full' })
```

You can use custom size names in both `getAttachmentUrl()` and the srcset options. For example:
```js
const customUrl = getAttachmentUrl(image, { size: 'custom-banner' });

// Custom srcset configuration
const srcset = getAttachmentSrcset(image, {
  sizes: [
    { name: 'small', width: 300 },
    { name: 'medium', width: 600 },
    { name: 'large', width: 900 },
  ]
});
```

> Important: These helpers don't generate the image sizes - they just reference sizes that already exist. To use custom sizes, you must configure the [`@apostrophecms/attachment` module](https://docs.apostrophecms.org/reference/modules/attachment.html#configuration) to create those sizes when images are uploaded. You can do this in your backend configuration:

```javascript
// modules/@apostrophecms/attachment/index.js
module.exports = {
  options: {
    // Define what sizes should be created on upload
    imageSizes: {
      'custom-banner': { width: 1200, height: 400 },
      'square-thumb': { width: 300, height: 300 },
      'small': { width: 300 },
      'medium': { width: 600 },
      'large': { width: 900 }
    }
  }
};
```

See the [attachment module documentation](https://docs.apostrophecms.org/reference/modules/attachment.html#configuration) for complete configuration options.

### Working with Focal Points
When using focal points set in the ApostropheCMS admin UI, you'll need to:
1. Use `object-position` with the focal point value
2. Set appropriate Bulma image classes (like `is-fullwidth`)

```js
<figure class="image">
  <img
    src={getAttachmentUrl(image)}
    style={`object-position: ${getFocalPoint(image)}; object-fit: cover;`}
    class="is-fullwidth"
    width={getWidth(image)}
    height={getHeight(image)}
    alt="Image with focal point"
  />
</figure>
```

The `getFocalPoint()` function returns coordinates in the format "X% Y%" (e.g., "50% 50%" for center). If no focal point is set, it returns the default value (default is "center center").

### Core Functions Reference
Key functions available (see JSDoc comments in source for detailed documentation):
- `getAttachmentUrl(attachmentObject, options?)`: Get URL for an image with optional size (defaults to 'full')
- `getAttachmentSrcset(attachmentObject, options?)`: Generate responsive srcset string
- `getWidth(imageObject)`: Get image width, respecting crops
- `getHeight(imageObject)`: Get image height, respecting crops
- `getFocalPoint(attachmentObject, defaultValue?)`: Get focal point coordinates for styling

## 🖌️ Theming

Customizing the theme in this project is straightforward and leverages Bulma's powerful theming capabilities. You can override Bulma's default variables to match your brand or design requirements by editing the `frontend/src/styles/main.scss` file. This is done **before importing Bulma** so that your customizations are applied throughout the project.

### Steps to Customize

1. Navigate to the `frontend/src/styles/main.scss` file.
2. Locate the section for overriding Bulma variables.
3. Uncomment and modify the variables you wish to customize. You can define colors, typography, spacing, and more.
4. Save your changes, and the updated theme will automatically apply when you rebuild the project.

### Example: Overriding Common Variables

Here's an example of how to customize some of Bulma's common variables. These variables are commented out by default. Uncomment and modify them as needed:

```scss
@use 'bulma/sass/utilities/initial-variables' as * with (
  // Colors
  $turquoise: hsl(171, 100%, 41%),   // Primary color
  $cyan: hsl(204, 86%, 53%),         // Info color
  $green: hsl(141, 71%, 48%),        // Success color
  $yellow: hsl(48, 100%, 67%),       // Warning color
  $red: hsl(348, 100%, 61%),         // Danger color

  // Typography
  $family-sans-serif: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif,
  $family-monospace: monospace,
  $size-1: 3rem,
  $size-2: 2.5rem,
  $size-3: 2rem,
  $size-4: 1.5rem,
  $size-5: 1.25rem,
  $size-6: 1rem
);
```

### Full List of Variables
For a comprehensive list of all customizable variables, refer to the [Bulma documentation](https://bulma.io/documentation/customize/list-of-sass-variables/) on variables. This resource provides details on all available options for customization, including advanced options for responsive breakpoints, spacing, and more.

### Notes
* **Order matters**: Ensure your variable overrides are declared before importing Bulma to avoid conflicts.
* **SASS compatibility**: This setup uses the modern SASS syntax with @use and @forward. If you are unfamiliar with these concepts, refer to the SASS documentation for more information.
* **Theme consistency**: To maintain a cohesive design, consider defining your core color palette and typography styles at the beginning of your project.

### Troubleshooting
If your changes are not reflected:

* Ensure your variables are correctly uncommented and modified.
* Check for any caching issues by clearing your browser cache or restarting the build process.

## ⚙️ Package scripts

### Root `package.json` scripts

The root of the project has several useful scripts located in the `package.json` file. Running `npm run install` in the root directory will trigger the `postinstall` script. This will install the dependencies for both the ApostropheCMS and Astro projects. Similarly, `npm run update` will update dependencies for both the `frontend` and `backend` folders. The rest of the scripts in this file are primarily used for project deployment to ApostropheCMS hosting.

### Frontend folder scripts

The main scripts for the Astro project located in the frontend folder are `dev`, `preview`, and `build`. These first two of these scripts will allow you to start the Astro server in either development or preview mode. The `build` script should be run prior to starting the server in preview mode. The remainder of the scripts are for deployment and may need to be altered to fit your hosting solution.

### Backend folder scripts

Typically, you will only use the `dev` script in the backend folder outside of deployment. You can consult the [ApostropheCMS hosting](https://docs.apostrophecms.org/guide/hosting.html) recipes to see how these other scripts should be used.

## 🚀 Deploying to production

### **Using ApostropheCMS hosting (Recommended)**

ApostropheCMS can provide easy hosting for any ApostropheCMS-Astro monorepo with little or no extra configuration. This can be set up for deployment from Github or other code repository.

ApostropheCMS hosting will automatically handle:
- Database provisioning and management
- Asset storage and delivery
- SSL certificate management
- Automatic backups
- Security updates

In the future, we will be providing a path to create your own account and create a new hosted project. In the meantime, you can [learn more](https://apostrophecms.com/hosting) and [contact us](https://apostrophecms.com/contact-us) to get your hosting set up.

### **Using 3rd-party hosting**

Third-party hosting will typically require separate servers for the ApostropheCMS and Astro portions of the repositories. This is the typical pattern seen with other CMS that are used with Astro. You will need to specify whether you want the `backend` ApostropheCMS portion of the repo, or the `frontend` Astro project hosted. How this is accomplished will depend on the provider.

#### Backend (ApostropheCMS) Deployment

Your ApostropheCMS backend requires:
- Node.js environment (v20 or later recommended)
- MongoDB database
- Asset storage solution (cloud storage like AWS S3)

There are several examples of common deployment strategies in our [documentation](https://docs.apostrophecms.org/guide/hosting.html)

Example deployment steps for a typical provider:
1. Set up a MongoDB instance (Atlas, DigitalOcean, etc.)
2. Configure your server with Node.js and PM2
3. Set up your environment variables:
   ```bash
   NODE_ENV=production
   APOS_MONGODB_URI=YOUR_mongodb_connection_string
   APOS_EXTERNAL_FRONT_KEY=a_random_string
   APOS_S3_BUCKET=YOUR-bucket-name
   APOS_S3_SECRET=YOUR-s3-secret
   APOS_S3_KEY=YOUR-s3-key
   APOS_S3_REGION=YOUR-chosen-region
   ```
The remainder of the deployment will depend on the hosting platform being used and how that deployment is triggered. Generally, it will comprise a build step followed by bringing up the server. If you are not deploying with Git, you will also need to set the `APOS_RELEASE_ID` to a unique, random value. Again, make sure that you specify that the `backend` folder is to be used as the root for your deployment.

#### Frontend (Astro) Deployment

Your Astro frontend can be deployed to any static hosting provider that supports SSR (Server-Side Rendering). Popular options include:
- Netlify
- Vercel
- Cloudflare Pages
- AWS Amplify
There are a number of tutorials in the [Astro documentation](https://docs.astro.build/en/guides/deploy/#deployment-guides) to use as a starting point. The only modifications are the extra environment variable, `APOS_EXTERNAL_FRONT_KEY=a_random_string` set to the same string as your backend project, and to make sure that you are specifying the `frontend` folder as the root of the project.

#### Netlify Deployment Example

1. Log in to your [Netlify](https://www.netlify.com/) account.
2. Create a new site by connecting your Git repository.
3. In the "Build settings" configuration:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Access Site Settings:
   -Navigate to the "Site settings" for the selected site.
5. Scroll down and find the "Environment variables" section under the "Build & deploy" tab. Click "Edit variables". Add a New Variable:
   - **Key**: `APOS_EXTERNAL_FRONT_KEY`
   - **Value**: `a_random_string`
6. Save your configuration and deploy the site.

The build settings can also be supplied through a `netlify.toml` file at the root of your project.

## 💎 Ready for More?

**Love what you see but need enterprise features?** This free Apollo starter kit is just the beginning. Upgrade to **Apollo Pro** to unlock powerful capabilities that will supercharge your content management and development workflow:

### 🚀 **Apollo Pro Features**
- **🔐 Advanced Permissions** - Granular access control and user groups for teams
- **🌍 Automated Translation** - AI-powered translation with DeepL, Google Translate, and Azure
- **🎨 Visual Design Tools** - In-context CSS customization with the Palette extension
- **🔍 SEO Optimization** - AI-powered content optimization for better search rankings
- **📝 Document Management** - Version control, templates, and audit trails
- **👥 User Registration** - Self-service signup and account management

**[Contact our team](https://apostrophecms.com/contact-us)** to learn more about Apollo Pro licensing and get access to enterprise-grade features that will accelerate your development and enhance your content management capabilities.

---

## 🚑 Need Help?

- **Documentation**: Each feature includes comprehensive documentation and examples
- **Community Support**: Join our [Discord community](https://discord.com/invite/HwntQpADJr) for help from other developers
- **Professional Support**: Dedicated support packages available - [Contact us](https://apostrophecms.com/contact-us) to learn more
- **Training**: Professional training and consultation services available

---

## 📚 Learn More

- **[ApostropheCMS Documentation](https://docs.apostrophecms.org/)** - Complete CMS guide
- **[Astro Documentation](https://docs.astro.build/)** - Learn more about Astro
- **[Astro + ApostropheCMS Guide](https://docs.astro.build/en/guides/cms/apostrophecms/)** - Integration details
- **[Building a Site Tutorial](https://docs.apostrophecms.org/tutorials/astro/apostrophecms-and-astro.html)** - Building a complete site with the Apollo theme
- **[apostrophe-astro Package](https://github.com/apostrophecms/apostrophe-astro)** - Bridge package docs

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

*Built with ❤️ by the ApostropheCMS team. [Star us on GitHub](https://github.com/apostrophecms) if this helps your project!*