const express = require('express');
const { check } = require('express-validator');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { loginUser, logoutUser } = require('../controllers/sessionController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Gestión de sesiones (login y logout)
 */

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: correo@valido.com
 *               password:
 *                 type: string
 *                 example: contraseña123
 *     responses:
 *       200:
 *         description: Login exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     last_connection:
 *                       type: string
 *                       example: 2024-12-30T10:21:24.095Z
 *       400:
 *         description: Errores de validación.
 *       401:
 *         description: Credenciales inválidas.
 */
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('El email debe ser válido'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  validateMiddleware,
  loginUser
);

/**
 * @swagger
 * /api/sessions/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []  # Indica que este endpoint requiere un token JWT
 *     responses:
 *       200:
 *         description: Logout exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout exitoso
 *       401:
 *         description: Token no válido o no proporcionado.
 *       404:
 *         description: Usuario no encontrado.
 */
router.post('/logout', authenticateJWT, logoutUser);

module.exports = router;
