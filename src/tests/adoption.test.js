const request = require('supertest');
const assert = require('assert');
const { startServer, stopServer } = require('../server');

const BASE_URL = process.env.APP_HOST || 'http://localhost:4000'; // Usar APP_HOST o localhost por defecto

describe('Adoption API Tests', function () {
  this.timeout(15000); // Aumentar el timeout a 15 segundos para asegurar tiempo suficiente

  let createdAdoptionId;

  before(async () => {
    await startServer();
  });

  after(async () => {
    await stopServer();
  });

  // Test para obtener todas las adopciones
  it('Debería obtener todas las adopciones', (done) => {
    request(BASE_URL)
      .get('/api/adoptions')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert(Array.isArray(res.body), 'El resultado debería ser un array');
        done();
      });
  });

  // Test para crear una nueva adopción
  it('Debería crear una nueva adopción', (done) => {
    const newAdoption = {
      petName: 'Fido',
      adopterName: 'Juan Pérez',
      adoptionDate: '2024-11-15',
    };

    request(BASE_URL)
      .post('/api/adoptions')
      .send(newAdoption)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.petName, 'Fido', 'El nombre de la mascota debería ser Fido');
        createdAdoptionId = res.body._id; // Guardar el ID creado para las pruebas siguientes
        done();
      });
  });

  // Test para obtener una adopción por ID
  it('Debería obtener una adopción por ID', (done) => {
    request(BASE_URL)
      .get(`/api/adoptions/${createdAdoptionId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body._id, createdAdoptionId, 'El ID debería coincidir');
        done();
      });
  });

  // Test para actualizar una adopción por ID
  it('Debería actualizar una adopción por ID', (done) => {
    const updatedData = {
      adopterName: 'Carlos García',
    };

    request(BASE_URL)
      .put(`/api/adoptions/${createdAdoptionId}`)
      .send(updatedData)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.adopterName, 'Carlos García', 'El nombre del adoptante debería ser Carlos García');
        done();
      });
  });

  // Test para eliminar una adopción por ID
  it('Debería eliminar una adopción por ID', (done) => {
    request(BASE_URL)
      .delete(`/api/adoptions/${createdAdoptionId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.message, 'Adopción eliminada', 'El mensaje debería ser "Adopción eliminada"');
        done();
      });
  });

  // --- Pruebas Negativas y de Límite ---

  // Intentar crear una adopción con datos incompletos
  it('No debería crear una adopción con datos incompletos', (done) => {
    const incompleteAdoption = {
      adopterName: 'Maria Lopez', // Falta el campo petName y adoptionDate
    };

    request(BASE_URL)
      .post('/api/adoptions')
      .send(incompleteAdoption)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.message, 'Datos incompletos', 'El mensaje debería ser "Datos incompletos"');
        done();
      });
  });

  // Intentar obtener una adopción con un ID no válido
  it('No debería encontrar una adopción con un ID inexistente', (done) => {
    const nonExistentId = '617f1f77bcf86cd799439011'; // Un ID que no existe en la base de datos

    request(BASE_URL)
      .get(`/api/adoptions/${nonExistentId}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.message, 'Adopción no encontrada', 'El mensaje debería ser "Adopción no encontrada"');
        done();
      });
  });

  // Intentar actualizar una adopción con un ID inexistente
  it('No debería actualizar una adopción con un ID inexistente', (done) => {
    const nonExistentId = '617f1f77bcf86cd799439011';
    const updatedData = {
      adopterName: 'Nuevo Nombre',
    };

    request(BASE_URL)
      .put(`/api/adoptions/${nonExistentId}`)
      .send(updatedData)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.message, 'Adopción no encontrada', 'El mensaje debería ser "Adopción no encontrada"');
        done();
      });
  });

  // Intentar eliminar una adopción con un ID inexistente
  it('No debería eliminar una adopción con un ID inexistente', (done) => {
    const nonExistentId = '617f1f77bcf86cd799439011';

    request(BASE_URL)
      .delete(`/api/adoptions/${nonExistentId}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.message, 'Adopción no encontrada', 'El mensaje debería ser "Adopción no encontrada"');
        done();
      });
  });

  // Intentar crear una adopción con un nombre de mascota demasiado largo (Prueba de límite)
  it('No debería crear una adopción con un nombre de mascota demasiado largo', (done) => {
    const longPetName = 'P'.repeat(300); // Crear un nombre de mascota de 300 caracteres
    const newAdoption = {
      petName: longPetName,
      adopterName: 'Ana Garcia',
      adoptionDate: '2024-11-20',
    };

    request(BASE_URL)
      .post('/api/adoptions')
      .send(newAdoption)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.message, 'El nombre de la mascota es demasiado largo', 'El mensaje debería ser "El nombre de la mascota es demasiado largo"');
        done();
      });
  });
});
