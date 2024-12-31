const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear directorios si no existen
const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configuración de almacenamiento para imágenes de mascotas
const petsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const petsPath = path.join(__dirname, '../uploads/pets');
    ensureDirectoryExistence(petsPath);
    cb(null, petsPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Configuración de almacenamiento para documentos de usuarios
const documentsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const documentsPath = path.join(__dirname, '../uploads/documents');
    ensureDirectoryExistence(documentsPath);
    cb(null, documentsPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filtro para tipos de archivos permitidos
const fileFilter = (req, file, cb) => {
  const allowedExtensions = {
    pets: ['image/jpeg', 'image/png', 'image/jpg'],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  };

  // Determinar el tipo en función del endpoint base
  const targetFolder = req.baseUrl.includes('pets') ? 'pets' : 'documents';

  // Log para verificar el tipo MIME del archivo subido
  console.log(`Tipo MIME detectado: ${file.mimetype}`);

  // Validar si el tipo de archivo está permitido
  if (allowedExtensions[targetFolder].includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.error(`Tipo de archivo no permitido: ${file.mimetype}`);
    cb(new Error(`Tipo de archivo no permitido. Solo se permiten ${allowedExtensions[targetFolder].join(', ')}`), false);
  }
};


// Configuración de middlewares
const uploadPets = multer({
  storage: petsStorage,
  fileFilter: (req, file, cb) => fileFilter(req, file, cb)
});

const uploadDocuments = multer({
  storage: documentsStorage,
  fileFilter: (req, file, cb) => fileFilter(req, file, cb)
});


module.exports = { uploadPets, uploadDocuments };
