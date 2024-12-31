// controllers/petController.js
const Pet = require('../models/Pet');

// Obtener todas las mascotas
const getAllPets = async (req, res, next) => {
  try {
    const pets = await Pet.find();
    return res.status(200).json(pets);
  } catch (error) {
    next(error);
  }
};

// Crear una nueva mascota
const createPet = async (req, res, next) => {
  try {
    const { name, species, breed, age, adopted } = req.body;
    const newPet = new Pet({ name, species, breed, age, adopted });
    await newPet.save();

    return res.status(201).json(newPet);
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Devolvemos un array de strings
      const messages = Object.values(error.errors).map((err) => err.message);

      console.log('PET VALIDATION ERRORS:', messages); // Log de depuración

      return res.status(400).json({
        error: true,
        message: 'Errores de validación',
        details: messages, // <-- array de strings
      });
    }
    next(error);
  }
};

// Obtener una mascota por ID
const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }
    return res.status(200).json(pet);
  } catch (error) {
    next(error);
  }
};

// Actualizar una mascota por ID
const updatePet = async (req, res, next) => {
  try {
    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPet) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }

    return res.status(200).json(updatedPet);
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Devolvemos un array de strings
      const messages = Object.values(error.errors).map((err) => err.message);

      console.log('PET VALIDATION ERRORS on update:', messages); // Log de depuración

      return res.status(400).json({
        error: true,
        message: 'Errores de validación',
        details: messages,
      });
    }
    next(error);
  }
};

// Eliminar una mascota por ID
const deletePet = async (req, res, next) => {
  try {
    const deletedPet = await Pet.findByIdAndDelete(req.params.id);
    if (!deletedPet) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }
    return res.status(200).json({ message: 'Mascota eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPets,
  createPet,
  getPetById,
  updatePet,
  deletePet,
};
