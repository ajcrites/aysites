module.exports = function (config) {
    return {
        index: function (req, res) {
            res.sendfile("landing.html", {root: config.root + "/app/tpl"});
        }
    };
};
