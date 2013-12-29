module.exports = function (db) {
    var mongodb = require("mongodb"),
        ObjectID = mongodb.ObjectID,
        bcrypt = require("bcrypt"),
        mongoise = require("mongoise"),
        Deferred = mongoise.Deferred,
        collection
    ;
    mongoise = new mongoise.Mongoise(db);
    collection = mongoise.collection("user")

    return {
        create: function (name, passwd, email) {
            var dfd = new Deferred;

            if (name.length < 5) {
                dfd.reject("Name must be at least 5 characters long.");
            }
            else {
                collection.find({name: name}).toArray().done(function (result) {
                    if (result.length) {
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
            return collection.find(query).toArray();
        },

        /**
         * Log the provided username in by comparing the provided password
         * to the stored hash
         *
         * @return document for the user
         */
        login: function (name, passwd) {
            var dfd = new Deferred;

            collection.findOne({name: name}).done(function (user) {
                bcrypt.compare(passwd, user.passwd, function (err, res) {
                    if (err) {
                        dfd.reject(err);
                    }
                    else if (!res) {
                        dfd.reject("Invalid username/password combination");
                    }
                    else {
                        dfd.resolve(user);
                    }
                });
            }).fail(dfd.reject);

            return dfd.promise;
        }
    }
};
