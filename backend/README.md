# apollo-backend

This is an Astro-based website, with editable content powered by ApostropheCMS.

The project consist of the code in this sub-directory that provides an ApostropheCMS-based backend with customization to use Astro as a frontend, and the sub-directory with the Astro code. For more information, consult the README at the root of this repository.

To run the project locally, set the `APOS_EXTERNAL_FRONT_KEY` environment variable to the same string in both projects. Then issue the command `npm run dev` and point your browser at `localhost:4321`. Your ApostropheCMS instance will be served at `localhost:3000`, but only provides information about the project status.
