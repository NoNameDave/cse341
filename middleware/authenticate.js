const isAuthenticated = (req, res, next) => {
    if (!req.session.user && !req.user) {
        return res.status(401).json({ message: "You do not have access" });
    }
    req.user = req.session.user || req.user;  // Ensure `req.user` is set
    next();
};

module.exports = {
    isAuthenticated
};
