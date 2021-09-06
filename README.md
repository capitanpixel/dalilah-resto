# dalilah-resto
Aplicación para pedidos y delivery de comidas rápidas. 

## Instalación de Node
Para su funcionamiento debe tener instalado "node". 

Busque en el [Sitio Oficial de Node](https://nodejs.org/es/download/) la mejor opción de acuerdo a su sistema operativo.

## Conexión con base de datos: Mongo Atlas 
Ingrese al sitio web de [Mongo Atlas](https://www.mongodb.com/es/cloud/atlas) y siga las instrucciones para generar una base de datos online. Recuerde incluir en un archivo ".env" su nombre de usuario, contraseña y nombre de base de datos.

En el presente repositorio se incluye un "sample.env" como ejemplo. 

## Dependencias
También debe instalar las siguientes dependencias:
~~~
npm install -g nodemon
npm i express
npm i js-yaml
npm i swagger-ui-express
npm i mongoose
npm i crypto-js
npm i dotenv
npm i helmet
npm i jsonwebtoken
npm i redis
npm i mocha
npm i chai
npm i chai-http
~~~
y hacerla correr con: 
~~~
npm run dev
~~~