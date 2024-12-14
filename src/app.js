// app.js

// 1. Importar Módulos Necesarios
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const passport = require('passport');
require('./config/passport'); // Importar configuración de Passport
const User = require('./models/userModel');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const mocksRouter = require('./routes/mocks.router');
const adoptionRoutes = require('./routes/adoption.router');
const dataRoutes = require('./routes/data.router');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const exphbs = require('express-handlebars'); // Importar express-handlebars

dotenv.config();

// 2. Inicializar la Aplicación
const app = express();

// 3. Definir la Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentación de la API de nuestro proyecto, incluyendo usuarios y adopciones',
    },
    servers: [
      {
        url: 'http://localhost:8080', // Cambia la URL si usas otro puerto
      },
    ],
  },
  apis: ['./src/routes/authRoutes.js', './src/routes/adoption.router.js', './src/routes/productRoutes.js', './src/routes/cartRoutes.js'], 
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 4. Configuración de Middlewares

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60, // Duración de la sesión (1 hora)
    },
  })
);

// Inicializar Passport y sesiones
app.use(passport.initialize());
app.use(passport.session());

// 5. Configuración del motor de plantillas Handlebars
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    multiply: (a, b) => a * b,
    eq: (a, b) => a === b,
    json: (context) => JSON.stringify(context, null, 2),
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// 6. Servir Archivos Estáticos
app.use(express.static(path.join(__dirname, 'public')));

// 7. Definición de Rutas
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/mocks', mocksRouter);
app.use('/api', dataRoutes);
app.use('/api/adoptions', adoptionRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// Exportar la aplicación para ser utilizada en server.js y los tests
module.exports = app;

// Función para crear un usuario administrador si no existe
module.exports.createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin = new User({
        first_name: 'Admin',
        last_name: 'User',
        email: adminEmail,
        password: hashedPassword,
        age: 30,
        role: 'admin', // Asegurarse de que el rol es 'admin'
      });
      await admin.save();
      console.log(`Usuario administrador creado con email: ${adminEmail}`);
    } else {
      console.log('Usuario administrador ya existe');
    }
  } catch (error) {
    console.error('Error creando el usuario admin:', error);
  }
};
