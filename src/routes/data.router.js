// /routes/data.router.js

const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Pet = require('../models/petModel');

/**
 * @swagger
 * tags:
 *   name: Data
 *   description: API para obtener datos almacenados
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios almacenados
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: Lista de usuarios almacenados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
});

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtiene todas las mascotas almacenadas
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: Lista de mascotas almacenadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/pets', async (req, res) => {
  try {
    const pets = await Pet.find({});
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener mascotas', error });
  }
});

module.exports = router;
