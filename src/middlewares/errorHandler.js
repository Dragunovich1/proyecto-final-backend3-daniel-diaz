const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  let statusCode = 500; // Código de estado predeterminado
  let errorMessage = 'Error interno del servidor';

  // Manejar errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = err.message || 'Error de validación';
  }

  // Manejar errores de duplicación en Mongoose (clave única)
  if (err.code && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue).join(', ');
    errorMessage = `El valor para ${field} ya está en uso.`;
  }

  // Manejar errores de autenticación
  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorMessage = 'No está autorizado para realizar esta acción';
  }

  // Manejar errores personalizados con un campo `status` y `message`
  if (err.status) {
    statusCode = err.status;
    errorMessage = err.message;
  }

  // Log del error
  logger.error(`[${req.method} ${req.url}] ${errorMessage}`, { stack: err.stack });

  // Respuesta de error
  res.status(statusCode).json({ error: errorMessage });
};

module.exports = errorHandler;
