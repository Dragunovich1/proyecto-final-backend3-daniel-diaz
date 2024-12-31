const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Adoption API',
      version: '1.0.0',
      description: 'API para gestionar usuarios, mascotas y adopciones.',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Aplica el esquema de seguridad a todos los endpoints
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Ubicación de los comentarios para Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
