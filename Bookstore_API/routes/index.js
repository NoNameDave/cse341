const routes = require("express").Router();
 
routes.use('/', require('./swagger'));

routes.get('/', (req, res) => {
    //#swagger.tags = ['Welcome to the bookstore']
    res.send("Welcome to the bookstore")
});

routes.use('/books', require('./books'));
routes.use('/users', require('./users'));

module.exports = routes;