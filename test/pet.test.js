const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const logger = require('../src/config/logger'); // Importar el logger

describe('Mascotas API', () => {
  let testPetId;

  it('Debería obtener todas las mascotas', async () => {
    const res = await request(app).get('/api/pets');
    const result = res.status === 200 && Array.isArray(res.body);
    logger.logTestResult('Debería obtener todas las mascotas', result);
    if (!result) throw new Error('Error al obtener las mascotas');
  });

  it('Debería crear una nueva mascota', async () => {
    const res = await request(app)
      .post('/api/pets')
      .send({
        name: 'Mascota de Prueba',
        species: 'Dog',
        breed: 'Labrador',
        age: 3,
        adopted: false,
      });

    const result = res.status === 201 && res.body._id;
    logger.logTestResult('Debería crear una nueva mascota', result);
    if (!result) throw new Error('Error al crear la mascota');
    testPetId = res.body._id;
  });

  it('Debería obtener una mascota por ID', async () => {
    const res = await request(app).get(`/api/pets/${testPetId}`);
    const result = res.status === 200 && res.body._id === testPetId;
    logger.logTestResult('Debería obtener una mascota por ID', result);
    if (!result) throw new Error('Error al obtener la mascota por ID');
  });

  it('Debería devolver un error al buscar una mascota inexistente', async () => {
    const res = await request(app).get('/api/pets/64b5f4321d2a3e8765a1fabc');
    const result = res.status === 404 && res.body.message.includes('Mascota no encontrada');
    logger.logTestResult('Debería devolver un error al buscar una mascota inexistente', result);
    if (!result) throw new Error('Error al manejar mascota inexistente');
  });

  it('Debería actualizar una mascota por ID', async () => {
    const res = await request(app)
      .put(`/api/pets/${testPetId}`)
      .send({
        name: 'Mascota Actualizada',
      });

    const result = res.status === 200 && res.body.name === 'Mascota Actualizada';
    logger.logTestResult('Debería actualizar una mascota por ID', result);
    if (!result) throw new Error('Error al actualizar la mascota');
  });

  it('Debería eliminar una mascota por ID', async () => {
    const res = await request(app).delete(`/api/pets/${testPetId}`);
    const result = res.status === 200 && res.body.message.includes('Mascota eliminada correctamente');
    logger.logTestResult('Debería eliminar una mascota por ID', result);
    if (!result) throw new Error('Error al eliminar la mascota');
  });

  it('Debería devolver un error al intentar crear una mascota con nombre demasiado corto', async () => {
    const res = await request(app)
      .post('/api/pets')
      .send({ name: 'A', species: 'Cat', breed: 'Siames', age: 2, adopted: false });

    console.log('DEBUG =>', res.body);

    const result =
      res.status === 400 &&
      res.body.details.some((error) => error.includes('El nombre debe tener al menos 3 caracteres'));

    if (!result) throw new Error('Error al validar nombre demasiado corto');
  });

  it('Debería devolver un error al intentar crear una mascota con especie inválida', async () => {
    const res = await request(app)
    .post('/api/pets')
    .send({
      name: 'Mascota Test',
      species: 'A',
      breed: 'Mítico',
      age: 5,
      adopted: false,
    });

    const result = res.status === 400 &&
    res.body.details.some((error) => error.includes('La especie debe tener al menos 3 caracteres'));

    logger.logTestResult('Debería devolver un error al intentar crear una mascota con especie inválida', result);
    if (!result) throw new Error('Error al validar especie inválida');
  });

  it('Debería devolver un error al intentar crear una mascota con edad negativa', async () => {
    const res = await request(app)
    .post('/api/pets')
    .send({
      name: 'Mascota Test',
      species: 'Bird',
      breed: 'Canario',
      age: -1,
      adopted: false,
    });

    const result = res.status === 400 &&
    res.body.details.some((error) => error.includes('La edad debe ser un valor positivo'));

    logger.logTestResult('Debería devolver un error al intentar crear una mascota con edad negativa', result);
    if (!result) throw new Error('Error al validar edad negativa');
  });
});
