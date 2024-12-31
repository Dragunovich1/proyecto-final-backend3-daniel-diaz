// controllers/userController.js
const User = require('../models/User');

// Obtener todos los usuarios
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo usuario
const createUser = async (req, res, next) => {
  console.log('Executing createUser controller'); // Log de confirmación
  try {
    const { name, email, password, role } = req.body;
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    return res.status(201).json(newUser);
  } catch (error) {
    // Error de clave duplicada
    if (error.code === 11000) {
      console.log('USER DUPLICATION ERROR:', error); // Log de depuración
      return res.status(400).json({
        error: true,
        message: 'El email ya está registrado',
      });
    }

    // Error de validación de Mongoose
    if (error.name === 'ValidationError') {
      // Log detallado del error
      console.log('Mongoose Validation Error:', error.errors);

      // Devolvemos un array de OBJETOS: { param, msg }
      const errorDetails = Object.keys(error.errors).map((field) => {
        const path = error.errors[field].path;
        const message = error.errors[field].message;
        console.log(`Field: ${field}, Path: ${path}, Message: ${message}`);
        return {
          param: path || field,
          msg: message,
        };
      });

      console.log('USER VALIDATION ERRORS:', errorDetails); // Log de depuración

      return res.status(400).json({
        error: true,
        message: 'Errores de validación',
        details: errorDetails,
      });
    }

    next(error);
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Actualizar un usuario por ID
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    // Error de validación de Mongoose
    if (error.name === 'ValidationError') {
      // Devolvemos un array de OBJETOS: { param, msg }
      const errorDetails = Object.keys(error.errors).map((field) => ({
        param: field,
        msg: error.errors[field].message,
      }));

      console.log('USER VALIDATION ERRORS on update:', errorDetails); // Log de depuración

      return res.status(400).json({
        error: true,
        message: 'Errores de validación',
        details: errorDetails,
      });
    }

    next(error);
  }
};

// Eliminar un usuario por ID
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
