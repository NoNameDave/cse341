const express = require('express');
const mongodb = require('./data/database');
const app = express();
const port = 3000;

app.use('/', require('./routes'))

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {console.log(`Database is running and Web Server is listening on port ${port}`)});
    }
});