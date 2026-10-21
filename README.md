
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
- `docker/`: archivos relacionados con Docker.
- `README.md`: documentación principal del proyecto.

## Estado del proyecto

Proyecto académico en desarrollo. Las funcionalidades y configuraciones deben verificarse durante las pruebas de instalación y ejecución.


## Instalación y ejecución del backend

### Requisitos previos

- Python instalado.
- PostgreSQL instalado y configurado.
- Base de datos `compliance_dashboard` creada.
- Entorno virtual de Python.

### Configuración

1. Abrir una terminal en la carpeta principal del proyecto.
2. Entrar a la carpeta `backend`.
3. Activar el entorno virtual.
4. Instalar las dependencias desde `requirements.txt`.
5. Crear el archivo `.env` tomando como referencia `.env.example`.
6. Configurar las credenciales de PostgreSQL y una clave JWT segura.

### Comandos para iniciar el backend

Desde la carpeta principal del proyecto:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Cuando el servidor esté funcionando, la documentación interactiva de la API estará disponible en:

http://127.0.0.1:8000/docs

**Nota:** el backend requiere que PostgreSQL esté configurado correctamente antes de iniciar.


## Instalación y ejecución del frontend

### Requisitos previos

- Node.js instalado.
- npm disponible.
- Backend configurado y en funcionamiento.

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
