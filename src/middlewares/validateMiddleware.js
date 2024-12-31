const { validationResult } = require('express-validator');

// Middleware de validación de datos
const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Si hay errores, los formateamos en un array de mensajes estructurados
    const errorDetails = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      error: true,
      message: 'Errores de validación',
      details: errorDetails,
    });
  }

  next(); // Pasamos al siguiente middleware si no hay errores
};

module.exports = validateMiddleware;
