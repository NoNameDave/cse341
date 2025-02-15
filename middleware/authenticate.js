const isAuthenticated = (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        return next(); // Bypass authentication for Jest tests
    }
    if (!req.session.user && !req.user) {
        return res.status(401).json("You do not have access.");
    }
    next();
};

module.exports = {
    isAuthenticated
};