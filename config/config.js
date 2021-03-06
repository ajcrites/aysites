var path = require('path')
  , root = path.normalize(__dirname + '/..');

module.exports = {
    development: {
        db: {
            uri: "mongodb://localhost/aysites_devel",
        },
        secret: "dev secret",
        root: root,
        hashIter: 1
    },
    test: {
        db: {
            uri: "mongodb://localhost/aysites_test",
        },
        secret: "dev secret",
        root: root,
        hashIter: 1
    },
    production: {
        db: {
            uri: process.env.MONGOLAB_URI,
        },
        secret: process.env.AYSITES_SECRET,
        root: root,
        hashIter: 10
    },
}
