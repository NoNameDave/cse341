const routes = require("express").Router();
const lesson1Controller = require("../controllers/lesson1");
 
routes.get('/', lesson1Controller.jessRoute);
routes.get('/aaron', lesson1Controller.aaronRoute);
routes.get('/natasha', lesson1Controller.tashRoute);

module.exports = routes;