var app,
    express = require("express"),
    http = require("http"),
    env = process.env.NODE_ENV || "development",
    config = require("./config/config")[env]
;

require("./config/init")(config).done(function () {
    app = express();

    require("./config/express")(app, config);
    require("./config/routes")(app, config);

    app.set("port", process.env.PORT || 3000);

    http.createServer(app).listen(app.get("port"), function(){
        console.log("Express server listening on port " + app.get("port"));
    });
});
