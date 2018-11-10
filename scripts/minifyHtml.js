const fs = require('fs');
const glob = require('glob');
const htmlMinifier = require('html-minifier').minify;

// Environment constants
const IS_DEV = process.argv.includes('development');
const IS_PROD = !IS_DEV;

function minifyHtmlFile(file, minifyOptions) {
    return fs.readFile(file, 'utf-8', function (error, data) {
        if (error) { throw error; }

        fs.writeFile(file, htmlMinifier(data, minifyOptions), function (error) {
            if (error) { throw error; }
        });
    });
}

function minifyHtml(pattern, options) {
    return glob(pattern, function (error, files) {
        if (error) { throw error; }

        files.forEach(file => minifyHtmlFile(file, options));
    });
}

minifyHtml('dist/**/*.html', IS_DEV ? {} : {
    collapseWhitespace: true,
    removeComments: true,
    removeStyleLinkTypeAttributes: true,
    removeScriptTypeAttributes: true
});
