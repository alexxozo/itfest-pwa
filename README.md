# Webpack Starter 🚀
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ThisNameWasTaken/webpack-starter/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/ThisNameWasTaken/webpack-starter.svg?branch=master)](https://travis-ci.org/ThisNameWasTaken/webpack-starter)
[![dependency Status](https://david-dm.org/ThisNameWasTaken/webpack-starter/status.svg)](https://david-dm.org/ThisNameWasTaken/webpack-starter#info=dependencies)
[![devDependency Status](https://david-dm.org/ThisNameWasTaken/webpack-starter/dev-status.svg)](https://david-dm.org/ThisNameWasTaken/webpack-starter#info=devDependencies)

**Webpack Starter** is a simple webpack config meant for projects using vanilla javascript.

## What does Webpack Starter do?

* It loads html and imports partials using the [HTMLWeabpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/)
* It transpiles [ejs](http://ejs.co/) and [pug](https://pugjs.org/api/getting-started.html) into html using either the [ejs-plain-loader](https://www.npmjs.com/package/ejs-plain-loader) or the [pug-plain-loader](https://www.npmjs.com/package/pug-plain-loader)
* It transpiles ES6 code to ES5 using [babel](http://babeljs.io/docs/setup/#installation)
* It transpiles [sass](https://sass-lang.com/guide) into css using [sass-loader](https://www.npmjs.com/package/sass-loader)
* It ensures browser compatility using [autoprefixer](https://www.npmjs.com/package/autoprefixer)
* It inlines [critical styles](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/) using the [critical-plugin for webpack](https://www.npmjs.com/package/critical-plugin)
* It removes unused css rules using [purgecss](https://www.npmjs.com/package/purgecss-webpack-plugin)
* It creates a development server using [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server)
* It adds offline support using [webpack-workbox-plugin](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin)

## Install dependencies

```
npm install
```

## Start the development server

```
npm start
```

## Build for production

```
npm run build
```

## Deploy do GitHub Pages
```
npm run deploy
```
It deploys the latest build, found inside the `dist` folder, to the `gh-pages` branch.<br>
If you would like to automatically build before deploying, go to the `package.json` file and inside `"scripts"` add a `"predeploy"` run the build script.

```diff
{
    ...

    "scripts": {
        "build": "webpack --mode production --config webpack.prod.js",
        "postbuild": "node scripts/minifyHtml",
+       "predeploy": "npm run build",
        "deploy": "git add dist/\\* && git commit -m \"chore: Deploy to gh pages\" && git subtree split --prefix dist -b gh-pages && git push --force origin gh-pages && git branch -D gh-pages && git reset HEAD~",
        "start": "webpack-dev-server --mode development --config webpack.dev.js"
    },

    ...
}
```

## How to import html files instead of ejs or pug files
Inside an html file add the fallowing code

```js
<!-- header goes here -->
${require('./partials/header.html')}

...

<!-- footer goes here -->
${require('./partials/footer.html')}
```

Inside `webpack.common.js` look for the `HTMLWebpackPlugin` and replace the `.pug` extension with `.html`

```diff
plugins: [
    ...

    new HtmlWebpackPlugin({
-       template: './src/views/index.ejs',
+       template: './src/views/index.html',
        chunks: ['main']
    }),

    ...
]
```

That is about it. Remember either to restart the server or rebuild.