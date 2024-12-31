const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El campo "name" es obligatorio'],
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
  },
  email: {
    type: String,
    required: [true, 'El campo "email" es obligatorio'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'El email no es válido'],
  },
  password: {
    type: String,
    required: [true, 'El campo "password" es obligatorio'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  documents: [
    {
      name: { type: String, required: true },
      reference: { type: String, required: true },
    },
  ],
  last_connection: {
    type: Date,
    default: null,
  },
});

// Middleware de hashing para todos los entornos
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// Método de instancia para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
