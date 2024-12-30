<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
# Ejecutar en desarrollo

1. Clonar el repositorio desde Github

2. Ejecutar: __> yarn install__ para reconstruir el yarn_lock y node_modules

3. Tener Nest CLI instalado:  __> npm i -g @nest/cli__

4. Levantar la base de datos:  __> docker-compose up -d__

5. Clonar el archivo __.env.template__y renombrar la copia a __.env__

6. Llenar las variables de entorno definidas en el _.env_

7. Ejecutar la aplicacion en DEV: __> yarn start:dev__

8. Reconstruir la base de datos con la semilla:  __localhost:3000/api/v2/seed__ (postman)

## stack usado

* mongoDB
* nest

Conectar Nest con mongoBD
> npm i @nestjs/mongoose mongoose# nest-pokedex
