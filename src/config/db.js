const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Si estamos en test, usar MONGO_URI_TEST; si no, usar MONGO_URI o localhost como fallback
    const uri = process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TEST
      : (process.env.MONGO_URI || 'mongodb://localhost:27017/adoption');

    console.log(`Conectando a la base de datos: ${uri}`);
    await mongoose.connect(uri);
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
