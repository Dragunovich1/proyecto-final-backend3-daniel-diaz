// /models/adoptionModel.js

const mongoose = require('mongoose');

// Definir el esquema para las adopciones
const adoptionSchema = new mongoose.Schema({
  petName: {
    type: String,
    required: [true, 'Datos incompletos'],
    maxlength: [50, 'El nombre de la mascota es demasiado largo']
  },
  adopterName: {
    type: String,
    required: [true, 'Datos incompletos']
  },
  adoptionDate: {
    type: Date,
    required: [true, 'Datos incompletos'],
    default: Date.now,
  },
});

// Crear el modelo basado en el esquema
const Adoption = mongoose.model('Adoption', adoptionSchema);

module.exports = Adoption;
