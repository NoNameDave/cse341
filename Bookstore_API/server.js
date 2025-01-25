const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, Options');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With ,Content-Type, Accept, Z-key');
    next();
});

app.use('/', require('./routes'))

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {console.log(`Database is running and Web Server is listening on port ${port}`)});
    }
});