const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Login del usuario
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Comparar la contraseña en texto plano con el hash almacenado
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Actualizar last_connection
    user.last_connection = new Date();
    await user.save();

    // Generar el token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Enviar el token como cookie segura e incluirlo en la respuesta JSON
    res
      .cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Solo seguro en producción
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 día
      })
      .status(200)
      .json({
        message: 'Login exitoso',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          last_connection: user.last_connection,
        },
      });
  } catch (error) {
    console.error('[ERROR] Login:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Logout del usuario
const logoutUser = async (req, res) => {
  const userId = req.user?.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar last_connection al logout
    user.last_connection = new Date();
    await user.save();

    // Limpiar la cookie JWT
    res
      .clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .status(200)
      .json({ message: 'Logout exitoso' });
  } catch (error) {
    console.error('[ERROR] Logout:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { loginUser, logoutUser };
