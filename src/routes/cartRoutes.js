// /routes/cartRoutes.js

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: API para la gestión de carritos de compra
 */

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authSessionMiddleware } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/carts/add/{pid}:
 *   post:
 *     summary: Agrega un producto al carrito
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a agregar al carrito
 *     responses:
 *       200:
 *         description: Producto agregado al carrito exitosamente
 *       401:
 *         description: No autorizado
 */
// Ruta para agregar al carrito
router.post('/add/:pid', authSessionMiddleware(['user', 'admin']), cartController.addToCart);

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Finaliza la compra de un carrito
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Compra completada exitosamente
 *       401:
 *         description: No autorizado
 */
// Ruta para finalizar la compra
router.post('/:cid/purchase', authSessionMiddleware(['user', 'admin']), cartController.completePurchase);

/**
 * @swagger
 * /api/carts/{cid}/empty:
 *   post:
 *     summary: Vacía el carrito de compra
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito vaciado exitosamente
 *       401:
 *         description: No autorizado
 */
// Nueva Ruta para vaciar el carrito
router.post('/:cid/empty', authSessionMiddleware(['user', 'admin']), cartController.emptyCart);

module.exports = router;
