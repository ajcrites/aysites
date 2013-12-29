module.exports = function (app, models) {
    return {
        login: {
            post: function (req, res) {
                models.User.login(req.body.name, req.body.passwd)
                    .done(function (user) {
                        res.json({"success": user});
                    })
                    .fail(function (err) {
                        res.json({"error": err});
                    });
            }
        }
    }
}
