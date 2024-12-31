const express = require('express');
const { check } = require('express-validator');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { getAllAdoptions, createAdoption, getAdoptionById, deleteAdoption } = require('../controllers/adoptionController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Adoptions
 *   description: Gestión de adopciones
 */

/**
 * @swagger
 * /api/adoptions:
 *   get:
 *     summary: Obtener todas las adopciones
 *     tags: [Adoptions]
 *     responses:
 *       200:
 *         description: Lista de adopciones.
 */
router.get('/', getAllAdoptions);

/**
 * @swagger
 * /api/adoptions:
 *   post:
 *     summary: Crear una nueva adopción
 *     tags: [Adoptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               petId:
 *                 type: string
 *               adopterId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Adopción creada exitosamente.
 */
router.post(
  '/',
  [
    check('petId').isMongoId().withMessage('El ID de la mascota debe ser válido'),
    check('adopterId').isMongoId().withMessage('El ID del adoptante debe ser válido'),
  ],
  validateMiddleware,
  createAdoption
);

/**
 * @swagger
 * /api/adoptions/{id}:
 *   get:
 *     summary: Obtener una adopción por ID
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
 *         description: Datos de la adopción.
 *       404:
 *         description: Adopción no encontrada.
 */
router.get(
  '/:id',
  [check('id').isMongoId().withMessage('El ID de la adopción debe ser válido')],
  validateMiddleware,
  getAdoptionById
);

/**
 * @swagger
 * /api/adoptions/{id}:
 *   delete:
 *     summary: Eliminar una adopción por ID
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
 *         description: Adopción eliminada exitosamente.
 *       404:
 *         description: Adopción no encontrada.
 */
router.delete(
  '/:id',
  [check('id').isMongoId().withMessage('El ID de la adopción debe ser válido')],
  validateMiddleware,
  deleteAdoption
);

module.exports = router;
