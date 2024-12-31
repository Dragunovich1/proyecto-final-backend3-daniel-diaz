require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('./config/db');
const logger = require('./config/logger');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swaggerConfig');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');
const mockRoutes = require('./routes/mockRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const errorHandler = require('./middlewares/errorHandler'); // Middleware de manejo de errores

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares generales
app.use(cors());
app.use(express.json()); // Parsing de JSON
app.use(cookieParser());

// Logger inicial
logger.info('Servidor configurado');

// Conexión a la base de datos
mongoose.connectDB();

if (process.env.NODE_ENV === 'test') {
  logger.info('Aplicación corriendo en modo prueba');
}

// Documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas principales
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/mocks', mockRoutes);
app.use('/api/sessions', sessionRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

// Manejo de errores
app.use(errorHandler); // Uso del middleware de manejo de errores

// Iniciar el servidor si no se está en modo prueba
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
