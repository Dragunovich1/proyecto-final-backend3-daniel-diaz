// /routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const ProductRepository = require('../repositories/productRepository');
const CartRepository = require('../repositories/cartRepository');
const { authSessionMiddleware } = require('../middlewares/authMiddleware');

// Ruta principal del dashboard
router.get('/', authSessionMiddleware(['user', 'admin']), (req, res) => {
  if (req.session.user.role === 'admin') {
    res.redirect('/dashboard/products');
  } else {
    res.redirect('/dashboard/carts');
  }
});

// Ruta para la vista de productos del dashboard
router.get('/products', authSessionMiddleware(['admin']), async (req, res) => {
  try {
    const products = await ProductRepository.getProducts();
    const productsData = products.map(product => product.toObject());
    res.render('dashboardProducts', {
      title: 'Gestión de Productos',
      products: productsData,
      user: req.session.user,
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al obtener productos');
  }
});

// Ruta para la vista de carritos del dashboard
router.get('/carts', authSessionMiddleware(['user', 'admin']), async (req, res) => {
  try {
    const cart = await CartRepository.getCartByUser(req.session.user.id);
    res.render('dashboardCarts', {
      title: 'Mi Carrito',
      cart,
      user: req.session.user,
    });
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).send('Error al obtener el carrito');
  }
});

module.exports = router;
