var env = process.env.NODE_ENV || "test",
    config = require("../../config/config")[env],
    should = require("should"),
    MongoClient = require("mongodb").MongoClient,
    mongoise = require("mongoise"),
    User
;
mongoise = new mongoise.Mongoise;

describe("User", function () {
    before(function (done) {
        mongoise.connect(config.db.uri).done(function (db) {
            config.dbc = db;
            User = require("../../app/mod/User")(config);
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
                    results[0].name.should.equal("fooze");
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

    describe("read", function () {
        before(function (done) {
            User.create("barze", "bar", "baz@glan.com").done(function () {
                done();
            });
        });

        it("should find created user", function (done) {
            User.find({name: "fooze"}).done(function (result) {
                result[0].name.should.equal("fooze");
                done();
            });
        });

        it("should find multiple users", function (done) {
            User.find({email: "baz@glan.com"}).done(function (results) {
                results.length.should.equal(2);
                done();
            });
        });

        it("should not find a missing user", function (done) {
            User.find({name: "this does not exist"}).done(function (results) {
                results.should.be.empty;
                done();
            });
        });
    });

    describe("authenticate", function () {
        before(function (done) {
            User.create("bazze", "foo", "foo@aysites.com").done(function () {
                done();
            });
        });

        it("should not authenticate invalid password", function (done) {
            User.login("bazze", "not foo").done(function (result) {
                should.not.exist(result);
                done();
            }).fail(function (err) {
                err.should.match(/Invalid.*combination/);
                done();
            });
        });

        it("should authenticate with valid password", function (done) {
            User.login("bazze", "foo").done(function (result) {
                should.exist(result);
                done();
            }).fail(function (err) {
                should.not.exist(err);
                done();
            });
        });
    });
});
