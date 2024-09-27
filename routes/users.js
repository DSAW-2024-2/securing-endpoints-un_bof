const express = require('express');
const router = express.Router();

let users = []; // Array for storing users

// Middleware to validate the correct user format
function validateUser(req, res, next) {
    const { id, name, email, age } = req.body;

    // Check if id is a positive integer
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ message: 'Invalid or missing field: id. It must be a positive integer.' });
    }

    // Check if name is a non-empty string
    if (typeof name !== 'string' || name.trim() === "") {
        return res.status(400).json({ message: 'Invalid or missing field: name' });
    }

    // Check if email is a valid non-empty string
    if (typeof email !== 'string' || email.trim() === "") {
        return res.status(400).json({ message: 'Invalid or missing field: email' });
    }

    // Check if age is a positive number
    if (!Number.isInteger(Number(age)) || Number(age) <= 0) {
        return res.status(400).json({ message: 'Invalid or missing field: age. It must be a positive number.' });
    }

    // Convert id and age to strings for storage
    req.body.id = String(id);
    req.body.age = String(age);

    next();
}

// Route to get all users
router.get('/', (req, res) => {
    res.json(users);
});

// Route to create a new user
router.post('/', validateUser, (req, res) => {
    const newUser = req.body;

    // Ensure the ID is unique
    const existingUser = users.find(u => u.id === newUser.id);
    if (existingUser) {
        return res.status(400).json({ message: 'ID already exists, please use a unique ID.' });
    }

    users.push(newUser);
    res.status(201).json(newUser);
});

// Route to get a user by ID
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

// Route to update a user by ID
router.put('/:id', validateUser, (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    users[userIndex] = { ...users[userIndex], ...req.body };
    res.json(users[userIndex]);
});

// Route to delete a user by ID
router.delete('/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    users.splice(userIndex, 1);
    res.status(204).send();
});

module.exports = { router, users };