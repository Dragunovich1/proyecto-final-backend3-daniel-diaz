# Utilizar una imagen oficial de Node.js como base
FROM node:18

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar todas las dependencias (incluidas las de desarrollo)
RUN npm install --include=dev

# Copiar el resto del código de la aplicación
COPY . .

# Establecer el entorno de producción como predeterminado
ENV NODE_ENV=production

# Exponer el puerto de la aplicación
EXPOSE 8080

# Comando predeterminado para iniciar la aplicación
CMD ["node", "src/server.js"]
