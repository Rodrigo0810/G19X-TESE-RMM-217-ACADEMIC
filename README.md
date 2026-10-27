# Dashboard Ejecutivo de Cumplimiento Normativo

## Descripción del proyecto

El Dashboard Ejecutivo de Cumplimiento Normativo es una aplicación web desarrollada para apoyar la gestión, consulta y seguimiento de información relacionada con el cumplimiento normativo de una organización.

El sistema permite administrar obligaciones, auditorías, controles, evidencias, riesgos, alertas y otros elementos relacionados con el cumplimiento normativo.

También incorpora un panel ejecutivo con indicadores y gráficas que facilitan la visualización de la información registrada.

## Tecnologías utilizadas

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Autenticación mediante JWT

### Frontend
- React
- Vite
- JavaScript

### Base de datos
- PostgreSQL

## Estructura del proyecto

- `backend/`: API REST, autenticación y lógica del servidor.
- `frontend/`: interfaz web y dashboard ejecutivo.
- `database/`: scripts SQL para la base de datos.
- `backend/.env.example`: plantilla de configuración del backend.
- `README.md`: documentación principal del proyecto.

## Estado del proyecto

El Dashboard Ejecutivo de Cumplimiento Normativo cuenta con sus principales funcionalidades implementadas y se encuentra en etapa de preparación para la entrega académica.

Se comprobó el inicio de sesión, la seguridad mediante JWT, los permisos de administrador, el funcionamiento de los módulos de Obligaciones y Auditorías, y la creación y persistencia de controles.

También se verificó que los indicadores reflejan correctamente la creación y eliminación de obligaciones.

El frontend compiló correctamente con Vite 8.3.2, sin errores de compilación.

### Seguridad implementada y verificada

- Autenticación mediante JWT.
- Rechazo de tokens inválidos y expirados.
- Permisos de administrador.
- Contraseñas protegidas mediante Argon2.
- Variables sensibles protegidas mediante archivos de entorno.
- Protección del último administrador activo, comprobada a nivel de función.

### Pruebas funcionales realizadas

- Inicio de sesión y visualización del dashboard.
- Creación, consulta, edición y eliminación de obligaciones.
- Creación, consulta, edición y eliminación de auditorías.
- Creación y persistencia de controles.
- Actualización de indicadores al crear y eliminar obligaciones.
- Compilación correcta del frontend.

## Instalación y ejecución del backend

### Requisitos previos

- Python 3.14.7 (versión utilizada y verificada durante el desarrollo).
- PostgreSQL 18.6 (versión utilizada y verificada).
- Base de datos `compliance_dashboard` creada.
- Entorno virtual de Python (`venv`).
- Dependencias del backend especificadas en `backend/requirements.txt`.

**Nota:** Las versiones anteriores corresponden al entorno donde se realizaron las pruebas. No se ha comprobado todavía la compatibilidad con todas las versiones anteriores o posteriores.

### Configuración

1. Abrir una terminal en la carpeta principal del proyecto.
2. Entrar a la carpeta `backend`.
3. Activar el entorno virtual.
4. Instalar las dependencias desde `requirements.txt`.
5. Crear el archivo `.env` tomando como referencia `.env.example`.
6. Configurar las credenciales de PostgreSQL y una clave JWT segura.

### Comandos para preparar e iniciar el backend

Desde la carpeta principal del proyecto, abrir una terminal PowerShell y ejecutar:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

El comando `python -m venv venv` crea el entorno virtual. Si ya existe y está configurado, no es necesario volver a crearlo.

Antes de iniciar el servidor, comprobar que PostgreSQL esté configurado, que se hayan ejecutado los scripts SQL correspondientes y que el archivo `backend/.env` contenga las variables de conexión y autenticación necesarias.

Para iniciar el backend, ejecutar:

```powershell
python -m uvicorn main:app --reload
```

Cuando el servidor esté funcionando, la documentación interactiva estará disponible en:

http://127.0.0.1:8000/docs


## Instalación y ejecución del frontend

### Requisitos previos

- Node.js 24.20.0 (versión utilizada y verificada durante el desarrollo).
- npm instalado y disponible mediante Node.js.
- React y Vite, cuyas dependencias se encuentran declaradas en `frontend/package.json`.
- Backend FastAPI configurado y en funcionamiento.
- Conexión activa con PostgreSQL.

**Nota:** Se verificó que el proyecto compila correctamente utilizando Node.js 24.20.0 y Vite 8.3.2. La compatibilidad con otras versiones no ha sido comprobada durante estas pruebas.

### Pasos para iniciar el frontend

1. Abrir una nueva terminal en la carpeta principal del proyecto.
2. Entrar a la carpeta `frontend`.
3. Instalar las dependencias.
4. Iniciar el servidor de desarrollo.

### Comandos

```powershell
cd frontend
npm install
npm run dev
```

Después de ejecutar los comandos, Vite mostrará en la terminal la dirección local para abrir la aplicación en el navegador.

Generalmente es:

http://localhost:5173

### Importante

Para utilizar las funcionalidades que consultan o modifican información, el backend debe estar ejecutándose y conectado a PostgreSQL.


## Configuración de la base de datos

El proyecto utiliza PostgreSQL para almacenar la información del Dashboard Ejecutivo de Cumplimiento Normativo.

### Preparación inicial

1. Instalar PostgreSQL.
2. Crear una base de datos llamada `compliance_dashboard`.
3. Abrir la herramienta de consultas SQL de PostgreSQL, por ejemplo, pgAdmin 4.
4. Seleccionar la base de datos `compliance_dashboard`.
5. Ejecutar el archivo `database/schema.sql` para crear las tablas y los roles iniciales.
6. Si se necesitan registros de ejemplo, revisar y ejecutar `database/data.sql` en una instalación de prueba.
7. Configurar las variables de conexión en `backend/.env`.

### Consideraciones importantes

- Ejecutar primero `schema.sql` y después `data.sql`, si se requieren datos de ejemplo.
- No publicar contraseñas ni claves secretas.
- No ejecutar los scripts de inicialización sobre una base de datos con información importante sin revisar previamente sus instrucciones SQL.
- Para una instalación nueva, crear el primer administrador mediante el script `backend/crear_admin.py`, una vez configurada la base de datos y verificadas las dependencias.

### Creación del primer administrador

Después de configurar PostgreSQL, ejecutar `schema.sql` e instalar las dependencias del backend, abrir una terminal en la carpeta principal del proyecto y ejecutar:

```powershell
python backend/crear_admin.py
```

El programa solicitará el nombre, correo electrónico y contraseña del administrador inicial. La contraseña se introduce de forma oculta y se almacena mediante un hash seguro.

Por seguridad, el script comprueba si ya existe un usuario con el rol Administrador. Si encuentra uno, no creará otro mediante este procedimiento.

## Configuración de la URL del backend

El frontend utiliza la variable de entorno `VITE_API_URL` para configurar la dirección de la API desarrollada con FastAPI.

Para configurar una dirección personalizada, crear un archivo `.env` dentro de la carpeta `frontend` con el siguiente contenido:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Si no se configura esta variable, el frontend utilizará automáticamente `http://127.0.0.1:8000`.

Después de modificar el archivo `.env`, es necesario reiniciar el servidor de desarrollo de Vite para aplicar los cambios.

Por seguridad, no deben almacenarse contraseñas, tokens privados ni claves secretas en variables que comiencen con `VITE_`, ya que pueden quedar expuestas en el navegador.

## Criterio unificado de obligaciones vencidas

El Dashboard Ejecutivo de Cumplimiento Normativo utiliza una sola
regla para identificar las obligaciones vencidas mediante la funcion
`estaVencida(obligacion)`.

Una obligacion se considera vencida cuando:

- Su estado es `Vencida`, independientemente de su fecha limite.
- Su fecha limite es anterior a la fecha actual y su estado no es `Cumplida`.

Esta regla se aplica a la tarjeta de obligaciones vencidas,
la grafica de distribucion de obligaciones, el indicador de
incidencias criticas y la alerta ejecutiva de vencimientos.

Las obligaciones vencidas no se contabilizan nuevamente en las
categorias `Pendiente` o `En progreso`.

La alerta de proximas a vencer considera obligaciones no vencidas
con fecha limite entre hoy y los proximos siete dias.

Los indicadores y alertas respetan los filtros del dashboard
por departamento y normativa.

## Matriz de permisos por rol - Corte 5

### Objetivo

Implementar el control de acceso basado en roles para proteger
las operaciones de consulta, creacion, edicion y eliminacion
del Dashboard Ejecutivo de Cumplimiento Normativo.

### Modulos protegidos

Los permisos se aplican a los siguientes nueve modulos:

1. Obligaciones
2. Auditorias
3. Controles
4. Evidencias
5. Riesgos
6. Alertas
7. Normativas
8. Departamentos
9. Indicadores

### Matriz de permisos

| Rol | Consultar (GET) | Crear (POST) | Editar (PUT) | Eliminar (DELETE) | Usuarios y Roles |
|---|---|---|---|---|---|
| Administrador | Permitido | Permitido | Permitido | Permitido | Permitido |
| Compliance | Permitido | Permitido | Permitido | Permitido | Denegado |
| Auditor | Permitido | Denegado | Denegado | Denegado | Denegado |
| Directivo | Permitido | Denegado | Denegado | Denegado | Denegado |

### Implementacion de seguridad

El backend utiliza FastAPI y autenticacion mediante JWT.

La dependencia `verificar_puede_editar` permite las operaciones
de modificacion exclusivamente a los roles Administrador y Compliance.

Los roles Auditor y Directivo pueden consultar los nueve modulos,
pero no tienen autorizacion para crear, editar o eliminar registros.

Los endpoints de Usuarios y Roles estan reservados al Administrador.

En el frontend desarrollado con React, los controles de creacion,
edicion y eliminacion se muestran segun los permisos del usuario.
La autorizacion definitiva se realiza en el backend.

### Evidencia de pruebas

Se ejecutaron las siguientes verificaciones:

- Auditor: GET 200 y POST 403 en los nueve modulos.
- Directivo: GET 200 y POST 403 en los nueve modulos.
- Compliance: GET 200 y POST 422 con datos incompletos en los nueve modulos.
- Administrador: GET 200 y POST 422 con datos incompletos en los nueve modulos.
- Usuarios y Roles: GET 200 para Administrador y GET 403 para los otros tres roles.
- Auditor y Directivo: PUT 403 y DELETE 403 en los nueve modulos.
- Se verifico la existencia de las 18 rutas PUT y DELETE mediante OpenAPI.
- Se reviso que las 18 operaciones PUT y DELETE tengan configurada la dependencia `verificar_puede_editar`.

### Resultados

Se completaron satisfactoriamente 152 verificaciones HTTP,
ademas de 18 comprobaciones de rutas y 18 comprobaciones
estaticas de proteccion de operaciones.

Las 36 verificaciones adicionales corresponden a:

- Compliance: nueve PUT con respuesta 422.
- Compliance: nueve DELETE con respuesta 404.
- Administrador: nueve PUT con respuesta 422.
- Administrador: nueve DELETE con respuesta 404.

Antes de cada DELETE se comprobo que el identificador
999999999 no existiera en la tabla correspondiente.

Las respuestas HTTP 422 confirman que la solicitud llego
a la validacion de datos, mientras que las respuestas 404
indican que el registro solicitado no fue encontrado.

Estas verificaciones no constituyen pruebas de creacion,
actualizacion o eliminacion exitosa de registros reales.

### Consideraciones

La ocultacion de botones en React mejora la experiencia del
usuario, pero no sustituye la validacion de permisos en FastAPI.

Los endpoints protegidos deben rechazar con HTTP 403 las
operaciones de modificacion realizadas por usuarios sin permiso.
