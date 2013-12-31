/**
 * Model for managing addition, removal, and updating of sites
 */

module.exports = function (config) {
    var monqoise = require("monqoise"),
        http = require("http"),
        collection
    ;
    monqoise = new monqoise.Monqoise(config.dbc);
    collection = monqoise.collection("site");

    return {
        add: function (url) {
            collection.findOne({url: url}).then(function () {
                var site;
                if (arguments[0]) {
                    site = arguments[0];
                }
            });
        }
    };
};
