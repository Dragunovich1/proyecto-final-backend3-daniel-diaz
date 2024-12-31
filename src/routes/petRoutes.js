const express = require('express');
const { check } = require('express-validator');
const validatePetMiddleware = require('../middlewares/validatePetMiddleware'); // Nuevo middleware
const { getAllPets, createPet, getPetById, updatePet, deletePet } = require('../controllers/petController');
const { uploadPets } = require('../middlewares/multerMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Gestión de mascotas
 */

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtener todas las mascotas
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de mascotas.
 */
router.get('/', getAllPets);

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Crear una nueva mascota
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: number
 *               adopted:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Mascota creada exitosamente.
 */
router.post(
  '/',
  [
    (req, res, next) => {
      console.log('Datos recibidos en POST /api/pets:', req.body);
      next();
    },
    check('name')
      .isString()
      .withMessage('El nombre debe ser un texto')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres'),
    check('species')
      .isString()
      .withMessage('La especie debe ser un texto')
      .isLength({ min: 3 })
      .withMessage('La especie debe tener al menos 3 caracteres'),
    check('breed').isString().withMessage('La raza debe ser un texto').optional(),
    check('age').isInt({ min: 0 }).withMessage('La edad debe ser un valor positivo'),
    check('adopted')
      .isBoolean()
      .withMessage('El valor adoptado debe ser un booleano')
      .optional(),
  ],
  validatePetMiddleware, // Usamos el middleware específico para Mascotas
  createPet
);

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Obtener una mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Datos de la mascota.
 *       404:
 *         description: Mascota no encontrada.
 */
router.get('/:id', getPetById);

/**
 * @swagger
 * /api/pets/{id}:
 *   put:
 *     summary: Actualizar una mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: number
 *               adopted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Mascota actualizada exitosamente.
 *       404:
 *         description: Mascota no encontrada.
 */
router.put(
  '/:id',
  [
    (req, res, next) => {
      console.log('Datos recibidos en PUT /api/pets/:id:', req.body);
      next();
    },
    check('name')
      .optional()
      .isString()
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres'),
    check('species')
      .optional()
      .isString()
      .isLength({ min: 3 })
      .withMessage('La especie debe tener al menos 3 caracteres'),
    check('breed').optional().isString(),
    check('age')
      .optional()
      .isInt({ min: 0 })
      .withMessage('La edad debe ser un valor positivo'),
    check('adopted').optional().isBoolean(),
  ],
  validatePetMiddleware, // Usamos el middleware específico para Mascotas
  updatePet
);

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Eliminar una mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota eliminada exitosamente.
 *       404:
 *         description: Mascota no encontrada.
 */
router.delete('/:id', deletePet);

/**
 * @swagger
 * /api/pets/upload:
 *   post:
 *     summary: Subir imagen de una mascota
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de la mascota
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente.
 */
router.post('/upload', uploadPets.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se pudo subir el archivo. Verifica el formato.' });
  }

  res.status(200).json({
    message: 'Imagen subida exitosamente',
    file: {
      filename: req.file.filename,
      path: req.file.path,
    },
  });
});

module.exports = router;
