// middlewares/validateUserMiddleware.js
const { validationResult } = require('express-validator');

const validateUserMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Log de errores crudos para depuración
    console.log('express-validator raw errors:', errors.array());

    // Formateamos errores como array de objetos { param, msg }
    const errorDetails = errors.array().map((err) => ({
      param: err.path, // Usar 'path' en lugar de 'param'
      msg: err.msg,
    }));

    console.log('USER VALIDATION ERRORS:', errorDetails); // Log de depuración

    return res.status(400).json({
      error: true,
      message: 'Errores de validación',
      details: errorDetails,
    });
  }

  next(); // Pasamos al siguiente middleware si no hay errores
};

module.exports = validateUserMiddleware;
