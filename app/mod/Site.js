module.exports = function (db) {
    var request = require("request"),
        Q = require("q")
    ;

    return {
        find: function (url) {
            var title;

            return Q.ninvoke(request, "get", {url: url, followRedirect: false})
                .then(function (result) {
                    var response = result[0],
                        body = result[1];
                    if (response.statusCode >= 400
                        && response.statusCode < 600
                    ) {
                        throw response.statusCode;
                    }
                    else {
                        title = body.match(/<title[\s\S]*?>([\s\S]*?)<\/title/);
                        if (title[1]) {
                            title = title[1];
                        }
                        else {
                            title = url;
                        }
                        return {
                            title: title,
                            forward: response.statusCode >= 300 && response.statusCode < 400
                            ? response.headers.location : null
                        };
                    }
                });
        }
    }
}
