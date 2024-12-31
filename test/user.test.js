const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const logger = require('../src/config/logger'); // Importar el logger

describe('Usuarios API', () => {
  let testUserId;

  it('Debería obtener todos los usuarios', async () => {
    const res = await request(app).get('/api/users');
    const result = res.status === 200 && Array.isArray(res.body);
    logger.logTestResult('Debería obtener todos los usuarios', result);
    if (!result) throw new Error('Error al obtener los usuarios');
  });

  it('Debería crear un nuevo usuario', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Usuario de Prueba',
        email: `prueba-${Date.now()}@example.com`,
        password: 'test1234',
        role: 'user',
      });

    const result = res.status === 201 && res.body._id;
    logger.logTestResult('Debería crear un nuevo usuario', result);
    if (!result) throw new Error('Error al crear el usuario');
    testUserId = res.body._id;
  });

  it('Debería obtener un usuario por ID', async () => {
    const res = await request(app).get(`/api/users/${testUserId}`);
    const result = res.status === 200 && res.body._id === testUserId;
    logger.logTestResult('Debería obtener un usuario por ID', result);
    if (!result) throw new Error('Error al obtener el usuario por ID');
  });

  it('Debería devolver un error al buscar un usuario inexistente', async () => {
    const res = await request(app).get('/api/users/64b5f4321d2a3e8765a1fabc');
    const result = res.status === 404 && res.body.message.includes('Usuario no encontrado');
    logger.logTestResult('Debería devolver un error al buscar un usuario inexistente', result);
    if (!result) throw new Error('Error al manejar usuario inexistente');
  });

  it('Debería actualizar un usuario por ID', async () => {
    const res = await request(app)
      .put(`/api/users/${testUserId}`)
      .send({
        name: 'Usuario Actualizado',
      });

    const result = res.status === 200 && res.body.name === 'Usuario Actualizado';
    logger.logTestResult('Debería actualizar un usuario por ID', result);
    if (!result) throw new Error('Error al actualizar el usuario');
  });

  it('Debería eliminar un usuario por ID', async () => {
    const res = await request(app).delete(`/api/users/${testUserId}`);
    const result = res.status === 200 && res.body.message.includes('Usuario eliminado correctamente');
    logger.logTestResult('Debería eliminar un usuario por ID', result);
    if (!result) throw new Error('Error al eliminar el usuario');
  });

  it('Debería devolver un error al intentar crear un usuario con nombre demasiado corto', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'A',
        email: `test-${Date.now()}@example.com`,
        password: 'test1234',
        role: 'user',
      });

    const result =
      res.status === 400 &&
      res.body.details.some((error) => error.msg.includes('El nombre debe tener al menos 3 caracteres'));

    logger.logTestResult('Debería devolver un error al intentar crear un usuario con nombre demasiado corto', result);
    if (!result) throw new Error('Error al validar nombre demasiado corto');
  });

  it('Debería devolver un error al intentar crear un usuario con email inválido', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Usuario Test',
        email: 'correo-no-valido',
        password: 'test1234',
        role: 'user',
      });

    const result = res.status === 400 &&
      res.body.details.some((error) => error.param === 'email' && error.msg.includes('El email no es válido'));
    console.log('DEBUG =>', res.body);

    logger.logTestResult('Debería devolver un error al intentar crear un usuario con email inválido', result);
    if (!result) throw new Error('Error al validar email inválido');
  });

  it('Debería devolver un error al intentar crear un usuario con contraseña demasiado corta', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Usuario Test',
        email: `test-${Date.now()}@example.com`,
        password: '123',
        role: 'user',
      });

    const result =
      res.status === 400 &&
      res.body.details.some((error) => error.msg.includes('La contraseña debe tener al menos 6 caracteres'));

    logger.logTestResult('Debería devolver un error al intentar crear un usuario con contraseña demasiado corta', result);
    if (!result) throw new Error('Error al validar contraseña demasiado corta');
  });

  it('Debería devolver un error al intentar crear un usuario con un email duplicado', async () => {
    const emailDuplicado = `test-duplicate-${Date.now()}@example.com`;

    await request(app)
      .post('/api/users')
      .send({
        name: 'Usuario Original',
        email: emailDuplicado,
        password: 'test1234',
        role: 'user',
      });

    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Usuario Duplicado',
        email: emailDuplicado,
        password: 'test1234',
        role: 'user',
      });

    const result = res.status === 400 && res.body.message.includes('El email ya está registrado');
    logger.logTestResult('Debería devolver un error al intentar crear un usuario con un email duplicado', result);
    if (!result) throw new Error('Error al manejar email duplicado');
  });

  it('Debería devolver un error al intentar actualizar un usuario con datos inválidos', async () => {
    const res = await request(app)
      .put(`/api/users/${testUserId}`)
      .send({
        email: 'correo-no-valido',
      });

    const result =
      res.status === 400 &&
      res.body.details.some((error) => error.param === 'email' && error.msg.includes('El email no es válido'));

    logger.logTestResult('Debería devolver un error al intentar actualizar un usuario con datos inválidos', result);
    if (!result) throw new Error('Error al manejar actualización con datos inválidos');
  });
});
