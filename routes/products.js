const express = require('express');
const router = express.Router();

const { authenticateToken } = require('./users'); // Import the middleware from users.js

let products = [];

// Create a new product (POST /products)
router.post('/', authenticateToken, (req, res) => {
  const { id, name, price, category } = req.body;

  // Check for duplicate product ID
  if (products.find(product => product.id === id)) {
    return res.status(400).json({ message: 'Product ID already exists' });
  }

  products.push({ id: String(id), name, price: String(price), category });
  res.status(201).json({ message: 'Product created successfully' });
});

// Get all products (GET /products)
router.get('/', authenticateToken, (req, res) => {
  res.json(products);
});

// Get product by ID (GET /products/:id)
router.get('/:id', authenticateToken, (req, res) => {
  const product = products.find(product => product.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// Update product (PUT /products/:id)
router.put('/:id', authenticateToken, (req, res) => {
  const productIndex = products.findIndex(product => product.id === req.params.id);
  if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

  products[productIndex] = { ...products[productIndex], ...req.body };
  res.json({ message: 'Product updated successfully' });
});

// Delete product (DELETE /products/:id)
router.delete('/:id', authenticateToken, (req, res) => {
  const productIndex = products.findIndex(product => product.id === req.params.id);
  if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

  products.splice(productIndex, 1);
  res.status(204).send();
});

module.exports = { router, products };
