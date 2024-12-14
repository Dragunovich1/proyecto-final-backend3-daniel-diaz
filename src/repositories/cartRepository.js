// /repositories/cartRepository.js

const Cart = require('../models/cartModel');

class CartRepository {
  // Método para obtener el carrito por el ID del usuario
  static async getCartByUser(userId) {
    try {
      return await Cart.findOne({ user: userId }).populate('products.product');
    } catch (error) {
      console.error('Error obteniendo el carrito por usuario:', error);
      throw error;
    }
  }

  // Método para crear un nuevo carrito para el usuario
  static async createCart(userId) {
    try {
      const newCart = new Cart({ user: userId, products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error('Error creando el carrito:', error);
      throw error;
    }
  }

  // Método para obtener un carrito por su ID
  static async getCartById(cartId) {
    try {
      return await Cart.findById(cartId).populate('products.product');
    } catch (error) {
      console.error('Error obteniendo el carrito por ID:', error);
      throw error;
    }
  }

  // Método para guardar el carrito
  static async saveCart(cart) {
    try {
      await cart.save();
    } catch (error) {
      console.error('Error guardando el carrito:', error);
      throw error;
    }
  }
}

module.exports = CartRepository;
