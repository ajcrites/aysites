module.exports = function (db) {
    var request = require("request"),
        mongoise = require("mongoise")
    ;

    return {
        find: function (url) {
            var title,
                dfd = new mongoise.Deferred
            ;

            request.get({url: url, followRedirect: false}, function (err, response, body) {
                if (err) {
                    dfd.reject(err);
                }
                else {
                    if (response.statusCode >= 400
                        && response.statusCode < 600
                    ) {
                        dfd.reject(response.statusCode);
                    }
                    else {
                        title = body.match(/<title[\s\S]*?>([\s\S]*?)<\/title/);
                        if (title[1]) {
                            title = title[1];
                        }
                        else {
                            title = url;
                        }
                        dfd.resolve(title,
                            response.statusCode >= 300 && response.statusCode < 400
                            ? response.headers.location : null
                        );
                    }
                }
            });

            return dfd.promise;
        }
    }
}
