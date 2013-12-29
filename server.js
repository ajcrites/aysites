var app,
    models = {},
    express = require("express"),
    http = require("http"),
    fs = require("fs"),
    env = process.env.NODE_ENV || "development",
    config = require("./config/config")[env],
    mongoisePackage = require("mongoise"),
    mongoise = new mongoisePackage.Mongoise
;

mongoise.connect(config.db.uri).done(function () {
    fs.readdirSync(__dirname + "/app/mod").forEach(function (file) {
        if (~file.indexOf(".js")) {
            models[file.replace(/\.js$/, "")] = require(__dirname + "/app/mod/" + file)(mongoise.dbc);
        }
    });

    app = express();

    require("./config/express")(app, config);
    require("./config/routes")(app, models);

    app.set("port", process.env.PORT || 3000);

    http.createServer(app).listen(app.get("port"), function(){
        console.log("Express server listening on port " + app.get("port"));
    });

});
