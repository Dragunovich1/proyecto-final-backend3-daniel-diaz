// /models/petModel.js

const mongoose = require('mongoose');

// Definir el esquema para una mascota
const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// Crear el modelo de mascota basado en el esquema
const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
