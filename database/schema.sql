--1 Departamentos
CREATE TABLE IF NOT EXISTS departamentos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--2 Roles
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);

-- 3 Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    entra_id VARCHAR(255) UNIQUE,
    rol_id INTEGER REFERENCES roles(id),
    departamento_id INTEGER REFERENCES departamentos(id),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--4 Normativas
CREATE TABLE IF NOT EXISTS normativas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    organismo_emisor VARCHAR(200),
    hipervinculo TEXT,
    fecha_publicacion DATE,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--5 Obligaciones
CREATE TABLE IF NOT EXISTS obligaciones (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    normativa_id INTEGER REFERENCES normativas(id),
    departamento_id INTEGER REFERENCES departamentos(id),
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    responsable VARCHAR(150),
    fecha_limite DATE,
    estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente'
        CHECK (estado IN ('Pendiente', 'En progreso', 'Cumplida', 'Vencida')),
    nivel_riesgo VARCHAR(30)
        CHECK (nivel_riesgo IN ('Bajo', 'Medio', 'Alto', 'Critico')),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--6 Auditorias
CREATE TABLE IF NOT EXISTS auditorias (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    departamento_id INTEGER REFERENCES departamentos(id),
    fecha_inicio DATE,
    fecha_fin DATE,
    estado VARCHAR(30) NOT NULL DEFAULT 'Programada'
        CHECK (estado IN ('Programada', 'En progreso', 'Completada', 'Cancelada')),
    resultado VARCHAR(100),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (fecha_fin IS NULL OR fecha_inicio IS NULL OR fecha_fin >= fecha_inicio)
);

--7 Controles internos
CREATE TABLE IF NOT EXISTS controles (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    obligacion_id INTEGER REFERENCES obligaciones(id),
    departamento_id INTEGER REFERENCES departamentos(id),
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    responsable VARCHAR(150),
    estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente'
        CHECK (estado IN ('Pendiente', 'En progreso', 'Implementado', 'Fallido')),
    nivel_riesgo VARCHAR(30)
        CHECK (nivel_riesgo IN ('Bajo', 'Medio', 'Alto', 'Critico')),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--8 Evidencias documentales
CREATE TABLE IF NOT EXISTS evidencias (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    obligacion_id INTEGER REFERENCES obligaciones(id),
    auditoria_id INTEGER REFERENCES auditorias(id),
    control_id INTEGER REFERENCES controles(id),
    nombre VARCHAR(200) NOT NULL,
    tipo VARCHAR(100),
    ubicacion TEXT,
    descripcion TEXT,
    fecha_documento DATE,
    estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente'
        CHECK (estado IN ('Pendiente', 'Validada', 'Rechazada')),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        obligacion_id IS NOT NULL
        OR auditoria_id IS NOT NULL
        OR control_id IS NOT NULL
    )
);

--9 Riesgos
CREATE TABLE IF NOT EXISTS riesgos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    obligacion_id INTEGER REFERENCES obligaciones(id),
    auditoria_id INTEGER REFERENCES auditorias(id),
    control_id INTEGER REFERENCES controles(id),
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    nivel VARCHAR(30) NOT NULL
        CHECK (nivel IN ('Bajo', 'Medio', 'Alto', 'Critico')),
    probabilidad INTEGER CHECK (probabilidad BETWEEN 1 AND 5),
    impacto INTEGER CHECK (impacto BETWEEN 1 AND 5),
    estado VARCHAR(30) NOT NULL DEFAULT 'Abierto'
        CHECK (estado IN ('Abierto', 'En tratamiento', 'Mitigado', 'Cerrado')),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--10 Indicadores KPI
CREATE TABLE IF NOT EXISTS indicadores (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    valor NUMERIC(12,2),
    unidad VARCHAR(50),
    periodo_inicio DATE,
    periodo_fin DATE,
    fecha_calculo TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        periodo_fin IS NULL
        OR periodo_inicio IS NULL
        OR periodo_fin >= periodo_inicio
    )
);

--11 Alertas
CREATE TABLE IF NOT EXISTS alertas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    obligacion_id INTEGER REFERENCES obligaciones(id),
    riesgo_id INTEGER REFERENCES riesgos(id),
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    nivel VARCHAR(30) NOT NULL DEFAULT 'Medio'
        CHECK (nivel IN ('Bajo', 'Medio', 'Alto', 'Critico')),
    estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente'
        CHECK (estado IN ('Pendiente', 'Atendida', 'Descartada')),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Roles iniciales del sistema
INSERT INTO roles (nombre, descripcion)
VALUES
    ('Directivo', 'Consulta de indicadores y reportes ejecutivos'),
    ('Compliance', 'Seguimiento de obligaciones, controles y riesgos'),
    ('Auditor', 'Consulta de auditorias y evidencias'),
    ('Administrador', 'Administracion y configuracion del sistema')
ON CONFLICT (nombre) DO NOTHING;

-- Indices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_obligaciones_estado
    ON obligaciones(estado);

CREATE INDEX IF NOT EXISTS idx_obligaciones_fecha_limite
    ON obligaciones(fecha_limite);

CREATE INDEX IF NOT EXISTS idx_auditorias_estado
    ON auditorias(estado);

CREATE INDEX IF NOT EXISTS idx_riesgos_nivel
    ON riesgos(nivel);

CREATE INDEX IF NOT EXISTS idx_alertas_estado
    ON alertas(estado);