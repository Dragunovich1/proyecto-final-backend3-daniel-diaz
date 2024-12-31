const jwt = require('jsonwebtoken');

// Middleware para autenticar JWT desde cookies
const authenticateJWT = (req, res, next) => {
  const token = req.cookies?.jwt; // Obtener el token de las cookies

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado o no válido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Decodificar el token y guardar la información del usuario en `req.user`
    next();
  } catch (error) {
    console.error('[ERROR] Token inválido:', error.message);
    return res.status(401).json({ error: 'Token no válido' });
  }
};

// Función para generar JWT
const generateJWT = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

module.exports = { authenticateJWT, generateJWT };
