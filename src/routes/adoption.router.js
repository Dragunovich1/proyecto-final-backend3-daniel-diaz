// src/routes/adoption.router.js

const express = require('express');
const router = express.Router();
const Adoption = require('../models/adoptionModel');

/**
 * @swagger
 * tags:
 *   name: Adoptions
 *   description: API para la gestión de adopciones de mascotas
 */

/**
 * @swagger
 * /api/adoptions:
 *   get:
 *     summary: Obtiene todas las adopciones
 *     tags: [Adoptions]
 *     responses:
 *       200:
 *         description: Lista de adopciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', async (req, res) => {
  try {
    const adoptions = await Adoption.find();
    res.status(200).json(adoptions);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener adopciones', error });
  }
});

/**
 * @swagger
 * /api/adoptions/{id}:
 *   get:
 *     summary: Obtiene una adopción por ID
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la adopción
 *     responses:
 *       200:
 *         description: Información de la adopción
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/:id', async (req, res) => {
  const adoptionId = req.params.id;
  try {
    const adoption = await Adoption.findById(adoptionId);
    if (!adoption) {
      return res.status(404).json({ message: 'Adopción no encontrada' });
    }
    res.status(200).json(adoption);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la adopción', error });
  }
});

/**
 * @swagger
 * /api/adoptions:
 *   post:
 *     summary: Crea una nueva adopción
 *     tags: [Adoptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               petName:
 *                 type: string
 *                 description: Nombre de la mascota a adoptar
 *               adopterName:
 *                 type: string
 *                 description: Nombre del adoptante
 *               adoptionDate:
 *                 type: string
 *                 description: Fecha de adopción
 *     responses:
 *       201:
 *         description: Adopción creada
 *       400:
 *         description: Error de validación de datos
 */
router.post('/', async (req, res) => {
  try {
    const { petName, adopterName, adoptionDate } = req.body;
    if (!petName || !adopterName || !adoptionDate) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }
    if (petName.length > 50) {
      return res.status(400).json({ message: 'El nombre de la mascota es demasiado largo' });
    }
    const newAdoption = new Adoption({ petName, adopterName, adoptionDate });
    await newAdoption.save();
    res.status(201).json(newAdoption);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear adopción', error });
  }
});

/**
 * @swagger
 * /api/adoptions/{id}:
 *   put:
 *     summary: Actualiza una adopción por ID
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la adopción a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adopterName:
 *                 type: string
 *                 description: Nuevo nombre del adoptante
 *     responses:
 *       200:
 *         description: Adopción actualizada
 *       400:
 *         description: Error de validación de datos
 */
router.put('/:id', async (req, res) => {
  const adoptionId = req.params.id;
  try {
    const { adopterName } = req.body;
    if (!adopterName) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }
    const updatedAdoption = await Adoption.findByIdAndUpdate(
      adoptionId,
      req.body,
      { new: true }
    );
    if (!updatedAdoption) {
      return res.status(404).json({ message: 'Adopción no encontrada' });
    }
    res.status(200).json(updatedAdoption);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la adopción', error });
  }
});

/**
 * @swagger
 * /api/adoptions/{id}:
 *   delete:
 *     summary: Elimina una adopción por ID
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la adopción a eliminar
 *     responses:
 *       200:
 *         description: Adopción eliminada
 */
router.delete('/:id', async (req, res) => {
  const adoptionId = req.params.id;
  try {
    const deletedAdoption = await Adoption.findByIdAndDelete(adoptionId);
    if (!deletedAdoption) {
      return res.status(404).json({ message: 'Adopción no encontrada' });
    }
    res.status(200).json({ message: 'Adopción eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la adopción', error });
  }
});

/**
 * @swagger
 * /api/adoptions/init-tests:
 *   post:
 *     summary: Inicializa datos de prueba para las adopciones
 *     tags: [Adoptions]
 *     responses:
 *       201:
 *         description: Datos de prueba creados
 */
router.post('/init-tests', async (req, res) => {
  try {
    const testAdoptions = [
      { petName: 'Test Pet 1', adopterName: 'Test Adopter 1', adoptionDate: '2024-11-15' },
      { petName: 'Test Pet 2', adopterName: 'Test Adopter 2', adoptionDate: '2024-11-16' },
    ];
    await Adoption.insertMany(testAdoptions);
    res.status(201).json({ message: 'Datos de prueba creados' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear datos de prueba', error });
  }
});

/**
 * @swagger
 * /api/adoptions/clean-tests:
 *   delete:
 *     summary: Elimina los datos de prueba para las adopciones
 *     tags: [Adoptions]
 *     responses:
 *       200:
 *         description: Datos de prueba eliminados
 */
router.delete('/clean-tests', async (req, res) => {
  try {
    await Adoption.deleteMany({ adopterName: /^Test Adopter/ });
    res.status(200).json({ message: 'Datos de prueba eliminados' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar datos de prueba', error });
  }
});

module.exports = router;
