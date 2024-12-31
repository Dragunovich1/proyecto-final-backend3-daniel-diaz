const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Detectar si estamos en Docker o localhost
    const isDocker = process.env.NODE_ENV === 'development' && process.env.MONGO_URI.includes('mongo');
    const uri = process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TEST
      : isDocker
      ? process.env.MONGO_URI
      : 'mongodb://localhost:27017/adoption'; // Default para localhost

    console.log(`Conectando a la base de datos: ${uri}`);
    await mongoose.connect(uri); // Sin opciones adicionales
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
