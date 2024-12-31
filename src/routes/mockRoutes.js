const express = require('express');
const { generateMockUsers, generateMockPets } = require('../utils/mockData');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mocking
 *   description: Endpoints para generar datos de prueba
 */

/**
 * @swagger
 * /api/mocks/users:
 *   post:
 *     summary: Generar usuarios de prueba
 *     tags: [Mocking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Cantidad de usuarios a generar (opcional, por defecto 50).
 *     responses:
 *       201:
 *         description: Usuarios generados correctamente.
 */
router.post('/users', async (req, res, next) => {
  try {
    const { quantity } = req.body;
    await generateMockUsers(quantity || 50);
    res.status(201).json({ message: 'Usuarios generados correctamente.' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/mocks/pets:
 *   post:
 *     summary: Generar mascotas de prueba
 *     tags: [Mocking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Cantidad de mascotas a generar (opcional, por defecto 100).
 *     responses:
 *       201:
 *         description: Mascotas generadas correctamente.
 */
router.post('/pets', async (req, res, next) => {
  try {
    const { quantity } = req.body;
    await generateMockPets(quantity || 100);
    res.status(201).json({ message: 'Mascotas generadas correctamente.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
