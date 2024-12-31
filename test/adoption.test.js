const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const logger = require('../src/config/logger'); // Importar el logger

describe('Adopciones API', () => {
  let testPetId;
  let testUserId;
  let testAdoptionId;

  before(async () => {
    const userRes = await request(app)
      .post('/api/users')
      .send({
        name: 'Usuario de Prueba',
        email: `prueba-${Date.now()}@example.com`,
        password: 'test1234',
        role: 'user',
      });
    testUserId = userRes.body._id;

    const petRes = await request(app)
      .post('/api/pets')
      .send({
        name: 'Mascota de Prueba',
        species: 'Dog',
        breed: 'Labrador',
        age: 3,
        adopted: false,
      });
    testPetId = petRes.body._id;
  });

  it('Debería obtener todas las adopciones', async () => {
    const res = await request(app).get('/api/adoptions');
    const result = res.status === 200 && Array.isArray(res.body);
    logger.logTestResult('Debería obtener todas las adopciones', result);
    if (!result) throw new Error('Error al obtener las adopciones');
  });

  it('Debería crear una nueva adopción', async () => {
    const res = await request(app)
      .post('/api/adoptions')
      .send({
        petId: testPetId,
        adopterId: testUserId,
      });

    const result = res.status === 201 && res.body._id;
    logger.logTestResult('Debería crear una nueva adopción', result);
    if (!result) throw new Error('Error al crear la adopción');
    testAdoptionId = res.body._id;
  });

  it('Debería obtener una adopción por ID', async () => {
    const res = await request(app).get(`/api/adoptions/${testAdoptionId}`);
    const result = res.status === 200 && res.body._id === testAdoptionId;
    logger.logTestResult('Debería obtener una adopción por ID', result);
    if (!result) throw new Error('Error al obtener la adopción por ID');
  });

  it('Debería devolver un error al buscar una adopción inexistente', async () => {
    const res = await request(app).get('/api/adoptions/64b5f4321d2a3e8765a1fabc');
    const result = res.status === 404 && res.body.message.includes('Adopción no encontrada');
    logger.logTestResult('Debería devolver un error al buscar una adopción inexistente', result);
    if (!result) throw new Error('Error al manejar adopción inexistente');
  });

  it('Debería eliminar una adopción por ID', async () => {
    const res = await request(app).delete(`/api/adoptions/${testAdoptionId}`);
    const result = res.status === 200 && res.body.message.includes('Adopción eliminada correctamente');
    logger.logTestResult('Debería eliminar una adopción por ID', result);
    if (!result) throw new Error('Error al eliminar la adopción');
  });

  it('Debería devolver un error al intentar adoptar una mascota ya adoptada', async () => {
    await request(app)
      .post('/api/adoptions')
      .send({
        petId: testPetId,
        adopterId: testUserId,
      });

    const res = await request(app)
      .post('/api/adoptions')
      .send({
        petId: testPetId,
        adopterId: testUserId,
      });

    const result = res.status === 400 && res.body.message.includes('Mascota no disponible para adopción');
    logger.logTestResult('Debería devolver un error al intentar adoptar una mascota ya adoptada', result);
    if (!result) throw new Error('Error al manejar adopción duplicada');
  });
});
