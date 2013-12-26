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
                collection.find({name: name}).done(function (result) {
                    if (result) {
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
                                    .done(function () {
                                        dfd.resolve.apply(dfd, arguments);
                                    })
                                    .fail(function () {
                                        dfd.reject.apply(dfd.arguments);
                                    });
                            }
                        });
                    }
                }).fail(function (err) {
                    dfd.reject(err);
                });
            }

            return dfd.promise;
        },
        find: function (query) {
            return collection.find(query);
        }
    }
};
