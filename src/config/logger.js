const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Verificar que el directorio de logs exista
const logDir = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Definimos los niveles de logs personalizados
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'blue',
    debug: 'cyan',
  },
};

// Formato de log para consola
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

// Formato de log para archivos y JSON
const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    const separator = '----------------------------------------------------------------------';
    return `${separator}\n[${timestamp}] [${level.toUpperCase()}] ${message}\n${separator}`;
  })
);

// Configuración de transporte con rotación diaria
const dailyRotateTransport = new DailyRotateFile({
  dirname: logDir, // Directorio donde se guardarán los logs
  filename: 'app-%DATE%.log', // Formato del archivo
  datePattern: 'YYYY-MM-DD', // Rotación diaria
  maxSize: '20m', // Tamaño máximo por archivo
  maxFiles: '14d', // Retener logs por 14 días
  level: 'info', // Nivel mínimo a guardar
});

// Crear logger con transporte condicional (consola vs archivo)
const logger = createLogger({
  levels: customLevels.levels,
  format: fileFormat, // Por defecto, formato JSON
  transports: [
    dailyRotateTransport, // Transporte de archivos rotativos
    new transports.File({ filename: path.join(logDir, 'errors.log'), level: 'error' }), // Logs de errores críticos
  ],
});

// Agregar transporte de consola en ambientes no productivos
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: consoleFormat, // Formato más legible para desarrollo
    })
  );
}

// Agregar transporte adicional para pruebas
if (process.env.NODE_ENV === 'test') {
  logger.add(
    new transports.File({
      filename: path.join(logDir, 'results.log'),
      level: 'info', // Registrar todos los logs en este archivo durante pruebas
      format: fileFormat,
    })
  );
}

// Método para registrar si un paso pasó o falló
logger.logTestResult = (testName, result) => {
  const status = result ? 'Passed' : 'Failed';
  logger.info(`${testName} - ${status}`);
};

module.exports = logger;
