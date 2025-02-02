const passport = require("passport");

const routes = require("express").Router();
 
routes.use('/', require('./swagger'));

routes.use('/books', require('./books'));
routes.use('/users', require('./users'));

routes.get('/login', passport.authenticate('github'), (req, res) => {});

routes.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = routes;