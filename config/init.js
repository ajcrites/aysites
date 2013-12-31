var fs = require("fs"),
    monqoisePackage = require("monqoise"),
    Q = require("q"),
    monqoise = new monqoisePackage.Monqoise;

module.exports = function (config) {
    var dfd = Q.defer();

    monqoise.connect(config.db.uri).then(function () {
        config.models = {};
        config.controllers = {};
        config.dbc = monqoise.dbc;

        Q.all([
            monqoise.collection("user").ensureIndex({name: 1}, {unique: true}),
            monqoise.collection("user").ensureIndex({branches: 1}),
            monqoise.collection("branch").ensureIndex({user: 1}),
            monqoise.collection("branch").ensureIndex({name: 1}),
            monqoise.collection("branch").ensureIndex({name: 1, user: 1}, {unique: true}),
            monqoise.collection("branch").ensureIndex({children: 1}),
            monqoise.collection("branch").ensureIndex({sites: 1}),
            monqoise.collection("site").ensureIndex({user: 1}),
            monqoise.collection("site").ensureIndex({url: 1}),
            monqoise.collection("site").ensureIndex({url: 1, user: 1}, {unique: true})
        ]).then(function () {
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
        }).fail(function () {
            dfd.reject(arguments[0]);
        });
    });

    return dfd.promise;
};
