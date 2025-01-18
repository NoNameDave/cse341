const routes = require("express").Router();
const usersController = require("../controllers/users");

routes.get('/', usersController.getAll);

routes.get('/:id', usersController.getSingle);

routes.post('/', usersController.createUser);

routes.put('/', usersController.updateUser);

routes.delete('/', usersController.deleteUser);

module.exports = routes;