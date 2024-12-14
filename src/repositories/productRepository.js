// /repositories/productRepository.js

const Product = require('../models/productModel');

class ProductRepository {
  // Método para obtener todos los productos
  static async getProducts() {
    try {
      return await Product.find();
    } catch (error) {
      console.error('Error obteniendo todos los productos:', error);
      throw error;
    }
  }

  // Método para obtener un producto por ID
  static async getProductById(productId) {
    try {
      return await Product.findById(productId);
    } catch (error) {
      console.error('Error obteniendo el producto por ID:', error);
      throw error;
    }
  }

  // Método para crear un nuevo producto
  static async createProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      console.error('Error creando el producto:', error);
      throw error;
    }
  }

  // Método para actualizar un producto por ID
  static async updateProduct(productId, productData) {
    try {
      return await Product.findByIdAndUpdate(productId, productData, { new: true });
    } catch (error) {
      console.error('Error actualizando el producto:', error);
      throw error;
    }
  }

  // Método para eliminar un producto por ID
  static async deleteProduct(productId) {
    try {
      return await Product.findByIdAndDelete(productId);
    } catch (error) {
      console.error('Error eliminando el producto:', error);
      throw error;
    }
  }
}

module.exports = ProductRepository;
