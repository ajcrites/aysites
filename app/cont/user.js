module.exports = function (config) {
    return {
        create: function (req, res) {
            config.models.User.create(req.body.name, req.body.passwd, req.body.email)
                .done(function (user) {
                    req.session.user = user;
                    res.json(201, "Successfully created user");
                })
                .fail(function (err) {
                    res.json(400, err);
                });
        }
    }
}
