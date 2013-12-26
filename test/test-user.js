var env = process.env.NODE_ENV || "test",
    config = require("../config/config")[env],
    should = require("should"),
    MongoClient = require("mongodb").MongoClient,
    mongoise = require("mongoise"),
    User
;

describe("User", function () {
    before(function (done) {
        mongoise.connect(config.db.uri).then(function (db) {
            User = require("../app/mod/User")(db);
            done();
        });
    });

    describe("create", function () {
        it("should require 5 characters for name", function (done) {
            User.create("foo", "bar", "baz@glan.com").fail(function (err) {
                should.exist(err);
                done();
            }).then(function (r) {
                should.not.exist(r);
                done();
            });
        });

        it("should create a new user", function (done) {
            User.create("fooze", "bar", "baz@glan.com").then(function () {
                User.find({name: "fooze"}).then(function (results) {
                    results.length.should.equal(1);
                    done();
                }).fail(function (err) {
                    should.not.exist(err);
                    done();
                });
            });
        });

        it("should not create duplicate user", function (done) {
            User.create("fooze", "bar", "baz@glan.com").fail(function (err) {
                should.exist(err);
                done();
            }).then(function (r) {
                should.not.exist(r);
                done();
            });
        });
    });
});
