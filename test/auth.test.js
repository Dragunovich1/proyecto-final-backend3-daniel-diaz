const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const logger = require('../src/config/logger'); // Importar el logger

describe('Auth API', () => {
  let token; // Token para pruebas de logout
  let emailPrueba;

  // Crear un usuario de prueba antes de las pruebas
  before(async () => {
    emailPrueba = `prueba-${Date.now()}@example.com`;

    const usuarioCreado = await User.create({
      name: 'Usuario de Prueba',
      email: emailPrueba,
      password: 'test1234', // Contraseña sin encriptar para pruebas
      role: 'user',
    });

    logger.logTestResult('Usuario creado para pruebas', true);
    logger.info('Usuario creado para pruebas', {
      email: usuarioCreado.email,
      id: usuarioCreado._id.toString(),
    });
  });

  describe('POST /api/sessions/login', () => {
    // Prueba de login exitoso
    it('Debería iniciar sesión correctamente y devolver un token', async () => {
      const res = await request(app)
        .post('/api/sessions/login')
        .send({
          email: emailPrueba,
          password: 'test1234',
        });

      const result = res.status === 200 && res.body.token;
      logger.logTestResult('Debería iniciar sesión correctamente y devolver un token', result);

      if (!result) {
        logger.error('Error al iniciar sesión', { status: res.status, body: res.body });
        throw new Error('Error al iniciar sesión');
      }

      token = res.body.token; // Guardar el token para pruebas de logout
      logger.info('Token guardado para pruebas', { token });
    });

    // Prueba de login con credenciales incorrectas
    it('Debería devolver error al iniciar sesión con credenciales incorrectas', async () => {
      const res = await request(app)
        .post('/api/sessions/login')
        .send({
          email: emailPrueba,
          password: 'contraseñaIncorrecta',
        });

      const result = res.status === 401 && res.body.error.includes('Credenciales incorrectas');
      logger.logTestResult('Debería devolver error al iniciar sesión con credenciales incorrectas', result);

      if (!result) {
        logger.error('Error al manejar credenciales incorrectas', { status: res.status, body: res.body });
        throw new Error('Error al manejar credenciales incorrectas');
      }
    });

    // Prueba de login con usuario inexistente
    it('Debería devolver error al iniciar sesión con un usuario inexistente', async () => {
      const res = await request(app)
        .post('/api/sessions/login')
        .send({
          email: 'usuario-inexistente@example.com',
          password: 'test1234',
        });

      const result = res.status === 404 && res.body.error.includes('Usuario no encontrado');
      logger.logTestResult('Debería devolver error al iniciar sesión con un usuario inexistente', result);

      if (!result) {
        logger.error('Error al manejar usuario inexistente', { status: res.status, body: res.body });
        throw new Error('Error al manejar usuario inexistente');
      }
    });
  });

  describe('POST /api/sessions/logout', () => {
    // Prueba de logout exitoso
    it('Debería cerrar sesión correctamente', async () => {
      const res = await request(app)
        .post('/api/sessions/logout')
        .set('Cookie', `jwt=${token}`); // Usar la cookie para autenticación

      const result = res.status === 200 && res.body.message.includes('Logout exitoso');
      logger.logTestResult('Debería cerrar sesión correctamente', result);

      if (!result) {
        logger.error('Error al cerrar sesión', { status: res.status, body: res.body });
        throw new Error('Error al cerrar sesión');
      }
    });

    // Prueba de logout sin token
    it('Debería devolver error al cerrar sesión sin token', async () => {
      const res = await request(app).post('/api/sessions/logout');

      const result = res.status === 401 && res.body.error.includes('Token no proporcionado o no válido');
      logger.logTestResult('Debería devolver error al cerrar sesión sin token', result);

      if (!result) {
        logger.error('Error al manejar logout sin token', { status: res.status, body: res.body });
        throw new Error('Error al manejar logout sin token');
      }
    });

    // Prueba de logout con token inválido
    it('Debería devolver error al cerrar sesión con un token inválido', async () => {
      const res = await request(app)
        .post('/api/sessions/logout')
        .set('Cookie', 'jwt=token-invalido');

      const result = res.status === 401 && res.body.error.includes('Token no válido');
      logger.logTestResult('Debería devolver error al cerrar sesión con un token inválido', result);

      if (!result) {
        logger.error('Error al manejar token inválido en logout', { status: res.status, body: res.body });
        throw new Error('Error al manejar token inválido en logout');
      }
    });
  });
});
