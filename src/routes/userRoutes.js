const express = require('express');
const { check } = require('express-validator');
const validateUserMiddleware = require('../middlewares/validateUserMiddleware'); // Nuevo middleware
const { getAllUsers, createUser, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { uploadDocuments } = require('../middlewares/multerMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 */
router.post(
  '/',
  [
    (req, res, next) => {
      console.log('Datos recibidos en POST /api/users:', req.body);
      next();
    },
    check('name')
      .isString()
      .withMessage('El nombre debe ser un texto')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres'),
    check('email').isEmail().withMessage('El email no es válido'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    check('role')
      .optional()
      .isIn(['admin', 'user'])
      .withMessage('El rol debe ser "admin" o "user"'),
  ],
  validateUserMiddleware, // Usamos el middleware específico para Usuarios
  createUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Datos del usuario.
 *       404:
 *         description: Usuario no encontrado.
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 */
router.put(
  '/:id',
  [
    (req, res, next) => {
      console.log('Datos recibidos en PUT /api/users/:id:', req.body);
      next();
    },
    check('name')
      .optional()
      .isString()
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres'),
    check('email').optional().isEmail().withMessage('El email no es válido'),
    check('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    check('role')
      .optional()
      .isIn(['admin', 'user'])
      .withMessage('El rol debe ser "admin" o "user"'),
  ],
  validateUserMiddleware, // Usamos el middleware específico para Usuarios
  updateUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 */
router.delete('/:id', deleteUser);

/**
 * @swagger
 * /api/users/{id}/documents:
 *   post:
 *     summary: Subir documentos de un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
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
 *                 description: Documento del usuario (PDF, DOC, DOCX)
 *     responses:
 *       200:
 *         description: Documento subido exitosamente.
 *       400:
 *         description: Error al subir el documento.
 */
router.post('/:id/documents', uploadDocuments.single('file'), (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'No se pudo subir el archivo. Verifica el formato.' });
  }

  res.status(200).json({
    message: 'Documento subido exitosamente',
    file: {
      filename: req.file.filename,
      path: req.file.path,
    },
  });
});

module.exports = router;
