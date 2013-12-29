module.exports = function (app, config) {
    var c = config.controllers;

    app.get("/", c.index.index);

    app.post("/auth/login", c.auth.login.post);
};
