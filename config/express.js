/**
 * Configuration and setup for the express framework
 */
var express = require("express");

module.exports = function (app, config) {
    app.use("production", express.compress({
        filter: function (req, res) {
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
        },
        level: 9
    }));

    app.use(express.favicon());
    app.use(express.static(config.root + "/public"));

    if ("test" !== process.env.NODE_ENV) {
        app.use(express.logger('dev'));
    }

    app.configure(function () {
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.json());
        app.use(app.router);
    });

    app.configure("development", function() {
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure("production", function() {
        app.use(express.errorHandler());
    });
};
