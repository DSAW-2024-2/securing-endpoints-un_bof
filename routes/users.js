const express = require('express');
const router = express.Router();

let users = [];
const adminCredentials = { email: "admin@admin.com", password: "admin" };

// Middleware for token authentication
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (token !== 'Bearer admin-token') {
    return res.status(403).json({ message: 'Invalid JWT Token' });
  }
  next();
}

// User login (POST /login)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === adminCredentials.email && password === adminCredentials.password) {
    return res.status(200).json({ token: 'admin-token' });
  } else {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Get all users (GET /users)
router.get('/', authenticateToken, (req, res) => {
  res.json(users);
});

// Create a new user (POST /users)
router.post('/', authenticateToken, (req, res) => {
  const { id, name, email, age } = req.body;

  if (users.find(user => user.id === id)) {
    return res.status(400).json({ message: 'User ID already exists' });
  }

  users.push({ id: String(id), name, email, age: String(age) });
  res.status(201).json({ message: 'User created successfully' });
});

// Get user by ID (GET /users/:id)
router.get('/:id', authenticateToken, (req, res) => {
  const user = users.find(user => user.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Update user (PUT /users/:id)
router.put('/:id', authenticateToken, (req, res) => {
  const userIndex = users.findIndex(user => user.id === req.params.id);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json({ message: 'User updated successfully' });
});

// Delete user (DELETE /users/:id)
router.delete('/:id', authenticateToken, (req, res) => {
  const userIndex = users.findIndex(user => user.id === req.params.id);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  users.splice(userIndex, 1);
  res.status(204).send();
});

module.exports = { router, users, authenticateToken };
