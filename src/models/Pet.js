const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El campo "name" es obligatorio'],
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
  },
  species: {
    type: String,
    required: [true, 'El campo "species" es obligatorio'],
    minlength: [3, 'La especie debe tener al menos 3 caracteres'],
  },
  breed: {
    type: String,
    required: [true, 'El campo "breed" es obligatorio'],
  },
  age: {
    type: Number,
    required: [true, 'El campo "age" es obligatorio'],
    min: [0, 'La edad debe ser un valor positivo'],
  },
  adopted: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
});

module.exports = mongoose.model('Pet', petSchema);
