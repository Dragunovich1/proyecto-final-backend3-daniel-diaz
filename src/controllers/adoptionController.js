const Adoption = require('../models/Adoption');
const Pet = require('../models/Pet');
const User = require('../models/User');

// Obtener todas las adopciones
const getAllAdoptions = async (req, res, next) => {
  try {
    const adoptions = await Adoption.find().populate('pet').populate('adopter');
    res.status(200).json(adoptions);
  } catch (error) {
    next(error);
  }
};

// Crear una nueva adopción
const createAdoption = async (req, res, next) => {
  try {
    const { petId, adopterId } = req.body;

    // Verificar existencia de la mascota y el usuario
    const pet = await Pet.findById(petId);
    if (!pet || pet.adopted) return res.status(400).json({ message: 'Mascota no disponible para adopción' });

    const adopter = await User.findById(adopterId);
    if (!adopter) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Crear la adopción
    const adoption = new Adoption({ pet: petId, adopter: adopterId });
    await adoption.save();

    // Actualizar estado de la mascota
    pet.adopted = true;
    pet.owner = adopterId;
    await pet.save();

    res.status(201).json(adoption);
  } catch (error) {
    next(error);
  }
};

// Obtener una adopción por ID
const getAdoptionById = async (req, res, next) => {
  try {
    const adoption = await Adoption.findById(req.params.id).populate('pet').populate('adopter');
    if (!adoption) return res.status(404).json({ message: 'Adopción no encontrada' });
    res.status(200).json(adoption);
  } catch (error) {
    next(error);
  }
};

// Eliminar una adopción por ID
const deleteAdoption = async (req, res, next) => {
  try {
    const adoption = await Adoption.findByIdAndDelete(req.params.id);
    if (!adoption) return res.status(404).json({ message: 'Adopción no encontrada' });

    // Actualizar estado de la mascota
    const pet = await Pet.findById(adoption.pet);
    if (pet) {
      pet.adopted = false;
      pet.owner = null;
      await pet.save();
    }

    res.status(200).json({ message: 'Adopción eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAdoptions,
  createAdoption,
  getAdoptionById,
  deleteAdoption,
};
