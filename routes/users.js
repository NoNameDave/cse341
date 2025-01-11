const routes = require("express").Router();
const usersController = require("../controllers/users");

routes.get('/', usersController.getAll);
routes.get('/:id', usersController.getSingle);

module.exports = routes;