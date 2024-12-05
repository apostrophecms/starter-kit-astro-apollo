# START TO CREATING A COMBINED README

# Apollo Template for ApostropheCMS + Astro integration

This is intended as both a template and starting point for a project with an [ApostropheCMS](https://docs.apostrophecms.org/) backend and frontend powered by [Astro](https://astro.build/).

The ApostropheCMS codebase is located in the `backend` folder of the repository, while the Astro codebase is in the `frontend` folder.

## Introduction
Overall, this project utilizes ApostropheCMS as a headless backend with Astro as a frontend. What sets this apart from the typical headless use of ApostropheCMS is the addition of a package, [apostrophe-astro](https://github.com/apostrophecms/apostrophe-astro) in the Astro frontend project. This allows for full use of the ApostropheCMS Admin UI, including in-context editing. At the same time, this package also largely automates and simplifies fetching content from the ApostropheCMS backend without having to make REST API calls.

## Using this project
As outlined briefly above, both this repo and the `apollo-frontend` projects need to be provided with the `APOS_EXTERNAL_FRONT_KEY` environment variable set to the same value. Then, you can start the project as you would any ApostropheCMS project. For example, in a local development environment you can use `npm run dev`. For more details on working with the code in an ApostropheCMS project you can examine our [documentation](https://docs.apostrophecms.org/).

### Similarities to a stand-alone project
If you have worked with an ApostropheCMS project previously, this repo should look as expected. There are a number of custom modules, providing new pieces, pages, and widgets, located in the `modules` folder. There are also a number of modules that are improving the core Apostrophe modules located in the `modules/@apostrophecms` folder. For a full understanding of Apostrophe you should consult the [documentation](https://docs.apostrophecms.org/), but we will touch on a few highlights later in this document.

Like any ApostropheCMS project, after creating a new module it needs to be registered in the `app.js` file. For pages or 'piece-type-pages' they also need to be registered in the `modules/@apostrophecms/page/index.js` file.

The majority of [module configuration settings](https://docs.apostrophecms.org/reference/module-api/module-overview.html#module-configuration) will continue to operate as normal since they are involved in configuring the behavior and functionality of the Admin UI, request routing, which is still being handled by the ApostropheCMS backend server, or interaction with MongoDB.

### Important differences
Where this project differs from a normal ApostropheCMS project is that no frontend code should be included in your modules. So, client-side JavaScript and styling, normally added to the `modules/custom-module/ui/src` folder will now be included in the Astro project. This also includes templates in the `views` folder of most modules. One exception is the `modules/@apostrophecms/home-page` module. This module provides a "fall-back" for users who navigate to the Apostrophe server (located by default at `localhost:3000` during development) and simply loads the core `views/layout.html` file. This core file has been modified in this project to provide info about the project status and not load any of the ApostropheCMS Admin UI.

Equally, certain [module customization functions](https://docs.apostrophecms.org/reference/module-api/module-overview.html#customization-functions) that deal with front-end functionality should not be used. This includes the `helper()` and `extendHelpers()` functions for providing Nunjucks template helpers, the `components()` method that provide asynchronous template components, and the `renderRoutes()` function to return a rendered template.

## Project highlights
This project is more opinionated than some of our other starter kits for Astro. It is designed to be paired with the [apollo-frontend](https://github.com/@apostrophecms/apollo-frontend) project which uses the Bulma CSS framework. For a more streamlined starting point you can checkout the [starter-kit-astro](https://github.com/apostrophecms/starter-kit-astro) project and its accompanying frontend, [astro-frontend](https://github.com/apostrophecms/astro-frontend).

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
PIECES WILL BE LISTED HERE
