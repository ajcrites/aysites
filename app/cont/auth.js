module.exports = function (config) {
    return {
        login: function (req, res) {
            config.models.User.login(req.body.name, req.body.passwd)
                .done(function (user) {
                    req.session.user = user;
                    res.json(201, user);
                })
                .fail(function (err) {
                    res.json(400, err);
                });
        }
    }
}
