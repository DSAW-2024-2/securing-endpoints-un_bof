const express = require('express');
const router = express.Router();

let orders = []; // Arreglo para almacenar los pedidos

// Obtener todos los pedidos
router.get('/', (req, res) => {
  res.json(orders);
});

// Crear un nuevo pedido
router.post('/', (req, res) => {
  const newOrder = req.body;
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Obtener un pedido por ID
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
  res.json(order);
});

module.exports = router;
