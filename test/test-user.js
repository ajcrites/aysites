var env = process.env.NODE_ENV || "test",
    config = require("../config/config")[env],
    should = require("should"),
    MongoClient = require("mongodb").MongoClient,
    User;

describe("User", function () {
    before(function (done) {
        MongoClient.connect(config.db.uri, function (err, db) {
            if (err) {
                console.log("Unable to connect to database -- " + err);
            }
            else {
                db.collection("user").drop(function () {
                    User = require("../app/mod/User")(db);
                    done();
                });
            }
        });
    });

    describe("create", function () {
        it("should require 5 characters for name", function (done) {
            User.create("foo", "bar", "baz@glan.com", function (err, results) {
                should.exist(err);
                should.not.exist(results);
                done();
            });
        });

        it("should create a new user", function (done) {
            User.create("fooze", "bar", "baz@glan.com", function () {
                User.find({name: "fooze"}, function (err, results) {
                    should.not.exist(err);
                    results.length.should.equal(1);
                    done();
                });
            });
        });

        it("should not create duplicate user", function (done) {
            User.create("fooze", "bar", "baz@glan.com", function (err, results) {
                should.exist(err);
                should.not.exist(results);
                done();
            });
        });
    });
});
