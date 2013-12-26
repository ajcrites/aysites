module.exports = function (db) {
    var mongodb = require("mongodb"),
        ObjectID = mongodb.ObjectID,
        collection = db.collection("user"),
        bcrypt = require("bcrypt")
    ;

    return {
        create: function (name, passwd, email, done) {
            if (name.length < 5) {
                return done("Name must be at least 5 characters long.", null);
            }
            collection.find({name: name}).toArray(function (err, results) {
                if (err) {
                    return done(err, null);
                }
                if (results.length) {
                    return done("Name must be unique.  Provided name exists.", null);
                }

                bcrypt.hash(passwd, 10, function (err, digest) {
                    collection.insert({
                        name: name,
                        passwd: digest,
                        email: email
                    }, done);
                });
            });
        },
        find: function (query, done) {
            collection.find(query).toArray(done);
        }
    }
};
