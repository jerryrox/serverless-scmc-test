# Serverless SCMC Test
Just a PoC for setting up a multi-tenant-app-like codebase for the next work.

In this example, I am not using NPM or Yarn's workspaces feature because:
1. It's not necessary.
2. The benefits of their workspace feature don't get along well during deployment (especially Firebase Functions)
3. It's cleaner this way.

## Steps
We’ll use Firebase Functions as an example.
Assume we’re using Typescript too.

### Initial bootstrapping
1.	Create a new monorepo root folder and open with VSCode
2.	Initialize firebase functions.
3.	Move `.eslintrc.js` out of `functions` folder.
4.	In `.eslintrc.js`, add `**/` in front of two strings in `parserOptions.project` array and `ignorePatterns` array.
5.	Create a new `package.json` file, move (not copy) all dev dependencies from `functions` folder, except `firebase-functions-test`.  
We are NOT utilizing NPM or Yarn’s workspace feature as it causes problems during deployment.
6.	Run `npm install` in both the root directory and `functions` directory.
7.	Create a new folder under root directory for the common modules. In this example, I’ll just call it `common`.
8.	In `package.json` in `functions` folder, add dependency to this module.
E.g. ``common`: `file:src/common``

### Root folder setup
1.	Install dev dependency `shx`.
2.	Add a script in `package.json`
```
`build:common`: `npm run –prefix common build && shx rm -rf functions/src/common && shx cp -r common functions/src/common`
```

### Common folder setup
1.	Copy `package.json`, `tsconfig.dev.json`, `tsconfig.json` from `functions` folder into the `common` folder.
2.	Open `package.json`. Remove everything except `name`, `scripts` (lint, build), `main`, `dependencies` (empty object), `private`.
3.	Install dev dependency `shx`.
4.	Modify `build` script to this: `shx rm -rf ./lib && tsc`.
5.	Open `tsconfig.json`. Add to `compilerOptions` the following:
```
`declaration`: true,
`declarationMap`: true,
`moduleResolution`: `node`.
```
6.	Create `src` folder and `index.ts` file. Expand from here into your common logics etc.

### Functions folder setup
1.	In `package.json`, modify `build` script to this:
`npm run –prefix ../ build:common && tsc`.

### Overall development process
1.	Code in `common` folder.
2.	In root directory, call `npm run build:common`.  
(This is necessary only if you need to reference something from common folder in your functions folder.)
3.	Code in `functions` or other serverless apps.
4.	Serve locally or deploy.

## Additional notes
### cd
Check the directory you're running your terminal commands in. It's quite a hassle uninstalling and reinstalling package in the right folder when you've mistaken the current directory.

### Module cannot be found?
Sometimes, after building the common code, VSCode might complain that certain modules in the common package or the package itself is not found. Just reload in this case.

### Installing new packages
Keep the root `package.json` free of normal dependencies. Only `devDependencies` are allowed in this club 😉. Specifically, the ones that matter only during development, building, and testing phases.

### DB interface abstraction
DON'T DO IT...  
Instead, try creating an abstract class that retrieves certain data based on given parameters. Definitely a bit more work than DB abstraction (assuming a perfect implementation) but might be worth your sanity.

### Adding Azure functions
1. Create a new folder called `azure` under the root folder, then initialize the azure function app in it.
2. In the root folder's `package.json`, I've added another script for azure functions folder like this.
```
"scripts": {
    "build:common": "npm run build:common:azure && npm run build:common:functions",
    "build:common:functions": "npm run --prefix common build && shx rm -rf functions/src/common && shx cp -r common functions/src/common",
    "build:common:azure": "npm run --prefix common build && shx rm -rf azure/src/common && shx cp -r common azure/src/common"
}
```
3. In the `azure` folder's `package.json`, just add `npm run --prefix ../ build:common:azure` before running `tsc` in the `build` script.