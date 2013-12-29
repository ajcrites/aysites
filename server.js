var app,
    express = require("express"),
    http = require("http"),
    fs = require("fs"),
    env = process.env.NODE_ENV || "development",
    config = require("./config/config")[env],
    mongoisePackage = require("mongoise"),
    mongoise = new mongoisePackage.Mongoise
;

mongoise.connect(config.db.uri).done(function () {
    config.models = {};
    config.controllers = {};

    fs.readdirSync(config.root + "/app/mod").forEach(function (file) {
        if (~file.indexOf(".js")) {
            config.models[file.replace(/\.js$/, "")] = require(config.root + "/app/mod/" + file)(mongoise.dbc);
        }
    });

    fs.readdirSync(config.root + "/app/cont").forEach(function (file) {
        if (~file.indexOf(".js")) {
            config.controllers[file.replace(/\.js$/, "")] = require(config.root + "/app/cont/" + file)(config);
        }
    });

    app = express();

    require("./config/express")(app, config);
    require("./config/routes")(app, config);

    app.set("port", process.env.PORT || 3000);

    http.createServer(app).listen(app.get("port"), function(){
        console.log("Express server listening on port " + app.get("port"));
    });

});
