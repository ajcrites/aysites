/**
 * User-Branch management
 */

module.exports = function (config) {
    var monqoise = require("monqoise"),
        Deferred = monqoise.Deferred,
        collection
    ;
    monqoise = new monqoise.Monqoise(config.dbc);
    collection = monqoise.collection("branch");

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
