/**
 * User-Branch management
 */

module.exports = function (config) {
    var mongoise = require("mongoise"),
        Deferred = mongoise.Deferred,
        collection
    ;
    mongoise = new mongoise.Mongoise(config.dbc);
    collection = mongoise.collection("branch");

    return {
        addBranch: function (user, name) {
            return collection.insert({
                user: user,
                name: name,
                sites: []
            });
        }
    }
};
