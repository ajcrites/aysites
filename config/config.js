var path = require('path')
  , root = path.normalize(__dirname + '/..');

module.exports = {
    development: {
        db: "mongodb://localhost/resource-manager_devel",
        root: root
    },
    test: {
        db: "mongodb://localhost/resource-manager_test",
        root: root
    },
    production: {
        db: process.env.MONGOLAB_URI,
        root: root
    },
}
