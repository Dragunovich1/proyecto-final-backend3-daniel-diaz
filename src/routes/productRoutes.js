// /routes/productRoutes.js

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API para la gestión de productos
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authSessionMiddleware } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 */
// Ruta para obtener todos los productos
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       401:
 *         description: No autorizado
 */
// Ruta para crear un producto
router.post('/', authSessionMiddleware(['admin']), productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualiza un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       401:
 *         description: No autorizado
 */
// Ruta para actualizar un producto
router.put('/:id', authSessionMiddleware(['admin']), productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Elimina un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       401:
 *         description: No autorizado
 */
// Ruta para eliminar un producto
router.delete('/:id', authSessionMiddleware(['admin']), productController.deleteProduct);

module.exports = router;
