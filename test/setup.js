const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno específicas para pruebas
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

before(async () => {
  console.log('Conectando a la base de datos de pruebas:', process.env.MONGO_URI_TEST);
  await mongoose.connect(process.env.MONGO_URI_TEST); // Sin opciones obsoletas
});

after(async () => {
  if (process.env.NODE_ENV === 'test') {
    console.log('Limpieza de la base de datos de pruebas');
    await mongoose.connection.dropDatabase(); // Borra todos los datos
    await mongoose.connection.close(); // Cierra la conexión
    console.log('Conexión con MongoDB cerrada correctamente');
  }
});
