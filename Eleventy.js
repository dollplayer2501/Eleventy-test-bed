//
//
//

//
const directoryOutputPlugin = require('@11ty/eleventy-plugin-directory-output');

//
const collections = require('./source/_config/eleventy.collections.js');
const filters = require('./source/_config/eleventy.filters.js');
const shortcodes = require('./source/_config/eleventy.shortcodes.js');

//
const markdownIt = require('markdown-it');

//
const { DateTime } = require('luxon');

//
const fs = require('fs');
const htmlmin = require('html-minifier');

//
const isProduction = process.env.NODE_ENV === 'production';

//
//
//
module.exports = function (eleventyConfig) {

    //
    // add 11ty's plugin
    //

    eleventyConfig.setQuietMode(true);
    eleventyConfig.addPlugin(directoryOutputPlugin, {
        columns: {
            filesize: true,
            benchmark: true,
        },
        warningFileSize: 400 * 1000,
    });

    //
    // add 11ty's Collection
    //

    eleventyConfig.addCollection('contentsSections', collections.contentsSections);

    //
    // add 11ty's Filer
    //

    eleventyConfig.addFilter('setMyCustomOrder', filters.setMyCustomOrder);
    eleventyConfig.addFilter('getHeadTitle', filters.getHeadTitle);
    eleventyConfig.addFilter('getBreadcrumb', filters.getBreadcrumb);
    eleventyConfig.addFilter('getListTopLevel', filters.getListTopLevel);
    eleventyConfig.addFilter('getListParentLevelArray', filters.getListParentLevelArray);
    eleventyConfig.addFilter('getListParentLevelString', filters.getListParentLevelString);
    eleventyConfig.addFilter('getArticleNext', filters.getArticleNext);
    eleventyConfig.addFilter('getArticlePrev', filters.getArticlePrev);
    eleventyConfig.addFilter('getListRecentUpdated', filters.getListRecentUpdated);

    eleventyConfig.addFilter('readableDateLong', function (dateObj) {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' })
            .toFormat('MMMM dd, yyyy HH:mm:ss');
    });
    eleventyConfig.addFilter('readableDateShort', function (dateObj) {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' })
            .toFormat('yyyy-MM-dd');
    });

    //
    // add 11ty's Shorrtcode
    //

    eleventyConfig.addShortcode('dummyShortcode', shortcodes.dummyShortcode);

    //
    // set Markdown-it
    //

    let markdownIt_options = {
        // https://github.com/markdown-it/markdown-it#init-with-presets-and-options
        html: true,
        breaks: true,
        linkify: true,
    };
    let markdownLib = markdownIt(markdownIt_options);
    eleventyConfig.setLibrary('md', markdownLib);

    //
    // set 11ty's Nunjucks
    //

    eleventyConfig.setNunjucksEnvironmentOptions({
        throwOnUndefined: true,
        autoescape: false, // warning: don’t do this!
    });

    //
    // set 11ty's Passthrough File Copy
    //

    eleventyConfig.addPassthroughCopy({ 'source/static/assets/style/custom.css': 'assets/style/custom.css' });

    //
    // chech develop or produuction ?
    //
    // Sorry, I don't fully understand `addTransform` and `setBrowserSyncConfig`.
    //

    if (isProduction) {
        // Compress HTML if in product mode
        eleventyConfig.addTransform('htmlmin', htmlminTransform);
    } else {
        // Launch the browser daemon if in development mode
        eleventyConfig.setBrowserSyncConfig({
            callbacks: { ready: browserSyncReady },
        });
    }

    //
    // display 11ty's events
    //

    eleventyConfig.on('eleventy.beforeWatch', async function () {
        console.log('----  eleventy.beforeWatch  ----');
    });

    eleventyConfig.on('eleventy.before', async function () {
        console.log('----  eleventy.before       ----');
    });

    eleventyConfig.on('eleventy.after', async function () {
        console.log('----  eleventy.after        ----');
    });

    //
    // set 11ty's configuration
    //

    return {
        markdownTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dir: {
            input: './source',
            layouts: './_includes/layouts',
            output: isProduction ? '_production' : '_develop'
        }
    };
};

//
//
//

function htmlminTransform(content, outputPath) {
    if (!outputPath) {
        return content;
    }

    if (outputPath.endsWith('.html')) {
        let minified = htmlmin.minify(content, {
            // 【備忘録】HTMLMinifierの全オプションについて調査した - Qiita
            //  https://qiita.com/ryo_hisano/items/9d41cd447a69943f8eb1
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true,
            minifyJS: true
        });
        return minified;
    }

    return content;
}

function browserSyncReady(err, bs) {
    bs.addMiddleware('*', (req, res) => {
        const content_404 = fs.readFileSync('_develop/404.html');
        res.write(content_404);
        res.writeHead(404);
        res.end();
    });
}
