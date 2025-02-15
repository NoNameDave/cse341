const mongodb = require("../data/database");
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
   try {
           const result = await mongodb.getDatabase().db().collection("users").find();
           const books = await result.toArray();
           res.setHeader("Content-Type", "application/json");
           res.status(200).json(books);
       } catch (error) {
           res.status(500).json({ message: "An error occurred while fetching users.", error: error.message });
       }
};

const getSingle = async (req, res) => {
    try {
            const userId = new ObjectId(req.params.id);
            const result = await mongodb.getDatabase().db().collection("users").findOne({ _id: userId });
    
            if (!result) {
                return res.status(404).json({ message: "User not found." });
            }
    
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: "An error occurred while fetching the user.", error: error.message });
        }
};

const createUser = async (req, res) => {
    try {
            const { firstName, lastName, email} = req.body;
    
            // List of required fields
            const requiredFields = { firstName, lastName, email};
    
            // Identify missing fields
            const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);
    
            if (missingFields.length > 0) {
                return res.status(400).json({
                    message: `The following required fields are missing: ${missingFields.join(", ")}`,
                });
            }
    
            // Proceed with creating the book
            const user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                favoriteColor: req.body.favoriteColor,
                birthday: req.body.birthday
            };
    
            const response = await mongodb.getDatabase().db().collection("users").insertOne(user);
    
            if (response.acknowledged) {
                res.status(201).json({ message: "User created successfully!" });
            } else {
                res.status(500).json({ message: "Failed to create the user." });
            }
        } catch (error) {
            res.status(500).json({ message: "An error occurred while creating the user.", error: error.message });
        }
};

const updateUser = async (req, res) => {
    //#swagger.tags = ['Users']
    const userId = new ObjectId(req.params.id);
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    }
    const response = await mongodb.getDatabase().db().collection('users').replaceOne({_id: userId}, user);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || "Some error occured while updating the user");
    }
};

const deleteUser = async (req, res) => {
    try {
        //#swagger.tags = ['Users']
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('users').deleteOne({_id: userId}, true);

        if (response.deletedCount > 0) {
            res.status(200).json({ message: "User deleted successfully!" });
        } else {
            res.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while deleting the user.", error: error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};