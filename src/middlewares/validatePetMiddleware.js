// middlewares/validatePetMiddleware.js
const { validationResult } = require('express-validator');

const validatePetMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Formateamos errores como array de strings
    const messages = errors.array().map((err) => err.msg);

    console.log('PET VALIDATION ERRORS:', messages); // Log de depuración

    return res.status(400).json({
      error: true,
      message: 'Errores de validación',
      details: messages,
    });
  }

  next(); // Pasamos al siguiente middleware si no hay errores
};

module.exports = validatePetMiddleware;
