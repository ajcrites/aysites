var index = require("../app/cont/index");

module.exports = function (app, config) {
    var index = require("../app/cont/index")(config);
        auth = require("../app/cont/auth")(config)
    ;
    app.get("/", index.index);

    app.post("/auth/login", auth.login.post);
};
