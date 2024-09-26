const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Import routes
const userRoutes = require('./routes/users').router;
const productRoutes = require('./routes/products').router;
const orderRoutes = require('./routes/orders');

// Use routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
