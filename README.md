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

## Uso

Esta sección explica cómo ingresar por primera vez al Dashboard Ejecutivo de Cumplimiento Normativo, recorrer el tablero y comprobar sus funcionalidades. Antes de comenzar, se deben completar la instalación, la configuración de PostgreSQL y la preparación del backend y frontend descritas anteriormente.

### 1. Crear el primer administrador

Desde la carpeta principal del proyecto, después de configurar la base de datos y las dependencias, ejecutar:

```powershell
python backend/crear_admin.py
```

El programa solicitará nombre, correo electrónico y contraseña. La contraseña se introduce de manera oculta y se almacena mediante un hash seguro.

Este procedimiento está destinado al primer administrador. Si ya existe uno, el script no creará otro mediante este mecanismo. No se deben publicar las credenciales.

### 2. Iniciar sesión en la aplicación

En una terminal PowerShell, desde la raíz del repositorio, iniciar el backend:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload
```

En otra terminal, desde la raíz del repositorio, iniciar el frontend:

```powershell
cd frontend
npm install
npm run dev
```

Abrir en el navegador la dirección que muestre Vite, normalmente:

http://localhost:5173

Ingresar el correo electrónico y la contraseña del administrador creado previamente. Después de autenticarse, acceder al Dashboard Ejecutivo.

El backend debe permanecer ejecutándose y conectado a PostgreSQL. La documentación de la API puede consultarse normalmente en http://127.0.0.1:8000/docs.

### 3. Recorrido inicial del tablero

Al ingresar, revisar las tarjetas de indicadores y las gráficas de obligaciones, auditorías, controles, riesgos y alertas.

El tablero presenta información consolidada a partir de los registros disponibles en PostgreSQL. Entre sus indicadores se encuentra el porcentaje de cumplimiento y el seguimiento de obligaciones por estado.

Los valores dependen de los datos registrados y de los filtros seleccionados; por ello, pueden variar entre instalaciones.

### 4. Probar los filtros por departamento y normativa

En el apartado **Filtros del Dashboard Ejecutivo**:

1. Seleccionar un departamento en el filtro **Departamento**.
2. Revisar cómo se actualizan los indicadores, las gráficas y las obligaciones mostradas.
3. Seleccionar una opción en el filtro **Normativa**.
4. Comprobar los resultados correspondientes a los filtros activos.
5. Presionar **Limpiar filtros** para regresar a la consulta general.

Los filtros permiten consultar información específica sin modificar los registros almacenados.

### 5. Consultar el cumplimiento por departamento

Localizar la visualización **Cumplimiento por departamento** en el tablero.

Revisar los valores de cada departamento y seleccionar uno en el filtro correspondiente para consultar sus resultados. Comparar los indicadores con las obligaciones registradas para esa área.

El porcentaje mostrado es un indicador calculado por la aplicación y no constituye una certificación automática de cumplimiento regulatorio.

### 6. Comprobar las alertas de obligaciones

El dashboard identifica obligaciones vencidas y próximas a vencer a partir de sus fechas límite y estados.

Para comprobar estas funciones con una cuenta autorizada:

1. Entrar al módulo **Obligaciones**.
2. Crear una obligación de prueba con estado **Pendiente** y una fecha límite anterior a la fecha actual.
3. Regresar al dashboard y revisar la alerta de obligaciones vencidas.
4. Crear otra obligación de prueba con fecha límite futura dentro de los próximos siete días.
5. Verificar que aparezca en la alerta de obligaciones próximas a vencer.
6. Revisar las fechas límite en la lista **Obligaciones registradas**.
7. Eliminar los registros de prueba cuando corresponda y no existan relaciones que impidan eliminarlos.

El cálculo de vencimientos sigue el criterio unificado documentado en este README. Las obligaciones vencidas no deben contabilizarse nuevamente como próximas a vencer.

### 7. Verificar los permisos por rol

El sistema utiliza autenticación JWT y autorización basada en roles. Los permisos de los nueve módulos protegidos se resumen a continuación:

| Rol | Consultar | Crear, editar y eliminar | Usuarios y Roles |
|---|---|---|---|
| Administrador | Permitido | Permitido | Permitido |
| Compliance | Permitido | Permitido | Denegado |
| Auditor | Permitido | Denegado | Denegado |
| Directivo | Permitido | Denegado | Denegado |

Para comprobar las diferencias:

1. Iniciar sesión con una cuenta **Administrador** y verificar los controles de gestión disponibles.
2. Cerrar sesión e ingresar con una cuenta de prueba de rol **Directivo**.
3. Abrir el dashboard y consultar sus indicadores, filtros y alertas.
4. Comprobar que el usuario Directivo no tenga botones para crear, editar o eliminar registros.
5. Confirmar que la administración de usuarios y roles esté reservada al Administrador.

Los roles Auditor y Directivo tienen permisos de consulta, mientras que Administrador y Compliance pueden modificar registros en los nueve módulos protegidos. La autorización definitiva se aplica en FastAPI, no solamente mediante la visibilidad de botones en React.

### 8. Resultado esperado

Al finalizar el recorrido, el usuario debe poder iniciar sesión, consultar los indicadores, aplicar y limpiar filtros, revisar el cumplimiento por departamento, identificar obligaciones vencidas o próximas a vencer y distinguir los permisos correspondientes a cada rol.

Se recomienda realizar las pruebas de modificación sobre registros de prueba, sin alterar información real de cumplimiento normativo.

## Uso de IA

### 1. Herramienta utilizada

Durante el desarrollo del Dashboard Ejecutivo de Cumplimiento Normativo se utilizó **ChatGPT, asistente de inteligencia artificial de OpenAI**, como apoyo para analizar requisitos, proponer modificaciones de código, revisar errores, organizar pruebas y mejorar la documentación.

La inteligencia artificial se utilizó como herramienta de asistencia. Las propuestas generadas no se aceptaron automáticamente: se revisaron y contrastaron con el proyecto y los requisitos de TODO Academy.

### 2. Aplicación de la IA en el desarrollo

| Área | Para qué se utilizó la IA | Cómo se revisó el resultado |
|---|---|---|
| Frontend React | Proponer ajustes de JSX, componentes y estructura del dashboard | Revisión del código, compilación y pruebas en navegador |
| Refactorización | Apoyar la extracción de `Dashboard.jsx` y `Obligaciones.jsx` | Verificación de filtros, gráficas, formularios y permisos |
| Métricas | Apoyar la centralización de cálculos en `utils/metricas.js` | Revisión de indicadores y alertas |
| Depuración | Analizar advertencias y proponer correcciones | Ejecución de ESLint y compilación |
| Seguridad | Apoyar la interpretación de permisos y la preparación de pruebas | Comprobación de restricciones según los roles |
| Documentación | Estructurar instrucciones de uso y explicaciones técnicas | Comparación con comandos, funcionalidades y README existentes |

### 3. Decisiones tomadas por el desarrollador

Las decisiones sobre el alcance del proyecto, la prioridad de las correcciones, la aceptación de propuestas y la incorporación de cambios al repositorio fueron responsabilidad del desarrollador.

Se decidió dar prioridad a los criterios pendientes de TODO Academy antes de agregar nuevas funcionalidades.

También se optó por separar las vistas del dashboard y de obligaciones en componentes independientes, conservar la lógica existente y registrar cada refactorización mediante commits separados.

Las sugerencias de IA se adaptaron a la estructura real del repositorio y se verificaron antes de considerarlas terminadas.

### 4. Revisión y pruebas realizadas

Para comprobar los cambios propuestos con asistencia de IA se utilizaron las siguientes herramientas:

- `git status`: identificar archivos modificados.
- `git diff --check`: revisar problemas de formato.
- `git log`: comprobar el historial de commits.
- `npm run lint`: verificar el análisis estático del frontend.
- `npm run build`: comprobar que la aplicación compile.
- Navegador web: probar filtros, indicadores, alertas, formularios y permisos.
- Git y GitHub: registrar y publicar las modificaciones verificadas.

Durante la separación de componentes se comprobó que el dashboard conservara sus gráficas, filtros y alertas. También se verificaron las operaciones de creación, edición y eliminación de obligaciones y las restricciones visibles según el rol.

Las comprobaciones de compilación y análisis estático no sustituyen las pruebas funcionales ni garantizan por sí solas la ausencia de vulnerabilidades.

### 5. Transparencia y responsabilidad

El proyecto se desarrolló con apoyo de inteligencia artificial en tareas específicas de programación, revisión, depuración y documentación.

El desarrollador decidió qué cambios incorporar, revisó los resultados, ejecutó las pruebas disponibles y verificó el comportamiento de las funciones modificadas.

La responsabilidad final sobre el código, la protección de credenciales, las pruebas, la documentación y la entrega académica corresponde al desarrollador.

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
