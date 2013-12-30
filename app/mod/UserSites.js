/**
 * Model for managing addition, removal, and updating of sites
 */

module.exports = function (config) {
    var mongoise = require("mongoise"),
        http = require("http"),
        Deferred = mongoise.Deferred,
        collection
    ;
    mongoise = new mongoise.Mongoise(config.dbc);
    collection = mongoise.collection("user");

    return {
        add: function (url) {
        }
    };
};
