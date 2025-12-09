# apollo-frontend

This is an Astro-based website, with editable content powered by ApostropheCMS.

The project consist of the code in this sub-directory that provides an Astro-based frontend with customization to use ApostropheCMS as a backend, and the sub-directory with the ApostropheCMS code. For more information, consult the README at the root of this repository.

> **📌 Note on Dependency Management**
> 
> This starter kit ships with `package-lock.json` in `.gitignore` to avoid merge conflicts during development. 
> 
> **For production use:** Remove `package-lock.json` from `.gitignore` and commit it to lock your dependencies. This ensures stable, reproducible builds. When you're ready to update dependencies, run `npm update` and commit the updated lock file.

To run the project locally, set the `APOS_EXTERNAL_FRONT_KEY` environment variable to the same string in both projects. Then issue the command `npm run dev` and point your browser at `localhost:4321`.
