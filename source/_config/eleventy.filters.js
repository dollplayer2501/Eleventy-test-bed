//
//
//

module.exports = {
    //
    dummyFilter: function (collections_all) {
        var ret = [];

        collections_all.forEach(function (element) {
            // I don't understand eleventyExcludeFromCollections...
            if (!element.url) {
                return;
            }
            ret.push({ 'url': element.url, 'title': element.data.title })
        });

        return ret;
    },
};
