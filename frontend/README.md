# Frontend — Dashboard Ejecutivo de Cumplimiento Normativo

## Descripción

Este directorio contiene la interfaz web del proyecto académico **Dashboard Ejecutivo de Cumplimiento Normativo**.

El frontend permite consultar y administrar información relacionada con obligaciones normativas, auditorías, controles y evidencias. También presenta indicadores de cumplimiento mediante un dashboard y se comunica con el backend desarrollado en FastAPI.

## Tecnologías utilizadas

- React: construcción de la interfaz mediante componentes.
- Vite: entorno de desarrollo y compilación.
- JavaScript: lógica de interacción y consumo de la API.
- CSS: presentación visual de la aplicación.

## Requisitos previos

- Node.js y npm instalados.
- Backend FastAPI configurado y en ejecución.
- Base de datos PostgreSQL configurada para el backend.

## Instalación

Desde la carpeta principal del proyecto, abrir una terminal y ejecutar:

```bash
cd frontend
npm install
```

## Ejecutar el frontend

```bash
npm run dev
```

Abrir en el navegador la dirección indicada por Vite, normalmente:

`http://localhost:5173`

## Configuración de la API

El frontend utiliza la variable de entorno `VITE_API_URL` para establecer la dirección del backend.

De manera predeterminada, se utiliza:

`http://127.0.0.1:8000`

Para configurar otra dirección, crear un archivo `.env` dentro de `frontend` con el siguiente contenido:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Después de modificar el archivo `.env`, reiniciar Vite para aplicar los cambios.

Las variables que comienzan con `VITE_` pueden quedar expuestas en el navegador. No deben utilizarse para almacenar contraseñas, claves secretas ni tokens privados.

## Funcionalidades principales

La interfaz contempla:

- Inicio de sesión de usuarios.
- Visualización de indicadores de cumplimiento.
- Consulta y gestión de obligaciones normativas.
- Consulta de información relacionada con auditorías, controles y evidencias.
- Filtros por departamento y normativa.
- Identificación de obligaciones vencidas y próximas a vencer.
- Indicadores de cumplimiento por departamento.

La disponibilidad de las operaciones depende de los permisos del usuario y de los endpoints implementados en el backend.

## Compilación

Para generar una versión de producción:

```bash
npm run build
```

El resultado se genera en la carpeta `dist`.

## Estructura general

- `src/`: componentes, lógica y estilos de la aplicación.
- `public/`: recursos públicos.
- `package.json`: dependencias y comandos del frontend.
- `vite.config.js`: configuración de Vite.

## Integración con el backend

El frontend consume los endpoints de FastAPI para consultar y administrar la información.

Para utilizar correctamente el sistema, deben estar disponibles el backend y su conexión a PostgreSQL.

## Documentación adicional

Consultar el archivo `README.md` de la raíz del repositorio para conocer la configuración general del proyecto, la base de datos y la puesta en marcha del backend.