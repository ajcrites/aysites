module.exports = function (app, config) {
    var c = config.controllers,
        auth = require(config.root + "/app/mid/auth");

    /**
     * Any GET request that is not requesting JSON should emit the landing
     * page template.  The front end SPA architeture will handle the routing
     * as the user/browser sees it
     */
    app.get(/(?:)/, c.index.index);

    app.post("/auth/login", auth.auth(false), c.auth.login.post);
};
