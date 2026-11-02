# Bitacora tecnica de instalacion limpia - Revision 7

## 1. Identificacion

- Proyecto: Dashboard Ejecutivo de Cumplimiento Normativo.
- Revision: 7 - Instalacion limpia y validacion.
- Fecha de documentacion: 02/11/2026.
- Repositorio: Rodrigo0810/G19X-TESE-RMM-217-ACADEMIC.
- Rama inicial: main.
- Commit inicial: da6f30f.
- Mensaje del commit: fix: agregar dependencias faltantes del backend.
- Fecha del commit inicial: 30/10/2026.
- Estado: validacion local realizada; cambios pendientes de commit y push.

## 2. Objetivo

Comprobar que el proyecto puede instalarse y ejecutarse desde
un clon independiente, identificando problemas de configuracion,
dependencias, conexion a PostgreSQL, comunicacion entre frontend
y backend, autenticacion y carga de datos de ejemplo.

Registrar las incidencias encontradas y las correcciones
necesarias para mejorar la reproducibilidad de la instalacion.

## 3. Entorno de pruebas

Se utilizo Windows con PowerShell y un clon independiente
del repositorio original.

- Repositorio original:
  C:\Users\rodri\OneDrive\Documentos\PROYECTO
- Clon de pruebas:
  C:\Users\rodri\Prueba_Limpia_Dashboard_2026
- Commit base del clon: da6f30f.
- Python del entorno de pruebas: 3.14.7.
- Node.js: 24.20.0.
- PostgreSQL: 18.6.
- SQLAlchemy comprobado: 2.1.1.
- Driver pg8000 comprobado: 1.31.5.
- Base aislada: compliance_dashboard_prueba_2026.
- Usuario aislado: dashboard_prueba_2026.
- Backend utilizado: http://127.0.0.1:8001.
- Frontend utilizado: http://127.0.0.1:5174.

La base original compliance_dashboard no se utilizo para
las pruebas de insercion ni para la validacion de los KPI.

Las contrasenas y los archivos .env no se incorporan
a esta bitacora.

## 4. Preparacion e instalacion

Se preparo un clon independiente del repositorio, sin
reutilizar los entornos virtuales ni las dependencias
instaladas del proyecto original.

Se configuro un entorno Python propio del clon y se
instalaron las dependencias necesarias para el backend.

Se instalaron las dependencias del frontend y se preparo
la configuracion local de la URL de la API.

En PostgreSQL se utilizo una base de datos independiente,
con usuario especifico para las pruebas.

Se verifico la existencia del esquema de base de datos
y se comprobo la conexion desde el backend.

Se creo un administrador de prueba para validar el
inicio de sesion de la aplicacion.

## 5. Incidencias encontradas y soluciones

### 5.1 Puertos predeterminados ocupados

Durante la instalacion se detecto que los puertos
predeterminados 8000 y 5173 estaban ocupados.

Solucion:
- Ejecutar el backend en el puerto 8001.
- Ejecutar el frontend en el puerto 5174.
- Configurar VITE_API_URL con la direccion del backend.
- Documentar el uso de puertos alternativos en README.md.

No fue necesario finalizar procesos ajenos al proyecto.

### 5.2 Error CORS en el inicio de sesion

La comunicacion inicial desde el frontend de pruebas
al backend fue rechazada durante la solicitud preflight.

Solucion:
- Permitir configurar los origenes mediante CORS_ORIGINS.
- Cargar explicitamente backend/.env antes de importar
  los modulos que dependen de la configuracion.
- Incluir el origen http://127.0.0.1:5174.
- Reiniciar el backend para aplicar los cambios.

Verificacion:
- Solicitud al esquema OpenAPI: HTTP 200.
- Preflight desde el origen autorizado: HTTP 200.
- Preflight desde un origen no autorizado: HTTP 400.

Despues de la correccion se comprobo el inicio de sesion
y la visualizacion del dashboard desde el clon de pruebas.

### 5.3 Documentacion de configuracion

Se identificaron instrucciones que requerian mayor
claridad para una instalacion reproducible.

Correcciones:
- Aclarar el uso de DB_PASSWORD.
- Documentar CORS_ORIGINS.
- Documentar los puertos alternativos.
- Precisar la configuracion de VITE_API_URL.
- Corregir la referencia al linter oxlint.

### 5.4 Fechas fijas en datos de ejemplo

El archivo database/data.sql contenia fechas absolutas,
lo que podia provocar resultados poco representativos
cuando se ejecutara en otro momento.

Solucion:
- Sustituir fechas de ejemplo por expresiones relativas
  a CURRENT_DATE.
- Conservar escenarios de obligaciones pendientes,
  en progreso y vencidas.

### 5.5 Valores fijos de indicadores

Los indicadores iniciales contenian valores numericos
escritos manualmente.

Solucion:
- Calcular el porcentaje de obligaciones cumplidas.
- Calcular la cantidad de obligaciones vencidas.
- Calcular la cantidad de riesgos criticos.

Estos valores se calculan al ejecutar data.sql.
No constituyen un mecanismo de actualizacion automatica
despues de modificar registros desde la aplicacion.

## 6. Validaciones realizadas

### 6.1 Conexion y funcionamiento

- Backend iniciado correctamente en el puerto 8001.
- Frontend iniciado correctamente en el puerto 5174.
- Conexion con la API comprobada.
- Autenticacion con administrador aislado: aprobada.
- Visualizacion del dashboard: aprobada.
- Pruebas CORS para origen autorizado: aprobadas.
- Prueba CORS para origen no autorizado: aprobada.

### 6.2 Formula de cumplimiento

Se realizaron pruebas SQL de solo lectura.

Escenarios:
- Sin obligaciones: 0 %.
- Ninguna obligacion cumplida: 0 %.
- Una de tres obligaciones cumplida: 33.33 %.
- Todas las obligaciones cumplidas: 100 %.

Los cuatro escenarios fueron aprobados.

### 6.3 Ejecucion integral de data.sql

Se ejecuto database/data.sql dentro de una transaccion
en la base de datos aislada.

Registros temporales obtenidos:
- Departamentos: 3.
- Normativas: 2.
- Obligaciones: 3.
- Auditorias: 2.
- Controles: 2.
- Evidencias: 2.
- Riesgos: 2.
- Indicadores: 3.
- Alertas: 1.

Total: 20 registros temporales.

La ejecucion SQL finalizo sin errores.

### 6.4 Validacion de los tres KPI

Resultados obtenidos:
- Cumplimiento general: 0.00 %.
- Obligaciones vencidas: 1.
- Riesgos criticos: 1.

Los tres resultados coincidieron con los valores
esperados para los registros de ejemplo.

### 6.5 Reversion de cambios

La ejecucion de data.sql se realizo dentro de una
transaccion que termino con ROLLBACK.

Se verificaron las nueve tablas despues de la reversion.

Resultado:
- Cero registros de ejemplo persistentes.
- Base de datos aislada conservada sin esos datos.
- Base de datos original no utilizada para esta prueba.

### 6.6 Validaciones finales del backend y frontend

El 02/11/2026 se realizaron verificaciones adicionales.

Backend:
- Python del clon aislado: 3.14.7.
- Comprobacion de dependencias: sin conflictos detectados.
- Archivos Python analizados sintacticamente: 36.
- Resultado de sintaxis: aprobado.
- API OpenAPI en puerto 8001: HTTP 200.
- No se encontraron directorios backend/tests en el
  repositorio original ni en el clon.

Frontend:
- Node.js: 24.20.0.
- npm: 11.19.0.
- Servidor Vite en puerto 5174: HTTP 200.
- Scripts disponibles: dev, build, lint y preview.
- Dependencias node_modules presentes en el clon.
- No se encontraron archivos de prueba con los
  patrones examinados durante la auditoria.
- Oxlint: 0 advertencias y 0 errores.
- Oxlint analizo 8 archivos con 104 reglas.
- Duracion informada por Oxlint: 1.6 segundos.
- Vite: compilacion de produccion aprobada.
- Modulos transformados: 595.
- Duracion informada por Vite: 4.20 segundos.
- Archivo dist/index.html generado correctamente.

Observacion de rendimiento:
- El paquete JavaScript principal generado fue de
  aproximadamente 684.96 kB antes de compresion.
- Vite advirtio que algunos paquetes superan 500 kB.
- La advertencia no impidio generar la compilacion.
- Se recomienda evaluar division de codigo en una
  etapa posterior, sin modificar el alcance actual.

Estas pruebas se ejecutaron sobre el clon aislado.
La compilacion no demuestra por si sola que todos
los flujos funcionales de la aplicacion esten cubiertos.
## 7. Duraciones

No se registraron mediciones verificables del tiempo
total de instalacion ni de cada etapa de configuracion
del entorno, PostgreSQL, backend y frontend.

Sin embargo, las herramientas de validacion informaron
los siguientes tiempos durante el paso 150:

- Analisis estatico con Oxlint: 1.6 segundos.
- Compilacion de produccion con Vite: 4.20 segundos.

Estas mediciones corresponden exclusivamente a la
ejecucion de dichas herramientas en el clon aislado.
No representan el tiempo total de instalacion del
proyecto ni incluyen las pruebas funcionales.

No se asignan duraciones estimadas a actividades
que no fueron medidas.

## 8. Limitaciones y pendientes

- La instalacion se verifico sobre un clon inicialmente
  limpio, al que posteriormente se aplicaron correcciones.
- No se ha repetido todavia todo el procedimiento desde
  cero con el conjunto definitivo de correcciones.
- La prueba transaccional valida la carga de datos de
  ejemplo, pero no sustituye las pruebas funcionales
  completas de todos los modulos.
- Falta revisar el estado final de los cambios, ejecutar
  las verificaciones finales y registrar el commit.
- Los archivos de credenciales deben permanecer fuera
  del control de versiones.

## 9. Archivos corregidos

- README.md: instrucciones y configuracion de instalacion.
- backend/main.py: configuracion de CORS y carga de .env.
- database/data.sql: fechas relativas e indicadores
  calculados desde los datos de ejemplo.

Este documento registra las evidencias de la Revision 7.

## 10. Conclusion tecnica

La revision permitio identificar y corregir problemas
reales de configuracion que afectaban la instalacion
independiente del dashboard.

Se comprobo el funcionamiento conjunto del frontend,
el backend, la autenticacion y la comunicacion CORS.

Tambien se valido la ejecucion de los datos de ejemplo
y la coherencia de los tres indicadores iniciales.

La transaccion de pruebas finalizo con ROLLBACK,
sin conservar registros de ejemplo.

Los resultados respaldan las correcciones realizadas,
aunque la reproduccion completa desde cero con los
cambios definitivos sigue pendiente de comprobacion.