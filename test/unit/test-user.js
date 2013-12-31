var env = process.env.NODE_ENV || "test",
    should = require("should"),
    config = require("../../config/config")[env],
    User
;

describe("User", function () {
    before(function (done) {
        require("../../config/init")(config).then(function () {
            config.dbc.collection("user").drop(function () {
                User = config.models.User;
                done();
            });
        });
    });

    describe("create", function () {
        it("should require 5 characters for name", function (done) {
            User.create("foo", "bar", "baz@glan.com").then(function () {
                done();
            }).fail(function (err) {
                should.exist(err);
                done();
            });
        });

        it("should create a new user", function (done) {
            User.create("fooze", "bar", "baz@glan.com").then(function () {
                User.find({name: "fooze"}).then(function (results) {
                    results[0].name.should.equal("fooze");
                    done();
                }).fail(function (err) {
                    should.not.exist(err);
                    done();
                });
            });
        });

        it("should not create duplicate user", function (done) {
            User.create("fooze", "bar", "baz@glan.com").then(function (r) {
                should.not.exist(r);
                done();
            }).fail(function (err) {
                should.exist(err);
                done();
            });
        });
    });

    describe("read", function () {
        before(function (done) {
            User.create("barze", "bar", "baz@glan.com").then(function () {
                done();
            });
        });

        it("should find created user", function (done) {
            User.find({name: "fooze"}).then(function (result) {
                result[0].name.should.equal("fooze");
                done();
            });
        });

        it("should find multiple users", function (done) {
            User.find({email: "baz@glan.com"}).then(function (results) {
                results.length.should.equal(2);
                done();
            });
        });

        it("should not find a missing user", function (done) {
            User.find({name: "this does not exist"}).then(function (results) {
                results.should.be.empty;
                done();
            });
        });
    });

    describe("authenticate", function () {
        before(function (done) {
            User.create("bazze", "foo", "foo@aysites.com").then(function () {
                done();
            });
        });

        it("should not authenticate invalid password", function (done) {
            User.login("bazze", "not foo").then(function (result) {
                should.not.exist(result);
                done();
            }).fail(function (err) {
                err.should.match(/Invalid.*combination/);
                done();
            });
        });

        it("should authenticate with valid password", function (done) {
            User.login("bazze", "foo").then(function (result) {
                should.exist(result);
                done();
            }).fail(function (err) {
                should.not.exist(err);
                done();
            });
        });
    });
});
