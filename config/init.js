var fs = require("fs"),
    mongoisePackage = require("mongoise"),
    mongoise = new mongoisePackage.Mongoise;

module.exports = function (config) {
    var dfd = new mongoisePackage.Deferred;
    mongoise.connect(config.db.uri).done(function () {
        config.models = {};
        config.controllers = {};
        config.dbc = mongoise.dbc;

        return mongoisePackage.when(
            mongoise.collection("user").ensureIndex({name: 1}, {unique: true}),
            mongoise.collection("user").ensureIndex({branches: 1}),
            mongoise.collection("branch").ensureIndex({user: 1}),
            mongoise.collection("branch").ensureIndex({name: 1}),
            mongoise.collection("branch").ensureIndex({name: 1, user: 1}, {unique: true}),
            mongoise.collection("branch").ensureIndex({children: 1}),
            mongoise.collection("branch").ensureIndex({sites: 1}),
            mongoise.collection("site").ensureIndex({user: 1}),
            mongoise.collection("site").ensureIndex({url: 1}),
            mongoise.collection("site").ensureIndex({url: 1, user: 1}, {unique: true})
        ).done(function () {
            fs.readdirSync(config.root + "/app/mod").forEach(function (file) {
                if (~file.indexOf(".js")) {
                    config.models[file.replace(/\.js$/, "")] = require(config.root + "/app/mod/" + file)(config);
                }
            });

            fs.readdirSync(config.root + "/app/cont").forEach(function (file) {
                if (~file.indexOf(".js")) {
                    config.controllers[file.replace(/\.js$/, "")] = require(config.root + "/app/cont/" + file)(config);
                }
            });

            dfd.resolve();
        });
    });

    return dfd.promise;
};
