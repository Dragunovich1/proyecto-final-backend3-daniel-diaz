// utils/errorHandler.js

/**
 * Función de manejo de errores.
 * 
 * @param {String} message - Mensaje de error personalizado.
 * @param {Number} statusCode - Código de estado HTTP.
 */
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = CustomError;
