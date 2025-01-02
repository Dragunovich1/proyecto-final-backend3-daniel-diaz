
# Proyecto Final - CoderHouse - Backend 3

**Alumno:** Daniel Diaz  
**Comisión:** 70060  
**Docente:** Daniel Villajuan  
**Tutores:** Juan Pablo Tuttolomondo, Federico Interlandi Zoireff, Ivan Passalia  

---

## Descripción del Proyecto

Este proyecto es un servidor básico de adopciones, desarrollado con Node.js y Express. Permite gestionar usuarios, mascotas y adopciones, ofreciendo funcionalidades como la adición, eliminación y actualización de los mismos.

---

## Links

DockerHub: https://hub.docker.com/repository/docker/dragunovich1/proyecto-final-backend3-coderhouse/general

Git Hub: https://github.com/Dragunovich1/proyecto-final-backend3-daniel-diaz

Railway: https://proyecto-final-backend3-daniel-diaz.railway.app

---

## Instalación y Configuración

### Clonar el Repositorio
```bash
git clone https://github.com/Dragunovich1/proyecto-final-backend3-daniel-diaz
cd proyecto-final-backend3-daniel-diaz
```

### Instalar Dependencias
```bash
npm install
```

### Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
MONGO_URL=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/adoption
JWT_SECRET=claveSecretaParaJWT
PORT=8080
NODE_ENV=development
```

---

## Uso

### Iniciar el Servidor
Para iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

Para iniciar el servidor en producción:
```bash
npm start
```

El servidor estará disponible en [http://localhost:8080](http://localhost:8080).

---

## Documentación Swagger

La API está documentada utilizando Swagger. Puedes acceder a la documentación en:
[http://localhost:8080/api-docs](http://localhost:8080/api-docs)

---

## Testing Automatizado

### Ejecutar Pruebas Unitarias
Este proyecto incluye pruebas unitarias desarrolladas con Mocha y Chai. Para ejecutarlas:
```bash
npm test
```

### Pre-requisitos para las Pruebas
1. Configura una base de datos de pruebas en tu archivo `.env`:
   ```
   MONGO_URL=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/adoption_test
   ```
2. Asegúrate de que la base de datos de pruebas esté accesible.

---

## Dockerización

Este proyecto incluye un `Dockerfile` para contenedores. Puedes construir y ejecutar la imagen Docker de la siguiente manera:

### Utilizar el comando:
```bash
docker run -p 8080:8080 \ -e NODE_ENV=production \ -e MONGO_URI_DOCKER=mongodb://mongo:27017/adoption \ -e JWT_SECRET=clave_secreta_proyecto_backend \ dragunovich1/proyecto-final-backend3-coderhouse
```

---


### Variables de Entorno en Railway
Configura las mismas variables de entorno descritas anteriormente en el panel de control de Railway.

---

¡Gracias por revisar mi proyecto!
