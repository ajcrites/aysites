/**
 * User CRUD model
 */

module.exports = function (config) {
    var bcrypt = require("bcrypt"),
        monqoise = require("monqoise"),
        Q = require("q"),
        collection
    ;
    monqoise = new monqoise.Monqoise(config.dbc);
    collection = monqoise.collection("user");

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
            var dfd = Q.defer();

            if (name.length < 5) {
                dfd.reject("Name must be at least 5 characters long.");
            }
            else {
                collection.find({name: name}).toArray().then(function (result) {
                    if (result.length) {
                        dfd.reject("Name must be unique.  Provided name exists.");
                    }
                    else {
                        bcrypt.hash(passwd, config.hashIter, function (err, digest) {
                            if (err) {
                                dfd.reject("Unable to create bcrypt digest.  WTF!");
                            }
                            else {
                                collection.insert({
                                    name: name,
                                    passwd: digest,
                                    email: email
                                })
                                    .then(function (user) {
                                        config.models.UserBranch.addBranch(user[0]._id, user[0].name).then(function () {
                                            dfd.resolve.apply(dfd, arguments);
                                        });
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
            var dfd = Q.defer();

            collection.findOne({name: name}).then(function (user) {
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
