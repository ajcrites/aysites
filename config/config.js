var path = require('path')
  , root = path.normalize(__dirname + '/..');

module.exports = {
    development: {
        db: "mongodb://localhost/aysites_devel",
        root: root
    },
    test: {
        db: "mongodb://localhost/aysites_test",
        root: root
    },
    production: {
        db: process.env.MONGOLAB_URI,
        root: root
    },
}
