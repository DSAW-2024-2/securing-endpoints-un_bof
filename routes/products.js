const express = require('express');
const router = express.Router();

let products = []; // Array for storing products

// Middleware to validate the correct product format
function validateProduct(req, res, next) {
    const { id, name, price, category } = req.body;

    // Check if id is a positive integer
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ message: 'Invalid or missing field: id. It must be a positive integer.' });
    }

    // Check if name is a non-empty string
    if (typeof name !== 'string' || name.trim() === "") {
        return res.status(400).json({ message: 'Invalid or missing field: name' });
    }

    // Check if price is a positive number
    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
        return res.status(400).json({ message: 'Invalid or missing field: price. It must be a positive number.' });
    }

    // Check if category is a non-empty string
    if (typeof category !== 'string' || category.trim() === "") {
        return res.status(400).json({ message: 'Invalid or missing field: category' });
    }

    // Convert id and price to strings for storage
    req.body.id = String(id);
    req.body.price = String(price);

    next();
}

// Route to get all products
router.get('/', (req, res) => {
    res.json(products);
});

// Route to create a new product
router.post('/', validateProduct, (req, res) => {
    const newProduct = req.body;

    // Ensure the ID is unique
    const existingProduct = products.find(p => p.id === newProduct.id);
    if (existingProduct) {
        return res.status(400).json({ message: 'ID already exists, please use a unique ID.' });
    }

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Route to get a product by ID
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

// Route to update a product by ID
router.put('/:id', validateProduct, (req, res) => {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

    products[productIndex] = { ...products[productIndex], ...req.body };
    res.json(products[productIndex]);
});

// Route to delete a product by ID
router.delete('/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

    products.splice(productIndex, 1);
    res.status(204).send();
});

module.exports = { router, products };