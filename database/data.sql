--1 Departamentos
INSERT INTO departamentos (nombre, descripcion)
VALUES
    ('Legal', 'Gestion de asuntos normativos'),
    ('Finanzas', 'Gestion financiera'),
    ('Tecnologia', 'Gestion de sistemas y tecnologia')
ON CONFLICT (nombre) DO NOTHING;


--2 Normativas de ejemplo
INSERT INTO normativas
    (nombre, tipo, descripcion, organismo_emisor, hipervinculo)
SELECT
    'Politica interna de seguridad',
    'Interna',
    'Politica de seguridad de informacion de ejemplo',
    'Organizacion',
    'https://example.com/politica'
WHERE NOT EXISTS (
    SELECT 1 FROM normativas
    WHERE nombre = 'Politica interna de seguridad'
);

INSERT INTO normativas
    (nombre, tipo, descripcion, organismo_emisor, hipervinculo)
SELECT
    'Procedimiento de auditoria interna',
    'Interna',
    'Procedimiento de auditoria de ejemplo',
    'Organizacion',
    'https://example.com/auditoria'
WHERE NOT EXISTS (
    SELECT 1 FROM normativas
    WHERE nombre = 'Procedimiento de auditoria interna'
);


--3 Obligaciones
INSERT INTO obligaciones
    (normativa_id, departamento_id, nombre, descripcion,
     responsable, fecha_limite, estado, nivel_riesgo)
SELECT
    n.id,
    d.id,
    'Revision documental anual',
    'Revisar la documentacion normativa de ejemplo',
    'Responsable Legal',
    '2026-10-15',
    'Pendiente',
    'Medio'
FROM normativas n, departamentos d
WHERE n.nombre = 'Politica interna de seguridad'
  AND d.nombre = 'Legal'
  AND NOT EXISTS (
      SELECT 1 FROM obligaciones
      WHERE nombre = 'Revision documental anual'
  );

INSERT INTO obligaciones
    (normativa_id, departamento_id, nombre, descripcion,
     responsable, fecha_limite, estado, nivel_riesgo)
SELECT
    n.id,
    d.id,
    'Validacion de controles financieros',
    'Verificar los controles internos financieros',
    'Responsable Finanzas',
    '2026-10-20',
    'En progreso',
    'Alto'
FROM normativas n, departamentos d
WHERE n.nombre = 'Procedimiento de auditoria interna'
  AND d.nombre = 'Finanzas'
  AND NOT EXISTS (
      SELECT 1 FROM obligaciones
      WHERE nombre = 'Validacion de controles financieros'
  );

INSERT INTO obligaciones
    (normativa_id, departamento_id, nombre, descripcion,
     responsable, fecha_limite, estado, nivel_riesgo)
SELECT
    n.id,
    d.id,
    'Actualizacion de accesos',
    'Verificar los permisos de acceso de los sistemas',
    'Responsable Tecnologia',
    '2026-09-15',
    'Vencida',
    'Critico'
FROM normativas n, departamentos d
WHERE n.nombre = 'Politica interna de seguridad'
  AND d.nombre = 'Tecnologia'
  AND NOT EXISTS (
      SELECT 1 FROM obligaciones
      WHERE nombre = 'Actualizacion de accesos'
  );


--4 Auditorias
INSERT INTO auditorias
    (nombre, descripcion, departamento_id,
     fecha_inicio, fecha_fin, estado, resultado)
SELECT
    'Auditoria interna de tecnologia',
    'Revision de controles de acceso de ejemplo',
    d.id,
    '2026-09-01',
    '2026-09-10',
    'Completada',
    'Hallazgos identificados'
FROM departamentos d
WHERE d.nombre = 'Tecnologia'
  AND NOT EXISTS (
      SELECT 1 FROM auditorias
      WHERE nombre = 'Auditoria interna de tecnologia'
  );

INSERT INTO auditorias
    (nombre, descripcion, departamento_id,
     fecha_inicio, fecha_fin, estado)
SELECT
    'Auditoria financiera',
    'Revision de procesos financieros de ejemplo',
    d.id,
    '2026-10-05',
    '2026-10-12',
    'Programada'
FROM departamentos d
WHERE d.nombre = 'Finanzas'
  AND NOT EXISTS (
      SELECT 1 FROM auditorias
      WHERE nombre = 'Auditoria financiera'
  );


--5 Controles internos
INSERT INTO controles
    (obligacion_id, departamento_id, nombre,
     descripcion, responsable, estado, nivel_riesgo)
SELECT
    o.id,
    o.departamento_id,
    'Control de revision documental',
    'Verificacion de documentos requeridos',
    'Responsable Legal',
    'En progreso',
    'Medio'
FROM obligaciones o
WHERE o.nombre = 'Revision documental anual'
  AND NOT EXISTS (
      SELECT 1 FROM controles
      WHERE nombre = 'Control de revision documental'
  );

INSERT INTO controles
    (obligacion_id, departamento_id, nombre,
     descripcion, responsable, estado, nivel_riesgo)
SELECT
    o.id,
    o.departamento_id,
    'Control de accesos',
    'Revision de permisos de usuarios',
    'Responsable Tecnologia',
    'Fallido',
    'Critico'
FROM obligaciones o
WHERE o.nombre = 'Actualizacion de accesos'
  AND NOT EXISTS (
      SELECT 1 FROM controles
      WHERE nombre = 'Control de accesos'
  );


--6 Evidencias documentales
INSERT INTO evidencias
    (obligacion_id, control_id, nombre, tipo,
     ubicacion, descripcion, fecha_documento, estado)
SELECT
    o.id,
    c.id,
    'Informe de revision documental',
    'PDF',
    'documentos/informe_revision.pdf',
    'Evidencia ficticia para pruebas',
    '2026-09-10',
    'Validada'
FROM obligaciones o
JOIN controles c ON c.obligacion_id = o.id
WHERE o.nombre = 'Revision documental anual'
  AND c.nombre = 'Control de revision documental'
  AND NOT EXISTS (
      SELECT 1 FROM evidencias
      WHERE nombre = 'Informe de revision documental'
  );

INSERT INTO evidencias
    (obligacion_id, control_id, nombre, tipo,
     ubicacion, descripcion, fecha_documento, estado)
SELECT
    o.id,
    c.id,
    'Registro de accesos',
    'CSV',
    'documentos/registro_accesos.csv',
    'Registro ficticio para pruebas',
    '2026-09-12',
    'Pendiente'
FROM obligaciones o
JOIN controles c ON c.obligacion_id = o.id
WHERE o.nombre = 'Actualizacion de accesos'
  AND c.nombre = 'Control de accesos'
  AND NOT EXISTS (
      SELECT 1 FROM evidencias
      WHERE nombre = 'Registro de accesos'
  );


--7 Riesgos
INSERT INTO riesgos
    (obligacion_id, control_id, nombre, descripcion,
     nivel, probabilidad, impacto, estado)
SELECT
    o.id,
    c.id,
    'Accesos sin validar',
    'Riesgo de permisos no revisados',
    'Critico',
    5,
    5,
    'Abierto'
FROM obligaciones o
JOIN controles c ON c.obligacion_id = o.id
WHERE o.nombre = 'Actualizacion de accesos'
  AND c.nombre = 'Control de accesos'
  AND NOT EXISTS (
      SELECT 1 FROM riesgos
      WHERE nombre = 'Accesos sin validar'
  );

INSERT INTO riesgos
    (obligacion_id, nombre, descripcion,
     nivel, probabilidad, impacto, estado)
SELECT
    o.id,
    'Retraso documental',
    'Posible retraso en la revision de documentos',
    'Medio',
    3,
    3,
    'En tratamiento'
FROM obligaciones o
WHERE o.nombre = 'Revision documental anual'
  AND NOT EXISTS (
      SELECT 1 FROM riesgos
      WHERE nombre = 'Retraso documental'
  );


-- 8. Indicadores KPI de ejemplo
INSERT INTO indicadores
    (nombre, descripcion, categoria, valor, unidad,
     periodo_inicio, periodo_fin)
SELECT
    'Cumplimiento general',
    'Porcentaje de obligaciones cumplidas en el conjunto de prueba',
    'Cumplimiento',
    33.33,
    '%',
    '2026-09-01',
    '2026-09-30'
WHERE NOT EXISTS (
    SELECT 1 FROM indicadores
    WHERE nombre = 'Cumplimiento general'
);

INSERT INTO indicadores
    (nombre, descripcion, categoria, valor, unidad,
     periodo_inicio, periodo_fin)
SELECT
    'Obligaciones vencidas',
    'Cantidad de obligaciones vencidas en los datos de prueba',
    'Obligaciones',
    1,
    'Cantidad',
    '2026-09-01',
    '2026-09-30'
WHERE NOT EXISTS (
    SELECT 1 FROM indicadores
    WHERE nombre = 'Obligaciones vencidas'
);

INSERT INTO indicadores
    (nombre, descripcion, categoria, valor, unidad,
     periodo_inicio, periodo_fin)
SELECT
    'Riesgos criticos',
    'Cantidad de riesgos criticos en los datos de prueba',
    'Riesgos',
    1,
    'Cantidad',
    '2026-09-01',
    '2026-09-30'
WHERE NOT EXISTS (
    SELECT 1 FROM indicadores
    WHERE nombre = 'Riesgos criticos'
);


--9 Alertas
INSERT INTO alertas
    (obligacion_id, riesgo_id, titulo, mensaje, nivel, estado)
SELECT
    o.id,
    r.id,
    'Accesos pendientes de validacion',
    'Se requiere revisar los accesos del sistema',
    'Critico',
    'Pendiente'
FROM obligaciones o
JOIN riesgos r ON r.obligacion_id = o.id
WHERE o.nombre = 'Actualizacion de accesos'
  AND r.nombre = 'Accesos sin validar'
  AND NOT EXISTS (
      SELECT 1 FROM alertas
      WHERE titulo = 'Accesos pendientes de validacion'
  );
