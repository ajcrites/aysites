var env = process.env.NODE_ENV || "test",
    config = require("../../config/config")[env],
    should = require("should"),
    site = require("../../app/mod/Site")()
;

describe("Site", function () {
    it("should find valid site", function (done) {
        site.find("http://aysites.com").done(function (title, forward) {
            title.should.match(/AySites:/);
            should.not.exist(forward);
            done();
        });
    });

    it("should fail for invalid url (404)", function (done) {
        site.find("http://aysites.com/notaurl").fail(function (status) {
            status.should.equal(404);
            done();
        });
    });
});
