const routes = require("express").Router();
const booksController = require("../controllers/books");

routes.get('/', booksController.getAll);

routes.get('/:id', booksController.getSingle);

routes.post('/', booksController.createBook);

routes.put('/:id', booksController.updateBook);

routes.delete('/:id', booksController.deleteBook);

module.exports = routes;