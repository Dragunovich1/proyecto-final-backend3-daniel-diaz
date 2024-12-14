// utils/userMockGenerator.js

const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

async function generateUsers(count) {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    users.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: await bcrypt.hash('coder123', 10), // Contraseña "coder123" encriptada
      role: faker.helpers.arrayElement(['user', 'admin']), // Role aleatorio entre "user" y "admin"
      pets: [] // Array vacío de mascotas
    });
  }

  return users;
}

module.exports = generateUsers;
