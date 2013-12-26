var env = process.env.NODE_ENV || "test",
    config = require("../config/config")[env],
    should = require("should"),
    MongoClient = require("mongodb").MongoClient,
    mongoise = require("mongoise"),
    User
;

describe("User", function () {
    before(function (done) {
        mongoise.connect(config.db.uri).done(function (db) {
            User = require("../app/mod/User")(db);
            mongoise.dbc.collection("user").drop(function () {
                mongoise.dbc.createCollection("user", done);
            });
        });
    });

    describe("create", function () {
        it("should require 5 characters for name", function (done) {
            User.create("foo", "bar", "baz@glan.com").fail(function (err) {
                should.exist(err);
                done();
            }).done(function (r) {
                should.not.exist(r);
                done();
            });
        });

        it("should create a new user", function (done) {
            User.create("fooze", "bar", "baz@glan.com").done(function () {
                User.find({name: "fooze"}).done(function (results) {
                    results.name.should.equal("fooze");
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
            }).done(function (r) {
                should.not.exist(r);
                done();
            });
        });
    });
});
