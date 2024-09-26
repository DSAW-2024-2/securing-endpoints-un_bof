const express = require('express');
const router = express.Router();

const { authenticateToken, users } = require('./users'); // Import users array
const { products } = require('./products'); // Import products array

let orders = [];

// Validate that user and product exist before creating an order
function validateOrder(req, res, next) {
  const { userId, productId } = req.body;

  // Check if user exists
  const user = users.find(user => user.id === userId);
  if (!user) {
    return res.status(400).json({ message: 'User does not exist. Order cannot be created without a valid user.' });
  }

  // Check if product exists
  const product = products.find(product => product.id === productId);
  if (!product) {
    return res.status(400).json({ message: 'Product does not exist. Order cannot be created without a valid product.' });
  }

  next();
}

// Create a new order (POST /orders)
router.post('/', authenticateToken, validateOrder, (req, res) => {
  const { id, userId, productId, quantity, status } = req.body;

  // Check for duplicate order ID
  if (orders.find(order => order.id === id)) {
    return res.status(400).json({ message: 'Order ID already exists' });
  }

  orders.push({ id: String(id), userId: String(userId), productId: String(productId), quantity: String(quantity), status });
  res.status(201).json({ message: 'Order created successfully' });
});

// Get all orders (GET /orders)
router.get('/', authenticateToken, (req, res) => {
  res.json(orders);
});

// Get order by ID (GET /orders/:id)
router.get('/:id', authenticateToken, (req, res) => {
  const order = orders.find(order => order.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// Update order (PUT /orders/:id)
router.put('/:id', authenticateToken, (req, res) => {
  const orderIndex = orders.findIndex(order => order.id === req.params.id);
  if (orderIndex === -1) return res.status(404).json({ message: 'Order not found' });

  orders[orderIndex] = { ...orders[orderIndex], ...req.body };
  res.json({ message: 'Order updated successfully' });
});

// Delete order (DELETE /orders/:id)
router.delete('/:id', authenticateToken, (req, res) => {
  const orderIndex = orders.findIndex(order => order.id === req.params.id);
  if (orderIndex === -1) return res.status(404).json({ message: 'Order not found' });

  orders.splice(orderIndex, 1);
  res.status(204).send();
});

module.exports = router;
