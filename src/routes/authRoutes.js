// /routes/authRoutes.js

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para la gestión de usuarios
 */

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Muestra el formulario de login
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Formulario de inicio de sesión renderizado exitosamente
 */
router.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión' });
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       500:
 *         description: Error al registrar el usuario
 */
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password, age } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      age,
    });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión con un usuario registrado
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Error al iniciar sesión
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(401).render('login', { message: info.message || 'Error al iniciar sesión' });
      }

      req.login(user, async (error) => {
        if (error) return next(error);

        // Establecer el usuario en la sesión
        req.session.user = {
          id: user._id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
        };

        // Asegurar que la sesión se guarda antes de redirigir
        req.session.save((err) => {
          if (err) {
            return next(err);
          }
          // Redirigir al dashboard correspondiente
          const redirectUrl = user.role === 'admin' ? '/dashboard/products' : '/dashboard/carts';
          return res.redirect(redirectUrl);
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Cierra la sesión del usuario
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente y redirigido al login
 *       500:
 *         description: Error al cerrar sesión
 */
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al cerrar sesión' });
      }
      res.redirect('/auth/login'); // Redirigir al login después de cerrar sesión
    });
  });
});

module.exports = router;
