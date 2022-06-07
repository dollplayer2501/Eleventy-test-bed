//
//
//

const sprintf = require('sprintf-js')
    .sprintf;
const escape = require('html-escaper')
    .escape;

//

module.exports = {
    //
    // Lightbox2
    //   https://lokeshdhakar.com/projects/lightbox2/
    //
    //  Argument must be a multiple of 3
    //    1st. argument: large image, only file name
    //    2nd. argument: small image, thumbnail, only file name
    //    3rd. argument: caption
    //
    //  Lightbox2's `data-lightbox` is created this function, random number.
    //
    //  Image file storage location is arbitrary and the output destination of the image file is uniformly `./images`.
    //  see `eleventyConfig.addPassthroughCopy`.
    //
    setLightbox2: function (...args) {
        var ret = '';

        if (0 != args.length % 3) {
            return 'Abnormal number of arguments.';
        }

        var images_large = [];
        var images_small = [];
        var images_caption = [];
        args.forEach(function (item, index) {
            if (0 == index % 3) {
                images_large.push(item);
            } else
            if (1 == index % 3) {
                images_small.push(item);
            } else
            if (2 == index % 3) {
                images_caption.push(escape(item));
            }
        });

        var image_sets = sprintf('set_%06d', Math.floor(Math.random() * 999999));

        for (var i = 0; i < args.length / 3; i++) {
            ret += sprintf('<a href="/images/%s" data-lightbox="%s" data-title="%s"><img src="/images/%s" alt="%s" style="margin-right:10px;"></a>',
                images_large[i], image_sets, images_caption[i], images_small[i], images_caption[i]);
        }

        return sprintf('%s%s%s', '<figure>', ret, '</figure>');
    },

    //
    // Create an HTML tag that displays only one image.
    //
    //   `max_width` and `max_height` are set in units and numbers, not just numbers.
    //
    setOneImage: function (image, max_width = '', max_height = '', caption = '') {
        var ret =
            //                                     alt
            //                                        style
            //                                           figcaption
            sprintf('<figure><img src="/images/%s" %s %s>%s</figure>',
                image, '%s', '%s', '%s');

        var tmp_style = tmp_style_max_width = tmp_style_max_height = '';
        if (0 < max_width.length) {
            tmp_style_max_width = sprintf('max-width:%s;', max_width);
        }
        if (0 < max_height.length) {
            tmp_style_max_height = sprintf('max-height:%s;', max_height);
        }
        if ((0 < tmp_style_max_width.length) || (0 < tmp_style_max_height.length)) {
            tmp_style = sprintf('style="%s"', (tmp_style_max_width + tmp_style_max_height));
        }

        var tmp_alt = tmp_figcaption = '';
        if (0 < caption.length) {
            tmp_alt = sprintf('alt="%s"', escape(caption));
            tmp_figcaption = sprintf('<figcaption>%s</figcaption>', escape(caption));
        }

        return sprintf(ret, tmp_alt, tmp_style, tmp_figcaption);
    },

};
