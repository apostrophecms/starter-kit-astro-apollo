# Apollo Template for ApostropheCMS + Astro integration

This is intended as both a template and starting point for a project with an [ApostropheCMS](https://docs.apostrophecms.org/) backend and frontend powered by [Astro](https://astro.build/).

The ApostropheCMS codebase is located in the `backend` folder of the repository, while the Astro codebase is in the `frontend` folder.

## Introduction
Overall, this project utilizes ApostropheCMS as a headless backend with Astro as a frontend. What sets this apart from the typical headless use of ApostropheCMS is the addition of a package, [apostrophe-astro](https://github.com/apostrophecms/apostrophe-astro) in the Astro frontend project. This allows for full use of the ApostropheCMS Admin UI, including in-context editing. At the same time, this package also largely automates and simplifies fetching content from the ApostropheCMS backend without writing REST API calls into your code.

## Using this project

### Prerequisites
- Node.js v20 or later
- MongoDB v6.0 or later running on a local server or access to Atlas. See the [ApostropheCMS documentation](https://docs.apostrophecms.org/guide/development-setup.html) for set-up details.

The codebases located in the `backend` and `frontend` folders should be treated as interlinked but separate projects.

As a convenience, this repo has several scripts that can be run at the root of the project including `postinstall`, that runs `npm install` for both the `frontend` and `backend` repositories, `update` for `npm update` in both, and `build` to build both codebases.

- To start, execute `npm run postinstall` from a terminal in the root of this repo
- Next, open a terminal instance at the root of each folder (`frontend` and `backend`). Each project needs to be provided with an `APOS_EXTERNAL_FRONT_KEY` environment variable set to the same string value in order to authenticate communication. For example, in each terminal execute `export APOS_EXTERNAL_FRONT_KEY=my-secret-key`.
- The `astro.config.mjs` file is already set to the normal default values, but if you are running the backend server on a different port, you will also have to set the `APOS_HOST` environment variable.
- Then, you can start the projects using the accompanying scripts. For example, in a local development environment you can start each with `npm run dev`.

### Similarities to a stand-alone ApostropheCMS project
If you have worked with an ApostropheCMS project previously, the backend repo should look as expected. There are a number of custom modules, providing new pages, pieces, and widgets, located in the `modules` folder. The project also configures several Apostrophe core modules through code located in the `modules/@apostrophecms` folder. For a full understanding of Apostrophe you should consult the [documentation](https://docs.apostrophecms.org/), but we will touch on a few highlights later in this document.

Like any ApostropheCMS project, after creating a new module it needs to be registered in the `app.js` file. Page types need to be added to the `types` option of the `modules/@apostrophecms/page/index.js` file.

The majority of [module configuration settings](https://docs.apostrophecms.org/reference/module-api/module-overview.html#module-configuration) will continue to operate as normal since they are involved in configuring the behavior and functionality of the Admin UI, request routing, which is still being handled by the ApostropheCMS backend server, or interaction with MongoDB.

### Important ApostropheCMS differences
Where this project differs from a normal ApostropheCMS project is that no frontend code should be included in your modules. So, client-side JavaScript and styling, normally added to the `modules/custom-module/ui/src` folder will now be included in the Astro project. This also includes templates in the `views` folder of most modules. One exception is the `modules/@apostrophecms/home-page` module. This module provides a "fall-back" for users who navigate to the Apostrophe server (located by default at `localhost:3000` during development) and simply loads the core `views/layout.html` file. This core file has been modified in this project to provide info about the project status and not load any of the ApostropheCMS Admin UI.

Equally, certain [module customization functions](https://docs.apostrophecms.org/reference/module-api/module-overview.html#customization-functions) that deal with front-end functionality should not be used. This includes the `helper()` and `extendHelpers()` functions for providing Nunjucks template helpers, the `components()` method that provide asynchronous template components, and the `renderRoutes()` function to return a rendered template.

Unlike an ApostropheCMS-only project, using Astro as a frontend allows for the widget templates to be used outside specialized `area` schema fields. While this removes the ability to edit the widgets in-context, it does provide flexibility for page design without code repetition. However, this means that the widget schema needs to be added to the schema fields of the page. To facilitate this, some of the widget schema fields have been moved to the `lib/schema-mixins` folder. This allows them to be imported and used in both the main widget module and in the home page template.

### Similarities to a stand-alone Astro project
The Astro half of this project has standard components and templates.

### Important Astro differences
Unlike an Astro project with multiple routes in the `pages` folder, this project has a single `[...slug].astro` that handles all the routing using pages mapped to the `templates` folder. Each of the templates corresponds to one of the registered ApostropheCMS page or piece-page types. The content of these templates is populated by data from the CMS backend and is added into the slots in the `[...slug].astro` file. There is also a `widgets` folder containing templates for the ApostropheCMS widgets. The ApostropheCMS page and widget types are mapped to the corresponding ApostropheCMS modules through an `index.js` file in each folder.

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
This project creates core `default`, `@apostrophecms/home-page` and a 404 page. It also creates two pages for displaying the article pieces.

The home-page has three potential layouts selected from the utility menus on the right-side of the page manager. The 'Minimal' layout inherits the header and footer components that is added to all the project pages. It also has a single area that can take any of the project widgets. The 'Foundation' layout adds a hero section at the top of the page, while the 'Showcase' adds a slideshow.

The default page has a layout that is identical to the 'Minimal' home-page layout.

Piece-type pages in ApostropheCMS-only projects are used to either display multiple pieces (`index.html`) or individual pieces (`show.html`). This project has both types of pages, mapping the index of all pieces to the `ArticleIndexPage.astro` template and the display of the individual pieces to the `ArticleShowPage.astro` template. Both of these page types have three layouts for you to select from. Depending on the index layout, there are three or four additional areas for adding widgets with content before and after the piece content. The index page also demonstrates how to handle pagination in a hybrid project.