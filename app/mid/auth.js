/**
 * Authorization/authentication middleware
 *
 * Constructs functions that prevent access to routes for logged in/logged
 * out users and other factors
 */

/**
 * Determine whether the user should be logged in or not.
 * @param boolean if true, the user should be logged in to access this route
 */
exports.auth = function (shouldBeAuthed) {
    return function (req, res, next) {
        if (shouldBeAuthed && !req.session.user) {
            res.redirect(301, "/");
        }
        else if (!shouldBeAuthed && req.session.user) {
            // TODO should redirect somewhere sane
            res.redirect(301, "/");
        }
        else {
            next();
        }
    }
};
