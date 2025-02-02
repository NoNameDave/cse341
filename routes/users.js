const routes = require("express").Router();
const usersController = require("../controllers/users");
const { isAuthenticated } = require("../middleware/authenticate");

routes.get('/', usersController.getAll);

routes.get('/:id', usersController.getSingle);

routes.post('/', isAuthenticated, usersController.createUser);

routes.put('/:id', isAuthenticated, usersController.updateUser);

routes.delete('/:id', isAuthenticated, usersController.deleteUser);

module.exports = routes;