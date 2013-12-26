module.exports = function (db) {
    var mongodb = require("mongodb"),
        ObjectID = mongodb.ObjectID,
        bcrypt = require("bcrypt"),
        mongoise = require("mongoise"),
        collection = mongoise.collection("user")
    ;

    return {
        create: function (name, passwd, email) {
            var dfd = new mongoise.Deferred();

            if (name.length < 5) {
                dfd.reject("Name must be at least 5 characters long.");
            }
            else {
                collection.find({name: name}).then(function (results) {
                    if (results.length) {
                        dfd.reject("Name must be unique.  Provided name exists.");
                    }
                    else {
                        bcrypt.hash(passwd, 10, function (err, digest) {
                            if (err) {
                                dfd.reject("Unable to create bcrypt digest.  WTF!");
                            }
                            else {
                                collection.insert({
                                    name: name,
                                    passwd: digest,
                                    email: email
                                })
                                    .then(dfd.resolve)
                                    .fail(dfd.reject);
                            }
                        });
                    }
                }).fail(function (err) {
                    dfd.reject(err);
                });
            }

            return dfd.promise;
        },
        find: function (query, done) {
            collection.find(query).toArray(done);
        }
    }
};
