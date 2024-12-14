// config/passport.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const dotenv = require('dotenv'); // Importar dotenv

dotenv.config(); // Cargar las variables de entorno

// Estrategia Local para autenticación con email y contraseña
passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user, { message: 'Login exitoso' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Estrategia JWT para proteger rutas
passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Serializar y deserializar usuarios para sesiones
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
