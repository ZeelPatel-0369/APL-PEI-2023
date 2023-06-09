# APL PEI Registration and auction portal

## Tech stack used
- [React](https://react.dev) for front-end
- [Typescript](https://www.typescriptlang.org/) for static type checking
- [Eslint](https://eslint.org/) for linting
- [Vite](https://vitejs.dev/) for builds
- [Radix-ui](https://www.radix-ui.com/) and [shadcn/ui](https://ui.shadcn.com/) for components
- [Tailwindcss](https://tailwindcss.com/) for styling
- [Plop.js](https://plopjs.com/) for automating creation of components
- [Netlify](https://www.netlify.com/products/functions/) functions for backend
- [Netlify](https://www.netlify.com/) for deployment
- [ImageKit](https://imagekit.io/) for hosting images
- [Google Spreadsheet](https://spreadsheets.google.com/) for database 😅
- [google-spreadsheet] (https://www.npmjs.com/package/google-spreadsheet) for managing Google spreadsheet

## How to setup
- run `npm ci` to install local dependencies
- run `npm i -g netlify-cli` to install netlify cli globally (this is needed to run the dev command later)

## How to run on local machine
- copy `.env.example` and rename it to `.env.local` and add the missing env variables
- run `npm i netlify-cli -g` to install netlify cli globally onto your machine
- run `npm run ntl-dev` to run netlify functions and vite app at once