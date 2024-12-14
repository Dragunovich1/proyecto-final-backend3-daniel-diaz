// /middlewares/authMiddleware.js

const passport = require('passport');

// Middleware para autenticación con JWT
const authJWTMiddleware = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Acceso no autorizado' });
      }
      next();
    },
  ];
};

// Middleware para autenticación basada en sesiones
const authSessionMiddleware = (roles = []) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect('/auth/login'); // Redirigir si no hay sesión activa
    }

    // Si se pasan roles, verificar que el usuario tenga uno de los roles autorizados
    if (roles.length && !roles.includes(req.session.user.role)) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    next();
  };
};

module.exports = { authJWTMiddleware, authSessionMiddleware };
