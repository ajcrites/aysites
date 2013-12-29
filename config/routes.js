var index = require("../app/cont/index");

module.exports = function (app, models) {
    var auth = require("../app/cont/auth")(app, models);
    app.get("/", index.index);

    app.post("/auth/login", auth.login.post);
};
