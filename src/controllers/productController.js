// /controllers/productController.js

const ProductRepository = require('../repositories/productRepository');

const productController = {
  async getAllProducts(req, res) {
    try {
      const products = await ProductRepository.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los productos', error });
    }
  },

  async createProduct(req, res) {
    try {
      const productData = req.body;
      console.log('Datos recibidos para crear producto:', productData);
      const product = await ProductRepository.createProduct(productData);
      res.status(201).json({ message: 'Producto creado', product });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el producto', error });
    }
  },

  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const productData = req.body;
      await ProductRepository.updateProduct(productId, productData);
      res.json({ message: 'Producto actualizado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
  },

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      console.log(`Eliminando producto con ID: ${productId}`); // Log para depuración
      await ProductRepository.deleteProduct(productId);
      res.json({ message: 'Producto eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
  },
};

module.exports = productController;
