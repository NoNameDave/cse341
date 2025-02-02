const routes = require("express").Router();
const booksController = require("../controllers/books");
const { isAuthenticated } = require("../middleware/authenticate");

routes.get('/', booksController.getAll);

routes.get('/:id', booksController.getSingle);

routes.post('/', isAuthenticated, booksController.createBook);

routes.put('/:id', isAuthenticated, booksController.updateBook);

routes.delete('/:id', isAuthenticated, booksController.deleteBook);

module.exports = routes;