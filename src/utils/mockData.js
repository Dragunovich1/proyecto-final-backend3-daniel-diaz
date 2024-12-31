const faker = require('faker');
const User = require('../models/User');
const Pet = require('../models/Pet');

// Generar usuarios falsos
const generateMockUsers = async (quantity = 50) => {
  const users = [];
  for (let i = 0; i < quantity; i++) {
    users.push({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: 'coder123', // Contraseña predeterminada
      role: 'user',
    });
  }
  await User.insertMany(users);
  console.log(`${quantity} usuarios generados exitosamente.`);
};

// Generar mascotas falsas
const generateMockPets = async (quantity = 100) => {
  const speciesOptions = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Fish'];
  const pets = [];
  for (let i = 0; i < quantity; i++) {
    pets.push({
      name: faker.name.firstName(),
      species: faker.random.arrayElement(speciesOptions),
      breed: faker.lorem.word(),
      age: faker.datatype.number({ min: 1, max: 15 }),
      adopted: false,
    });
  }
  await Pet.insertMany(pets);
  console.log(`${quantity} mascotas generadas exitosamente.`);
};

module.exports = { generateMockUsers, generateMockPets };
