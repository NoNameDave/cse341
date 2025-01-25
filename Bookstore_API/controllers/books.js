const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection("books").find();
        const books = await result.toArray();
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching books.", error: error.message });
    }
};

const getSingle = async (req, res) => {
    try {
        const bookId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection("books").findOne({ _id: bookId });

        if (!result) {
            return res.status(404).json({ message: "Book not found." });
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching the book.", error: error.message });
    }
};

const createBook = async (req, res) => {
    try {
        const { title, author, genre, price, ISBN, stock } = req.body;

        // List of required fields
        const requiredFields = { title, author, genre, price, ISBN, stock };

        // Identify missing fields
        const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `The following required fields are missing: ${missingFields.join(", ")}`,
            });
        }

        // Proceed with creating the book
        const book = {
            title,
            author,
            genre,
            price,
            ISBN,
            stock,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
        };

        const response = await mongodb.getDatabase().db().collection("books").insertOne(book);

        if (response.acknowledged) {
            res.status(201).json({ message: "Book created successfully!" });
        } else {
            res.status(500).json({ message: "Failed to create the book." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while creating the book.", error: error.message });
    }
};

const updateBook = async (req, res) => {
    try {
        const bookId = new ObjectId(req.params.id);
        const { title, author, genre, price, ISBN, stock } = req.body;

        // List of required fields
        const requiredFields = { title, author, genre, price, ISBN, stock };

        // Identify missing fields
        const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `The following required fields are missing: ${missingFields.join(", ")}`,
            });
        }

        const book = {
            title,
            author,
            genre,
            price,
            ISBN,
            stock,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
        };

        const response = await mongodb.getDatabase().db().collection("books").replaceOne({ _id: bookId }, book);

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Book updated successfully!" });
        } else {
            res.status(404).json({ message: "Book not found or no changes made." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while updating the book.", error: error.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        const bookId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("books").deleteOne({ _id: bookId });

        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Book deleted successfully!" });
        } else {
            res.status(404).json({ message: "Book not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while deleting the book.", error: error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createBook,
    updateBook,
    deleteBook,
};