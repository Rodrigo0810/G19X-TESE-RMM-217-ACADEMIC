import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { calcularMetricas } from '../utils/metricas.js'

export default function Dashboard({
  obligaciones,
  auditorias,
  controles,
  riesgos,
  alertas,
  departamentos,
  normativas,
  filtroDepartamento,
  filtroNormativa,
  setFiltroDepartamento,
  setFiltroNormativa,
  fechaReferencia
}) {
const {
  obligacionesFiltradas,
  cumplimientoPorDepartamento,
  obligacionesVencidasLista,
  obligacionesProximasAVencer,
  obligacionesPendientes,
  obligacionesEnProgreso,
  obligacionesCumplidas,
  obligacionesVencidas,
  auditoriasFiltradas,
  controlesFiltrados,
  riesgosFiltrados,
  alertasFiltradas,
  riesgosBajos,
  riesgosMedios,
  riesgosAltos,
  riesgosCriticos,
  riesgosImportantes,
  alertasPendientes,
  alertasAtendidas,
  alertasDescartadas,
  porcentajeCumplimiento,
  auditoriasProgramadas,
  auditoriasEnProgreso,
  auditoriasCompletadas,
  auditoriasCanceladas,
  controlesPendientes,
  controlesEnProgreso,
  controlesImplementados,
  controlesFallidos,
  totalIncidenciasCriticas,
  datosObligaciones,
  coloresObligaciones,
  datosRiesgos,
  coloresRiesgos,
  datosAuditorias,
  datosControles,
  datosAlertas
} = calcularMetricas({
  obligaciones,
  auditorias,
  controles,
  riesgos,
  alertas,
  departamentos,
  filtroDepartamento,
  filtroNormativa,
  fechaReferencia
})


return (
  <>

<div className="card">
  <h2>Filtros del Dashboard Ejecutivo</h2>
<div className="filtros-dashboard">
  <label>
    Departamento
  <select
    value={filtroDepartamento}
    onChange={(e) => setFiltroDepartamento(e.target.value)}
>
  <option value="">Todos los departamentos</option>
{departamentos.map((departamento) => (
  <option key={departamento.id} value={departamento.id}>
{departamento.nombre}
  </option>
))}
  </select>
  </label>
  <label>
    Normativa
  <select
    value={filtroNormativa}
    onChange={(e) => setFiltroNormativa(e.target.value)}
>
  <option value="">Todas las normativas</option>
{normativas.map((normativa) => (
  <option key={normativa.id} value={normativa.id}>
{normativa.nombre}
  </option>
))}
  </select>
  </label>
  <button
  type="button"
  className="btn-limpiar-filtros"
  onClick={() => {
    setFiltroDepartamento('')
    setFiltroNormativa('')
  }}
>
  <span></span> Limpiar filtros
</button>
</div>
  <p>
    Obligaciones encontradas: {obligacionesFiltradas.length}
  </p>
</div>
<div className="card">
  <h2>Cumplimiento por departamento</h2>
<div className="estados-grid">
{cumplimientoPorDepartamento.map((departamento) => (
<div className="estado-item" key={departamento.id}>
  <span>{departamento.nombre}</span>
  <strong>
{departamento.porcentaje === null
      ? 'Sin obligaciones'
    : `${departamento.porcentaje}%`}
  </strong>
  <small>
{departamento.cumplidas} de {departamento.total} cumplidas
  </small>
</div>
))}
</div>
</div>
<div className="metricas-grid">
<div className="card">
  <h2>Total de obligaciones</h2>
  <p className="total">{obligacionesFiltradas.length}</p>
</div>
<div className="card">
  <h2>Total de auditorías</h2>
  <p className="total">{auditoriasFiltradas.length}</p>
</div>
<div className="card">
  <h2>Total de controles</h2>
  <p className="total">{controlesFiltrados.length}</p>
</div>
<div className="card">
  <h2>Total de riesgos</h2>
  <p className="total">{riesgosFiltrados.length}</p>
</div>
<div className="card">
  <h2>Total de alertas</h2>
  <p className="total">{alertasFiltradas.length}</p>
</div>
<div className="card">
  <h2>Cumplimiento</h2>
  <p className="total">{porcentajeCumplimiento}%</p>
<div className="barra-cumplimiento">
<div
    className="barra-cumplimiento-progreso"
    style={{ width: `${porcentajeCumplimiento}%` }}
></div>
</div>
</div>

<div className="card card-critica">
  <h2>Incidencias críticas</h2>
  <p className="total">{totalIncidenciasCriticas}</p>
</div>
</div>
<div className="card">
  <h2>Estado de obligaciones</h2>
<div className="estados-grid">
<div className="estado-item">
  <span>Pendientes</span>
  <strong>{obligacionesPendientes}</strong>
</div>
<div className="estado-item">
  <span>En progreso</span>
  <strong>{obligacionesEnProgreso}</strong>
</div>
<div className="estado-item">
  <span>Cumplidas</span>
  <strong>{obligacionesCumplidas}</strong>
</div>
<div className="estado-item">
  <span>Vencidas</span>
  <strong>{obligacionesVencidas}</strong>
</div>
</div>
</div>

<div className="graficas-grid">
<div className="card">
  <h2>Distribución de obligaciones</h2>
<div style={{ width: '100%', height: 300 }}>
  <ResponsiveContainer>
  <PieChart>
  <Pie
    data={datosObligaciones}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={100}
    label={({ name, value }) => `${name}: ${value}`}
>
    {datosObligaciones.map((entrada, index) => (
    <Cell
    key={`cell-${index}`}
    fill={coloresObligaciones[index]}
/>
))}
  </Pie>
  <Tooltip />
  <Legend />
  </PieChart>
  </ResponsiveContainer>
</div>
</div>
<div className="card">
  <h2>Distribución de auditorías</h2>
<div style={{ width: '100%', height: 300 }}>
  <ResponsiveContainer>
  <BarChart data={datosAuditorias}>
  <XAxis dataKey="name" />
  <YAxis allowDecimals={false} />
  <Tooltip />
  <Legend />
  <Bar
    dataKey="value"
    name="Auditorías"
    fill="#3b82f6"
/>
  </BarChart>
  </ResponsiveContainer>
</div>
</div>
</div>

<div className="card">
  <h2>Estado de auditorías</h2>
<div className="estados-grid">
<div className="estado-item">
  <span>Programadas</span>
  <strong>{auditoriasProgramadas}</strong>
</div>
<div className="estado-item">
  <span>En progreso</span>
  <strong>{auditoriasEnProgreso}</strong>
</div>
<div className="estado-item">
  <span>Completadas</span>
  <strong>{auditoriasCompletadas}</strong>
</div>
<div className="estado-item">
  <span>Canceladas</span>
  <strong>{auditoriasCanceladas}</strong>
</div>
</div>
</div>

<div className="card">
  <h2>Estado de controles</h2>
<div className="estados-grid">
<div className="estado-item">
  <span>Pendientes</span>
  <strong>{controlesPendientes}</strong>
</div>
<div className="estado-item">
  <span>En progreso</span>
  <strong>{controlesEnProgreso}</strong>
</div>
<div className="estado-item">
  <span>Implementados</span>
  <strong>{controlesImplementados}</strong>
</div>
<div className="estado-item">
  <span>Fallidos</span>
  <strong>{controlesFallidos}</strong>
</div>
</div>
</div>

<div className="graficas-grid">
<div className="card">
  <h2>Distribución de controles</h2>
<div style={{ width: '100%', height: 300 }}>
  <ResponsiveContainer>
  <BarChart data={datosControles}>
  <XAxis dataKey="name" />
  <YAxis allowDecimals={false} />
  <Tooltip />
  <Legend />
  <Bar
    dataKey="value"
    name="Controles"
    fill="#22c55e"
/>
  </BarChart>
  </ResponsiveContainer>
</div>
</div>
<div className="card">
    <h2>Distribución de riesgos</h2>
  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer>
    <PieChart>
    <Pie
      data={datosRiesgos}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label={({ name, value }) => `${name}: ${value}`}
>
{datosRiesgos.map((entrada, index) => (
    <Cell
    key={`riesgo-${index}`}
    fill={coloresRiesgos[index]}
/>
))}
  </Pie>
  <Tooltip />
  <Legend />
  </PieChart>
  </ResponsiveContainer>
</div>
</div>
</div>
<div className="card">
  <h2>Niveles de riesgo</h2>
<div className="estados-grid">
<div className="estado-item">
  <span>Bajo</span>
  <strong>{riesgosBajos}</strong>
</div>
<div className="estado-item">
  <span>Medio</span>
  <strong>{riesgosMedios}</strong>
</div>
<div className="estado-item">
  <span>Alto</span>
  <strong>{riesgosAltos}</strong>
</div>
<div className="estado-item">
  <span>Crítico</span>
  <strong>{riesgosCriticos}</strong>
</div>
</div>
</div>
<div className="card">
  <h2>Estado de alertas</h2>
<div className="estados-grid">
<div className="estado-item">
  <span>Pendientes</span>
  <strong>{alertasPendientes}</strong>
</div>
<div className="estado-item">
  <span>Atendidas</span>
  <strong>{alertasAtendidas}</strong>
</div>
<div className="estado-item">
  <span>Descartadas</span>
  <strong>{alertasDescartadas}</strong>
</div>
</div>
</div>
<div className="card">
  <h2>Distribución de alertas</h2>
<div style={{ width: '100%', height: 300 }}>
  <ResponsiveContainer>
  <BarChart data={datosAlertas}>
  <XAxis dataKey="name" />
  <YAxis allowDecimals={false} />
  <Tooltip />
  <Legend />
  <Bar
    dataKey="value"
    name="Alertas"
    fill="#f59e0b"
/>
  </BarChart>
  </ResponsiveContainer>
</div>
</div>
{riesgosImportantes > 0 && (
<div className="alerta-ejecutiva">
  <strong>⚠ Atención requerida</strong>
  <p>
    Se detectaron {riesgosImportantes} riesgo(s) de nivel Alto o Crítico
    que requieren revisión.
  </p>
</div>
)}
{obligacionesVencidasLista.length > 0 && (
<div className="alerta-ejecutiva">
  <strong>⚠ Obligaciones vencidas</strong>
  <p>
    Se detectaron {obligacionesVencidasLista.length} obligación(es)
    clasificadas como vencidas por estado o por fecha límite.
  </p>
  <ul>
{obligacionesVencidasLista.map((obligacion) => (
  <li key={obligacion.id}>
{obligacion.nombre} — Fecha límite: {obligacion.fecha_limite ? String(obligacion.fecha_limite).slice(0, 10) : 'Sin fecha asignada'}
  </li>
))}
  </ul>
</div>
)}
{obligacionesProximasAVencer.length > 0 && (
<div className="alerta-ejecutiva">
  <strong>⚠ Obligaciones próximas a vencer</strong>
  <p>
    Se detectaron {obligacionesProximasAVencer.length} obligación(es)
    que vencen durante los próximos 7 días.
  </p>
  <ul>
{obligacionesProximasAVencer.map((obligacion) => (
  <li key={obligacion.id}>
{obligacion.nombre} — Fecha límite: {obligacion.fecha_limite ? String(obligacion.fecha_limite).slice(0, 10) : 'Sin fecha asignada'}
  </li>
))}
  </ul>
</div>
)}
<div className="card">
  <h2>Obligaciones registradas</h2>
  <ul className="obligaciones-lista">
{obligacionesFiltradas.map((obligacion) => (
  <li key={obligacion.id}>
  <strong>{obligacion.nombre}</strong>
  <span className={`estado-badge estado-${obligacion.estado.toLowerCase().replace(' ', '-')}`}>
{obligacion.estado}
  </span>
  <small>
    {obligacion.fecha_limite
      ? `Vence: ${String(obligacion.fecha_limite).slice(0, 10)}`
      : 'Sin fecha asignada'}
  </small>
  </li>
))}
  </ul>
</div>

  </>
)
}