//
//
//

module.exports = {
    //
    // I don't understand the following.
    //  - Why `collectionApi` is needed.
    //  - How to add your own arguments.
    //    For example, pass the pathname as an argument.
    //
    contentsSections: function (collectionApi) {
        return collectionApi
            .getFilteredByGlob('./source/sections/section_*.md')
            .sort((a, b) => Number(a.data.order) > Number(b.data.order) ? 1 : -1);
    },
};
