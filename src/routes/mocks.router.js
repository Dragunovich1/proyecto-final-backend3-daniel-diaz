// /src/routes/mocks.router.js

const express = require('express');
const router = express.Router();
const mocksController = require('../controllers/mocksController');

/**
 * @swagger
 * tags:
 *   name: Mocks
 *   description: API para la generación de datos ficticios
 */

/**
 * @swagger
 * /api/mocks/mockingpets:
 *   get:
 *     summary: Genera 100 mascotas ficticias
 *     tags: [Mocks]
 *     responses:
 *       200:
 *         description: Lista de mascotas ficticias generadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   type:
 *                     type: string
 *                   breed:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   adopted:
 *                     type: boolean
 *                   owner:
 *                     type: string
 *                     nullable: true
 */
// Endpoint para generar mascotas ficticias
router.get('/mockingpets', mocksController.generateMockPets);

/**
 * @swagger
 * /api/mocks/mockingusers:
 *   get:
 *     summary: Genera 50 usuarios ficticios
 *     tags: [Mocks]
 *     responses:
 *       200:
 *         description: Lista de usuarios ficticios generados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   role:
 *                     type: string
 *                   pets:
 *                     type: array
 *                     items:
 *                       type: string
 */
// Endpoint para generar usuarios ficticios
router.get('/mockingusers', mocksController.generateMockUsers);

/**
 * @swagger
 * /api/mocks/generateData:
 *   post:
 *     summary: Genera e inserta en la base de datos la cantidad de usuarios y mascotas especificados
 *     tags: [Mocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: integer
 *                 description: Cantidad de usuarios a generar
 *               pets:
 *                 type: integer
 *                 description: Cantidad de mascotas a generar
 *     responses:
 *       201:
 *         description: Datos generados e insertados en la base de datos
 *       500:
 *         description: Error al generar e insertar datos
 */
// Endpoint para generar datos e insertarlos en la base de datos
router.post('/generateData', mocksController.generateAndSaveData);

/**
 * @swagger
 * /api/mocks/generateUsers:
 *   post:
 *     summary: Generar usuarios ficticios según el número indicado
 *     tags: [Mocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: integer
 *                 description: Cantidad de usuarios a generar
 *     responses:
 *       200:
 *         description: Usuarios generados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   role:
 *                     type: string
 *                   pets:
 *                     type: array
 *                     items:
 *                       type: string
 *       400:
 *         description: Error en la solicitud
 */
// Endpoint para generar usuarios ficticios según el número indicado
router.post('/generateUsers', mocksController.generateUsersByCount);

module.exports = router;
