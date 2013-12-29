module.exports = function (config) {
    return {
        login: {
            post: function (req, res) {
                config.models.User.login(req.body.name, req.body.passwd)
                    .done(function (user) {
                        req.session.user = user;
                        res.json({"success": user});
                    })
                    .fail(function (err) {
                        res.json({"error": err});
                    });
            }
        }
    }
}
