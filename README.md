# Apollo Template for ApostropheCMS + Astro integration

This is intended as both a template and starting point for a project with an [ApostropheCMS](https://docs.apostrophecms.org/) backend and frontend powered by [Astro](https://astro.build/).

The ApostropheCMS codebase is located in the `backend` folder of the repository, while the Astro codebase is in the `frontend` folder.

## Introduction
Overall, this project utilizes ApostropheCMS as a headless backend with Astro as a frontend. What sets this apart from the typical headless use of ApostropheCMS is the addition of a package, [apostrophe-astro](https://github.com/apostrophecms/apostrophe-astro) in the Astro frontend project. This allows for full use of the ApostropheCMS Admin UI, including in-context editing. At the same time, this package also largely automates and simplifies fetching content from the ApostropheCMS backend without writing REST API calls into your code.

## Using this project

### Prerequisites
- Node.js v18 or later
- MongoDB v6.0 or later (local server or Atlas). See the [ApostropheCMS documentation](https://docs.apostrophecms.org/guide/development-setup.html) for setup.
- Windows users: We require using Windows Subsystem for Linux 2 (WSL2) for Apostrophe development. This ensures consistent behavior with our image processing tools and file system operations. [Learn more about setting up WSL2](https://learn.microsoft.com/en-us/windows/wsl/install).


### Getting Started
The codebases located in the `backend` and `frontend` folders should be treated as interlinked but separate projects.

To simplify dependency management, this repository includes several root-level scripts for convenience. The `postinstall` script automatically installs dependencies for both the `frontend` and `backend` folders when you run `npm install` at the root. Additionally, you can use the update script to run `npm update` in both codebases, and the `build` script to build both projects.

#### For Local Development
- To start, execute `npm install` from a terminal in the root of this repo.
- Next, run `npm run load-starter-content` to fetch a starter database and a little bit of starter media to go with it. You will also be prompted to set an admin password.
- Open terminals:
 - Mac/Linux users: Open one terminal in `frontend` folder and one in `backend` folder
 - Windows users:
   - Open a WSL terminal for the `backend` folder
   - Open a WSL terminal for `frontend` folder (optional - can also use Windows)
- Each project needs to be provided with an `APOS_EXTERNAL_FRONT_KEY` environment variable set to the same string value in order to authenticate communication. For example, in each terminal execute `export APOS_EXTERNAL_FRONT_KEY=my-secret-key`.
- The `astro.config.mjs` file is already set to the normal default values, but if you are running the backend server on a different port, you will also have to set the `APOS_HOST` environment variable.
- Then, you can start the projects using the accompanying scripts. For example, in a local development environment you can start each with `npm run dev`.
  > Note: Astro is much less stringent about project setup when running in development mode. It is recommended that you run the `npm run build` followed by the `npm run preview` commands in the `frontend` folder containing the Astro portion of your project to test that it behaves as expected before deployment. We do not recommend starting the project using the root `npm run serve-frontend` script during development, this script is used for Apostrophe hosting.

#### If you don't want to use the starter content
If you prefer to start with an empty database, you can just add an admin user instead.

In your `backend` terminal window:

```bash
node app @apostrophecms/user:add admin admin
```

### Similarities to a stand-alone ApostropheCMS project
If you have worked with an ApostropheCMS project previously, the backend repo should look as expected. There are a number of custom modules, providing new pages, pieces, and widgets, located in the `modules` folder. The project also configures several Apostrophe core modules through code located in the `modules/@apostrophecms` folder. For a full understanding of Apostrophe you should consult the [documentation](https://docs.apostrophecms.org/), but we will touch on a few highlights later in this document.

Like any ApostropheCMS project, after creating a new module it needs to be registered in the `app.js` file. Page types need to be added to the `types` option of the `modules/@apostrophecms/page/index.js` file.

The majority of [module configuration settings](https://docs.apostrophecms.org/reference/module-api/module-overview.html#module-configuration) will continue to operate as normal since they are involved in configuring the behavior and functionality of the Admin UI, request routing, which is still being handled by the ApostropheCMS backend server, or interaction with MongoDB.

### Important ApostropheCMS differences
Where this project differs from a normal ApostropheCMS project is that no frontend code should be included in your modules. So, client-side JavaScript and styling, normally added to the `modules/custom-module/ui/src` folder will now be included in the Astro project. This also includes templates in the `views` folder of most modules. One exception is the `modules/@apostrophecms/home-page` module. This module provides a "fall-back" for users who navigate to the Apostrophe server (located by default at `localhost:3000` during development) and simply loads the core `views/layout.html` file. This core file has been modified in this project to provide info about the local project status and not load any of the ApostropheCMS Admin UI.

Equally, certain [module customization functions](https://docs.apostrophecms.org/reference/module-api/module-overview.html#customization-functions) that deal with front-end functionality should not be used. This includes the `helper()` and `extendHelpers()` functions for providing Nunjucks template helpers, the `components()` method that provide asynchronous template components, and the `renderRoutes()` function to return a rendered template.

Unlike an ApostropheCMS only project, using Astro as a frontend allows for the widget templates to be used outside specialized `area` schema fields. This provides flexibility for page design without code repetition. However, this means that the widget schema fields for adding content also need to be added to the schema fields of the page. To facilitate this, some of the widget schema fields have been moved to the `lib/schema-mixins` folder. This allows them to be imported and used in both the main widget module and in the home page template.

### Similarities to a stand-alone Astro project
The Astro half of this project has standard components and templates, adhering to typical Astro conventions Organization should follow the normal Astro standards, with the majority of your code being served from sub-folders located in the `src` folder and client-side assets from the `public` folder. If you are new to Astro, refer to the [official documentation](https://docs.astro.build/en/getting-started/) to get started.

Configuration is managed through the `astro.config.mjs` file, following standard practices. However, certain settings must remain unchanged to integrate seamlessly with the ApostropheCMS backend. This includes including the `apostrophe` extension in the `integrations` and the `output` as `server`. You can read more in the [`astro-apostrophe` exension documentation](https://github.com/apostrophecms/apostrophe-astro). But, for example, this project is using a different SASS compiler through the `preprocessorOptions` property for compatibility with the [Bulma CSS framework](https://bulma.io/).

### Important Astro differences
Unlike an Astro project with multiple routes in the `pages` folder, this project has a single slug.astro route that handles all the routing using pages mapped to the `templates` folder. Each of the templates corresponds to one of the registered ApostropheCMS page or piece-page types. The content of these templates is populated by data from the CMS backend and is added into the slots in the `[...slug].astro` file. There is also a `widgets` folder containing templates for the ApostropheCMS widgets. The ApostropheCMS page and widget types are mapped to the corresponding ApostropheCMS modules through an `index.js` file in each folder.

## Project highlights
This project is more opinionated than some of our other project starter kits. It uses the [Bulma CSS framework](https://bulma.io/). For a more streamlined starting point you can use the [combined-astro-starter-kit](https://github.com/apostrophecms/combined-astro-starter-kit) repository.

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

# Image Helper Functions

## Overview
These helper functions are designed to work with images in your Astro frontend that come from ApostropheCMS through relationships or attachment fields. If you're using the image widget within an area, you should use the `AposArea` helper instead - these utilities are specifically for handling images that are part of your content model.

**Important:** These helpers expect a single attachment object, not an array. When working with relationships or array fields, make sure to pass a single image object (e.g., `page.relationship._image[0]`) rather than the full array.

## Common Use Cases

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

## Image Cropping and Sizes

### Automatic Crop Handling
If you set a crop region for an image in the ApostropheCMS Admin UI, all the helper methods will automatically respect that crop. You don't need to do anything special in your code - the cropped version will be used when generating URLs and srcsets.

### Size Variants
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

## Working with Focal Points
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

## Core Functions Reference
Key functions available (see JSDoc comments in source for detailed documentation):
- `getAttachmentUrl(attachmentObject, options?)`: Get URL for an image with optional size (defaults to 'full')
- `getAttachmentSrcset(attachmentObject, options?)`: Generate responsive srcset string
- `getWidth(imageObject)`: Get image width, respecting crops
- `getHeight(imageObject)`: Get image height, respecting crops
- `getFocalPoint(attachmentObject, defaultValue?)`: Get focal point coordinates for styling



## Theming

Customizing the theme in this project is straightforward and leverages Bulma's powerful theming capabilities. You can override Bulma's default variables to match your brand or design requirements by editing the `frontend/src/styles/main.scss` file. This is done **before importing Bulma** so that your customizations are applied throughout the project.

### Steps to Customize

1. Navigate to the `frontend/src/styles/main.scss` file.
2. Locate the section for overriding Bulma variables.
3. Uncomment and modify the variables you wish to customize. You can define colors, typography, spacing, and more.
4. Save your changes, and the updated theme will automatically apply when you rebuild the project.

### Example: Overriding Common Variables

Here’s an example of how to customize some of Bulma's common variables. These variables are commented out by default. Uncomment and modify them as needed:

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
=======
# Package scripts

## Root `package.json` scripts

The root of the project has several useful scripts located in the `package.json` file. Running `npm run install` in the root directory will trigger the `postinstall` script. This will install the dependencies for both the ApostropheCMS and Astro projects. Similarly, `npm run update` will update dependencies for both the `frontend` and `backend` folders. The rest of the scripts in this file are primarily used for project deployment to Apostrophe hosting.

## Frontend folder scripts

The main scripts for the Astro project located in the frontend folder are `dev`, `preview`, and `build`. These first two of these scripts will allow you to start the Astro server in either development or preview mode. The `build` script should be run prior to starting the server in preview mode. The remainder of the scripts are for deployment and may need to be altered to fit your hosting solution.

## Backend folder scripts

Typically, you will only use the `dev` script in the backend folder outside of deployment. You can consult the [ApostropheCMS hosting](https://docs.apostrophecms.org/guide/hosting.html) recipes to see how these other scripts should be used.


# Deploying to production

## Using Apostrophe hosting

Apostrophe can provide easy hosting for any ApostropheCMS-Astro monorepo with little or no extra configuration. This can be set up for deployment from Github or other code repository.

Apostrophe hosting will automatically handle:
- Database provisioning and management
- Asset storage and delivery
- SSL certificate management
- Automatic backups
- Security updates

In the future, we will be providing a path to create your own account and create a new hosted project. In the meantime, you can [contact us](https://apostrophecms.com/contact-us) to get your hosting set up.

## Using 3rd-party hosting

Third-party hosting will typically require separate servers for the ApostropheCMS and Astro portions of the repositories. This is the typical pattern seen with other CMS that are used with Astro. You will need to specify whether you want the `backend` ApostropheCMS portion of the repo, or the `frontend` Astro project hosted. How this is accomplished will depend on the provider.

### Backend (ApostropheCMS) Deployment

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

### Frontend (Astro) Deployment

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

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
