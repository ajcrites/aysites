var index = require("../app/cont/index");

module.exports = function (app) {
    app.get("/", index.index);
};
