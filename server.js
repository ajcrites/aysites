var express = require("express"),
    http = require("http"),
    fs = require("fs"),
    env = process.env.NODE_ENV || "development",
    config = require("./config/config")[env]
;

fs.readdirSync(__dirname + "/app/mod").forEach(function (file) {
    if (~file.indexOf(".js")) {
        require(__dirname + "/app/mod/" + file);
    }
});

var app = express();

require("./config/express")(app, config);
require("./config/routes")(app);

app.set("port", process.env.PORT || 3000);

http.createServer(app).listen(app.get("port"), function(){
    console.log("Express server listening on port " + app.get("port"));
});
