const routes = require("express").Router();
 
routes.get('/', (req, res) => {res.send("Jesseca Wolmarans")});
routes.use('/users', require('./users'));

module.exports = routes;