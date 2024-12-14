// /daos/productDao.js

const Product = require('../models/productModel');

class ProductDAO {
  async getAllProducts(query = {}, options = {}) {
    return await Product.find(query, null, options);
  }

  async getProductById(productId) {
    return await Product.findById(productId);
  }

  async createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async updateProduct(productId, productData) {
    return await Product.findByIdAndUpdate(productId, productData, { new: true });
  }

  async deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId);
  }
}

module.exports = new ProductDAO();
