// /models/productModel.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  category: String,
  stock: Number,
});

module.exports = mongoose.model('Product', productSchema);
