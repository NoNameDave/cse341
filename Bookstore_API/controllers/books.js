const mongodb = require("../data/database");
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection('books').find();
    result.toArray().then((books) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(books);
    });
};

const getSingle = async (req, res) => {
    const bookId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('books').find({_id: bookId});
    result.toArray().then((books) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(books[0]);
    });
};

const createBook = async (req, res) => {
    //#swagger.tags = ['Books']
    //#swagger.description = 'Create a new book'
    //#swagger.parameters['body'] = {
    //#swagger.in = 'body',
    //#swagger.required = true,
    //#swagger.schema = {
    //  "title": "string",
    //  "author": "string",
    //  "genre": "string",
    //  "price": "number",
    //  "ISBN": "string",
    //  "stock": "number",
    //  "description": "string",
    //  "imageUrl": "string"
    // },
    //#swagger.required = ["title", "author", "genre", "price", "ISBN", "stock"]
    //}

    const { title, author, genre, price, ISBN, stock } = req.body;

    // List of required fields
    const requiredFields = { title, author, genre, price, ISBN, stock };

    // Identify missing fields
    const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);

    // If there are missing fields, return a specific error message
    if (missingFields.length > 0) {
        return res.status(400).json({ 
            message: `The following required fields are missing: ${missingFields.join(', ')}` 
        });
    }

    // Proceed with creating the book
    const book = { title, author, genre, price, ISBN, stock, description: req.body.description, imageUrl: req.body.imageUrl };
    const response = await mongodb.getDatabase().db().collection('books').insertOne(book);
    if (response.acknowledged) {
        res.status(201).send();
    } else {
        res.status(500).json(response.error || "Some error occurred while creating the book");
    }
};


const updateBook = async (req, res) => {
    //#swagger.tags = ['Books']
    //#swagger.description = 'Update an existing book'
    //#swagger.parameters['id'] = { in: 'path', required: true, description: 'Book ID' }
    //#swagger.parameters['body'] = {
    //#swagger.in = 'body',
    //#swagger.required = true,
    //#swagger.schema = {
    //  "title": "string",
    //  "author": "string",
    //  "genre": "string",
    //  "price": "number",
    //  "ISBN": "string",
    //  "stock": "number",
    //  "description": "string",
    //  "imageUrl": "string"
    // },
    //#swagger.required = ["title", "author", "genre", "price", "ISBN", "stock"]
    //}
    const bookId = new ObjectId(req.params.id);
    
    const { title, author, genre, price, ISBN, stock } = req.body;

    // List of required fields
    const requiredFields = { title, author, genre, price, ISBN, stock };

    // Identify missing fields
    const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);

    // If there are missing fields, return a specific error message
    if (missingFields.length > 0) {
        return res.status(400).json({ 
            message: `The following required fields are missing: ${missingFields.join(', ')}` 
        });
    }

    // Proceed with creating the book
    const book = { title, author, genre, price, ISBN, stock, description: req.body.description, imageUrl: req.body.imageUrl };

    const response = await mongodb.getDatabase().db().collection('books').replaceOne({_id: bookId}, book);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || "Some error occured while updating the book");
    }
};

const deleteBook = async (req, res) => {
    //#swagger.tags = ['Books']
    const bookId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('books').deleteOne({_id: bookId}, true);
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || "Some error occured while updating the book");
    }
};

module.exports = {
    getAll,
    getSingle,
    createBook,
    updateBook,
    deleteBook
};