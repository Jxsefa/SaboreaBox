
function setNavbarAuth(req, res, next) {
    res.locals.isAuthenticated = !!req.cookies.token;
    res.locals.userName = req.cookies.userName || null;
    next();
}

module.exports = setNavbarAuth;
