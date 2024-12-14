Proyecto Final - CoderHouse - Backend 3

Alumno: Daniel Diaz

Comisión: 70060

Docente: Daniel Villajuan

Tutores: Juan Pablo Tuttolomondo, Federico Interlandi Zoireff, Ivan Passalia

Descripción del Proyecto

Este proyecto es un servidor básico de e-commerce con dashboard desarrollado con Node.js y Express. Permite gestionar productos y carritos de compra, ofreciendo funcionalidades como la adición, eliminación y actualización de productos en tiempo real mediante WebSockets.

Instalación

Requisitos Previos

Node.js v14 o superior

MongoDB

Pasos de Instalación

Clonar el repositorio:

git clone https://github.com/Dragunovich1/proyecto-final-backend-daniel-diaz
cd proyecto-final-backend-daniel-diaz

Instalar las dependencias:

npm install

Configurar la base de datos:

Asegúrate de tener una instancia de MongoDB corriendo. Puedes usar la configuración por defecto en mongodb://localhost:27017/base_de_datos o modificar la configuración en app.js.

Ejecución del Servidor

Modo Desarrollo

Para ejecutar el servidor en modo desarrollo (con reinicio automático):

npm run dev

Modo Producción

Para ejecutar el servidor en modo producción:

npm start

El servidor estará corriendo en http://localhost:8080.

Vistas

Dashboard

URL: http://localhost:8080

Descripción: Muestra la lista de productos disponibles, permite acceder al resto de las vistas, se pueden realizar todas las pruebas desde aquí.

Agregar/modificar/eliminar productos

URL: http://localhost:8080/realtimeproducts

Descripción: Muestra una lista de productos que se actualiza en tiempo real. Permite agregar, modificar y eliminar productos.

Carrito de Compras

URL: http://localhost:8080/carts/:cid

Descripción: Muestra los productos en el carrito específico.

Detalle de Producto

URL: http://localhost:8080/products/:pid

Descripción: Muestra los detalles de un producto específico y permite agregarlo al carrito.

Instrucciones de Uso

Ejecutar el servidor según el modo elegido.

Acceder a las siguientes rutas desde el navegador:

http://localhost:8080 para ver el dashboard con la lista de productos.

http://localhost:8080/realtimeproducts para gestionar productos en tiempo real.

http://localhost:8080/carts/:cid para ver y gestionar el carrito de compras.

http://localhost:8080/products/:pid para ver los detalles de un producto específico.

La interfaz gráfica del dashboard permite realizar todas las pruebas necesarias para gestionar productos y carritos.

Iniciar sesión con el siguiente usuario administrador para realizar las pruebas:

Email: admin@example.com

Password: adminpassword

API y Pruebas Manuales

Productos

Obtener productos con filtros, paginación y ordenamientos

URL: GET /api/products

Params:

limit: 10

page: 1

sort: asc o desc

query: (categoría deseada)

Response: Devuelve la estructura con paginación y productos.

Agregar un nuevo producto

URL: POST /api/products

Body (JSON):

{
  "title": "Nuevo Producto",
  "description": "Descripción del producto",
  "code": "NP001",
  "price": 100,
  "stock": 50,
  "category": "Categoría",
  "status": true
}

Response: Devuelve el producto creado.

Obtener producto por ID

URL: GET /api/products/:pid

Response: Devuelve el producto con el ID especificado.

Actualizar un producto

URL: PUT /api/products/:pid

Body (JSON):

{
  "title": "Producto Actualizado",
  "description": "Descripción actualizada",
  "price": 120
}

Response: Devuelve el producto actualizado.

Eliminar un producto

URL: DELETE /api/products/:pid

Response: Devuelve un mensaje de confirmación de eliminación.

Carritos

Crear un nuevo carrito

URL: POST /api/carts

Response: Devuelve el carrito creado.

Obtener carrito por ID

URL: GET /api/carts/:cid

Response: Devuelve el carrito con el ID especificado.

Agregar producto al carrito

URL: POST /api/carts/add/:pid

Response: Devuelve el carrito con el producto añadido.

Eliminar un producto del carrito

URL: DELETE /api/carts/:cid/products/:pid

Response: Devuelve el carrito con el producto eliminado.

Usuarios

Registrar un usuario

URL: POST /api/auth/register

Body (JSON):

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan.perez@gmail.com",
  "age": 30,
  "password": "password123"
}

Response: Devuelve el usuario creado.

Iniciar sesión

URL: POST /api/auth/login

Body (JSON):

{
  "email": "juan.perez@gmail.com",
  "password": "password123"
}

Response: Devuelve un token JWT si las credenciales son correctas.

Obtener el usuario actual (basado en el JWT)

URL: GET /api/sessions/current

Response: Devuelve los datos del usuario autenticado.

Testing - Set de Pruebas

Prueba de Autenticación

Iniciar sesión con el usuario administrador proporcionado.

Verificar que se redirige correctamente al dashboard.

Pruebas de Productos

Agregar un nuevo producto: Desde el dashboard, añadir un producto y verificar que aparezca en la lista de productos.

Modificar producto existente: Editar un producto desde la vista de productos y comprobar los cambios.

Eliminar un producto: Eliminar un producto y verificar que desaparece de la lista.

Pruebas de Carrito

Agregar un producto al carrito: Seleccionar un producto y agregarlo al carrito.

Verificar carrito: Acceder a la vista del carrito y confirmar que los productos agregados están presentes con la cantidad correcta.

Finalizar compra: Completar la compra y confirmar que el carrito se vacía.

Pruebas de Rutas Protegidas

Intentar acceder al dashboard sin iniciar sesión. Verificar que redirige a la página de inicio de sesión.

Intentar eliminar un producto sin tener el rol de administrador. Verificar que la acción es rechazada.

Pruebas de Integridad

Crear y eliminar carritos: Crear un carrito, agregar productos, y luego eliminar productos del carrito para confirmar el comportamiento esperado.

Pruebas de sesión y seguridad: Verificar que un usuario autenticado solo pueda ver y modificar sus propios recursos.

Pruebas con Postman - Generación de Datos

Endpoints a Probar con Postman

GET /api/mocks/mockingusers

Objetivo: Obtener una lista de 50 usuarios generados aleatoriamente usando Faker.

URL: http://localhost:8080/api/mocks/mockingusers

Tipo de Petición: GET

Pasos para Probar:

Selecciona GET en Postman y prueba la URL mencionada.

Verifica que obtienes una lista de 50 usuarios.

POST /api/mocks/generateData

Objetivo: Generar e insertar en la base de datos la cantidad de usuarios y mascotas especificados.

URL: http://localhost:8080/api/mocks/generateData

Tipo de Petición: POST

Headers: Content-Type: application/json

Cuerpo:

{
  "users": 10,
  "pets": 20
}

Pasos para Probar:

Selecciona POST en Postman, agrega el JSON en el body y prueba la URL.

Verifica que los datos se generen y guarden.

GET /api/users

Objetivo: Obtener todos los usuarios generados y almacenados en la base de datos.

URL: http://localhost:8080/api/users

Tipo de Petición: GET

Pasos para Probar:

Selecciona GET en Postman y prueba la URL mencionada.

Verifica que obtienes todos los usuarios almacenados.

GET /api/pets

Objetivo: Obtener todas las mascotas generadas y almacenadas en la base de datos.

URL: http://localhost:8080/api/pets

Tipo de Petición: GET

Pasos para Probar:

Selecciona GET en Postman y prueba la URL mencionada.

Verifica que obtienes todas las mascotas almacenadas.