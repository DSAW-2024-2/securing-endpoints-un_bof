const express = require('express');
const router = express.Router();

let products = []; // Arreglo para almacenar los productos

// Obtener todos los productos
router.get('/', (req, res) => {
  res.json(products);
});

// Crear un nuevo producto
router.post('/', (req, res) => {
  const newProduct = req.body;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Obtener un producto por ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(product);
});

// Actualizar un producto
router.put('/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) return res.status(404).json({ message: 'Producto no encontrado' });

  products[productIndex] = { ...products[productIndex], ...req.body };
  res.json(products[productIndex]);
});

// Eliminar un producto
router.delete('/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) return res.status(404).json({ message: 'Producto no encontrado' });

  products.splice(productIndex, 1);
  res.status(204).send();
});

module.exports = router;
