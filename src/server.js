// server.js

const mongoose = require('mongoose');
const app = require('./app');
const http = require('http');

// Definir el puerto, usando el valor de entorno o el valor por defecto
const PORT = process.env.PORT || 8080;

// Verificar si estamos en modo de prueba
const isTestMode = process.env.NODE_ENV === 'test';

// Crear el servidor HTTP
let server = http.createServer(app);

// Configurar la URI de MongoDB según el entorno
let mongoURI;

if (process.env.NODE_ENV === 'docker') {
  // Conexión desde Docker (para contenedores Docker)
  mongoURI = 'mongodb://mongo:27017/mydatabase'; // Aquí 'mongo' es el nombre del servicio en docker-compose
} else if (isTestMode) {
  // Conexión en modo de prueba
  mongoURI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/mydatabase-test';
} else {
  // Conexión local para desarrollo
  mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
}

// Iniciar el servidor
async function startServer() {
  try {
    // Conectar a MongoDB antes de iniciar el servidor
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');

    // Crear el usuario administrador después de conectarse a MongoDB
    await app.createAdminUser();

    if (isTestMode) {
      // En modo de prueba, usar el puerto 4000
      server = app.listen(4000, () => {
        console.log('Servidor de prueba escuchando en el puerto 4000');
      });
    } else {
      // En modo normal, usar el puerto definido (por ejemplo 8080)
      server.listen(PORT, () => {
        console.log(`Servidor funcionando en puerto ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
}

// Función para detener el servidor
async function stopServer() {
  if (server) {
    server.close(() => {
      console.log('Servidor cerrado');
    });
  }
}

// Solo iniciar el servidor si no estamos ejecutando pruebas (para que Mocha controle el inicio y cierre del servidor durante los tests)
if (!isTestMode) {
  startServer();
}

// Exportar las funciones para manejar el servidor en pruebas
module.exports = { startServer, stopServer };
