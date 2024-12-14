// /daos/cartDao.js

const Cart = require('../models/cartModel');

class CartDAO {
  async getCartById(cartId) {
    return await Cart.findById(cartId).populate('products.product');
  }

  async getCartByUser(userId) {
    return await Cart.findOne({ user: userId }).populate('products.product');
  }

  async createCart(cartData) {
    const cart = new Cart(cartData);
    return await cart.save();
  }

  async updateCart(cartId, cartData) {
    return await Cart.findByIdAndUpdate(cartId, cartData, { new: true });
  }
}

module.exports = new CartDAO();
