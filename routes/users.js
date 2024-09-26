const express = require('express');
const router = express.Router();

let users = []; // Arreglo para almacenar los usuarios

// Obtener todos los usuarios
router.get('/', (req, res) => {
  res.json(users);
});

// Crear un nuevo usuario
router.post('/', (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});

// Obtener un usuario por ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(user);
});

// Actualizar un usuario
router.put('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) return res.status(404).json({ message: 'Usuario no encontrado' });

  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json(users[userIndex]);
});

// Eliminar un usuario
router.delete('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) return res.status(404).json({ message: 'Usuario no encontrado' });

  users.splice(userIndex, 1);
  res.status(204).send();
});

module.exports = router;
