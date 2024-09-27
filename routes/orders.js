const express = require('express');
const router = express.Router();

// Import the arrays from products and users
const { products } = require('./products');
const { users } = require('./users');

let orders = []; // Array for storing orders

// Middleware to validate the correct order format
function validateOrder(req, res, next) {
    const { id, userId, productId, quantity, status } = req.body;

    // Check if id is a positive integer
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ message: 'Invalid or missing field: id. It must be a positive integer.' });
    }

    // Check if userId is a non-empty string
    if (typeof userId !== 'string' || userId.trim() === "") {
        return res.status(400).json({ message: 'Invalid or missing field: userId' });
    }

    // Check if productId is a non-empty string
    if (typeof productId !== 'string' || productId.trim() === "") {
        return res.status(400).json({ message: 'Invalid or missing field: productId' });
    }

    // Check if quantity is a positive number
    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        return res.status(400).json({ message: 'Invalid or missing field: quantity. It must be a positive number.' });
    }

    // Check if status is a non-empty string
    if (typeof status !== 'string' || status.trim() === "") {
        return res.status(400).json({ message: 'Invalid or missing field: status' });
    }

    // Ensure the ID is unique only during creation
    if (req.method === 'POST') {
        const existingOrder = orders.find(o => o.id === String(id));
        if (existingOrder) {
            return res.status(400).json({ message: 'ID already exists, please use a unique ID.' });
        }
    }

    // Check if the product exists before creating the order
    const productExists = products.some(p => p.id === String(productId));
    if (!productExists) {
        return res.status(400).json({ message: 'Product does not exist. Order cannot be created without a valid product.' });
    }

    // Check if the user exists before creating the order
    const userExists = users.some(u => u.id === String(userId));
    if (!userExists) {
        return res.status(400).json({ message: 'User does not exist. Order cannot be created without a valid user.' });
    }

    // Convert id and quantity to strings before storing them
    req.body.id = String(id);
    req.body.quantity = String(quantity);

    next();
}

// Routes for orders
router.put('/:id', (req, res) => {
    res.status(405).json({ message: 'PUT method is not allowed for orders' });
});

router.delete('/:id', (req, res) => {
    res.status(405).json({ message: 'DELETE method is not allowed for orders' });
});

router.get('/', (req, res) => {
    res.json(orders);
});

router.post('/', validateOrder, (req, res) => {
    const newOrder = req.body;
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

router.get('/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
});

module.exports = router;