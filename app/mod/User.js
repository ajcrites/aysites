/**
 * User CRUD model
 */

module.exports = function (db) {
    var bcrypt = require("bcrypt"),
        mongoise = require("mongoise"),
        Deferred = mongoise.Deferred,
        collection
    ;
    mongoise = new mongoise.Mongoise(db);
    collection = mongoise.collection("user");

    return {
        /**
         * Create a user with the provided name/password/email
         * @param string must be unique and at least 5 characters
         * @param string
         * @param string
         *
         * No validation is done on password (ever) or email (for now)
         */
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
                                    email: email,
                                    // This is the <TRUNK>
                                    branches: {
                                        branches: {},
                                        sites: []
                                    }
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
         */
        login: function (name, passwd) {
            var dfd = new Deferred;

            collection.findOne({name: name}).done(function (user) {
                if (!user) {
                    dfd.reject("Invalid username/password combination");
                }
                else {
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
                }
            }).fail(dfd.reject);

            return dfd.promise;
        }
    }
};
