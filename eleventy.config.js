'use strict';
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
const htmlmin = require('html-minifier');

//
const isProduction = process.env.NODE_ENV === 'product';

//
//
//
module.exports = function (eleventyConfig) {

    //
    // eleventy-plugin-directory-output
    //

    eleventyConfig.addPlugin(directoryOutputPlugin, {
        columns: {
            filesize: true,
            benchmark: true,
        },
        warningFileSize: 400 * 1000,
    });

    //
    // 11ty Quiet Mode
    //

    eleventyConfig.setQuietMode(true);

    //
    // 11ty Collections
    //

    eleventyConfig.addCollection('contentsSections', collections.contentsSections);

    //
    // 11ty Filer
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
    // 11ty Shorrtcode
    //

    eleventyConfig.addShortcode('setLightbox2', shortcodes.setLightbox2);
    eleventyConfig.addShortcode('setOneImage', shortcodes.setOneImage);

    //
    // Markdown-it
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
    // 11ty Nunjucks Environment Options
    //

    eleventyConfig.setNunjucksEnvironmentOptions({
        throwOnUndefined: true,
        autoescape: false, // warning: don’t do this!
    });
    eleventyConfig.addNunjucksGlobal('isProduction', isProduction ? 'product' : 'develop');

    //
    // 11ty Passthrough File Copy
    //

    eleventyConfig.addPassthroughCopy({
        './source/contents/**/*.{jpg,jpeg,png,webp}': './images',
        './source/static/**/*': './',
    });
    //
    if (isProduction) {
        eleventyConfig.addPassthroughCopy({
            './node_modules/@picocss/pico/css/pico.min.css': './assets/styles/pico.min.css',
            './node_modules/lightbox2/dist/js/lightbox-plus-jquery.min.js': './assets/scripts/lightbox-plus-jquery.min.js',
            './node_modules/lightbox2/dist/css/lightbox.min.css': './assets/styles/lightbox.min.css',
            './node_modules/lightbox2/dist/images/**/*': './assets/images/',
        });
    } else {
        eleventyConfig.addPassthroughCopy({
            './node_modules/@picocss/pico/css/pico.min.css': './assets/styles/pico.css',
            './node_modules/@picocss/pico/css/pico.min.css.map': './assets/styles/pico.css.map',
            './node_modules/lightbox2/dist/js/lightbox-plus-jquery.js': './assets/scripts/lightbox-plus-jquery.js',
            './node_modules/lightbox2/dist/css/lightbox.css': './assets/styles/lightbox.css',
            './node_modules/lightbox2/dist/images/**/*': './assets/images/',
        });
    }

    //

    if (isProduction) {
        //
        // set html-minifier
        //
        eleventyConfig.addTransform('htmlmin', function(content) {
            if (this.page.outputPath && this.page.outputPath.endsWith('.html')) {
                let minified = htmlmin.minify(content, {
                    useShortDoctype: true,
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true,
                });
                return minified;
            }
            return content;
        });
    } else {
        //
        // eleventy-dev-server, included with 11ty's installation
        //
        eleventyConfig.setServerOptions({
            liveReload: true,
            domDiff: true,
            port: 8080,
            watch: [],
            showAllHosts: false,
            https: {},
            encoding: 'utf-8',
            showVersion: false,
          });
    }

    //
    // display 11ty's events
    //

    if (! isProduction) {
        eleventyConfig.on('eleventy.beforeWatch', async function () {
            console.log('----  eleventy.beforeWatch  ----');
        });

        eleventyConfig.on('eleventy.before', async function () {
            console.log('----  eleventy.before       ----');
        });

        eleventyConfig.on('eleventy.after', async function () {
            console.log('----  eleventy.after        ----');
        });
    }

    //
    return {
        markdownTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dir: {
            input: './source',
            layouts: './_includes/layouts',
            output: isProduction ? './_product' : './_develop'
        }
    };
};
