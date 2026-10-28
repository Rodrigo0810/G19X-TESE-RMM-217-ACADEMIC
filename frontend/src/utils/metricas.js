/**
 * Calcula los indicadores del dashboard de cumplimiento normativo.
 *
 * Recibe datos y filtros sin acceder a React, APIs o estado global.
 * La fecha se recibe como parametro para facilitar las pruebas.
 */
export function calcularMetricas({
  obligaciones = [],
  auditorias = [],
  controles = [],
  riesgos = [],
  alertas = [],
  departamentos = [],
  filtroDepartamento = '',
  filtroNormativa = '',
  fechaReferencia
}) {
const obligacionesFiltradas = obligaciones.filter((obligacion) => {
  const coincideDepartamento = filtroDepartamento === '' ||
    String(obligacion.departamento_id) === filtroDepartamento
  const coincideNormativa = filtroNormativa === '' ||
    String(obligacion.normativa_id) === filtroNormativa
  return coincideDepartamento && coincideNormativa
})
const cumplimientoPorDepartamento = departamentos
  .filter((departamento) => filtroDepartamento === '' || String(departamento.id) === filtroDepartamento)
  .map((departamento) => {
    const obligacionesDepartamento = obligacionesFiltradas.filter(
      (obligacion) => obligacion.departamento_id != null &&
        String(obligacion.departamento_id) === String(departamento.id)
    )
    const total = obligacionesDepartamento.length
    const cumplidas = obligacionesDepartamento.filter(
      (obligacion) => obligacion.estado === 'Cumplida'
    ).length
    return {
      id: departamento.id,
      nombre: departamento.nombre,
      total,
      cumplidas,
      porcentaje: total > 0 ? Math.round((cumplidas / total) * 100) : null
    }
  })
const hoy = new Date(fechaReferencia)
hoy.setHours(0, 0, 0, 0)
const limiteProximos7Dias = new Date(hoy)
limiteProximos7Dias.setDate(limiteProximos7Dias.getDate() + 7)
const obtenerFechaLimite = (obligacion) => {
  if (!obligacion.fecha_limite) return null
const fechaTexto = String(obligacion.fecha_limite).slice(0, 10)
const partes = fechaTexto.split('-').map(Number)
  if (partes.length !== 3 || partes.some(Number.isNaN)) {
  return null
  }
const [anio, mes, dia] = partes
const fecha = new Date(anio, mes - 1, dia)
  if (
    fecha.getFullYear() !== anio ||
    fecha.getMonth() !== mes - 1 ||
    fecha.getDate() !== dia
  ) {
  return null
  }
  return fecha
}
const estaVencida = (obligacion) => {
  if (obligacion.estado === 'Vencida') return true
  if (obligacion.estado === 'Cumplida') return false

  const fecha = obtenerFechaLimite(obligacion)
  return fecha !== null && fecha < hoy
}
const obligacionesVencidasLista = obligacionesFiltradas.filter(estaVencida)
const obligacionesProximasAVencer = obligacionesFiltradas.filter(
  (obligacion) => {
const fecha = obtenerFechaLimite(obligacion)
  return (
      fecha !== null &&
      fecha >= hoy &&
      fecha <= limiteProximos7Dias &&
      !estaVencida(obligacion)
    )
  }
)
const obligacionesPendientes = obligacionesFiltradas.filter(
  (obligacion) => obligacion.estado === 'Pendiente' && !estaVencida(obligacion)
).length
const obligacionesEnProgreso = obligacionesFiltradas.filter(
  (obligacion) => obligacion.estado === 'En progreso' && !estaVencida(obligacion)
).length
const obligacionesCumplidas = obligacionesFiltradas.filter(
  (obligacion) => obligacion.estado === 'Cumplida' && !estaVencida(obligacion)
).length
const obligacionesVencidas = obligacionesVencidasLista.length
// Filtrado conservador: cada relación explícita debe ser compatible con el filtro.
// Un registro sin relaciones verificables no se atribuye a una selección.
const hayFiltrosDashboard = filtroDepartamento !== '' || filtroNormativa !== ''
const obligacionesPorId = new Map(obligaciones.map((item) => [String(item.id), item]))
const auditoriasPorId = new Map(auditorias.map((item) => [String(item.id), item]))
const controlesPorId = new Map(controles.map((item) => [String(item.id), item]))
const riesgosPorId = new Map(riesgos.map((item) => [String(item.id), item]))
const coincideObligacion = (obligacion) => Boolean(obligacion) &&
  (filtroDepartamento === '' || String(obligacion.departamento_id) === filtroDepartamento) &&
  (filtroNormativa === '' || String(obligacion.normativa_id) === filtroNormativa)
const coincideAuditoria = (auditoria) => Boolean(auditoria) &&
  filtroNormativa === '' &&
  (filtroDepartamento === '' || String(auditoria.departamento_id) === filtroDepartamento)
const coincideControl = (control) => {
  if (!control) return false
  const obligacion = control.obligacion_id == null
    ? null : obligacionesPorId.get(String(control.obligacion_id))
  if (control.obligacion_id != null && !coincideObligacion(obligacion)) return false
  if (filtroDepartamento !== '') {
    if (control.departamento_id != null && String(control.departamento_id) !== filtroDepartamento) return false
    if (control.departamento_id == null && !obligacion) return false
  }
  if (filtroNormativa !== '' && !obligacion) return false
  return true
}
const coincideRiesgo = (riesgo) => {
  if (!riesgo) return false
  const relaciones = [
    riesgo.obligacion_id != null ? coincideObligacion(obligacionesPorId.get(String(riesgo.obligacion_id))) : null,
    riesgo.auditoria_id != null ? coincideAuditoria(auditoriasPorId.get(String(riesgo.auditoria_id))) : null,
    riesgo.control_id != null ? coincideControl(controlesPorId.get(String(riesgo.control_id))) : null
  ].filter((resultado) => resultado !== null)
  return relaciones.length > 0 && relaciones.every(Boolean)
}
const auditoriasFiltradas = auditorias.filter((item) => !hayFiltrosDashboard || coincideAuditoria(item))
const controlesFiltrados = controles.filter((item) => !hayFiltrosDashboard || coincideControl(item))
const riesgosFiltrados = riesgos.filter((item) => !hayFiltrosDashboard || coincideRiesgo(item))
const alertasFiltradas = alertas.filter((alerta) => {
  if (!hayFiltrosDashboard) return true
  const relaciones = [
    alerta.obligacion_id != null ? coincideObligacion(obligacionesPorId.get(String(alerta.obligacion_id))) : null,
    alerta.riesgo_id != null ? coincideRiesgo(riesgosPorId.get(String(alerta.riesgo_id))) : null
  ].filter((resultado) => resultado !== null)
  return relaciones.length > 0 && relaciones.every(Boolean)
})
const riesgosBajos = riesgosFiltrados.filter(
  (riesgo) => riesgo.nivel === 'Bajo'
).length
const riesgosMedios = riesgosFiltrados.filter(
  (riesgo) => riesgo.nivel === 'Medio'
).length
const riesgosAltos = riesgosFiltrados.filter(
  (riesgo) => riesgo.nivel === 'Alto'
).length
const riesgosCriticos = riesgosFiltrados.filter(
  (riesgo) => riesgo.nivel === 'Critico'
).length
const riesgosImportantes = riesgosFiltrados.filter(
  (riesgo) => riesgo.nivel === 'Alto' || riesgo.nivel === 'Critico'
).length
const alertasPendientes = alertasFiltradas.filter(
  (alerta) => alerta.estado === 'Pendiente'
).length
const alertasAtendidas = alertasFiltradas.filter(
  (alerta) => alerta.estado === 'Atendida'
).length
const alertasDescartadas = alertasFiltradas.filter(
  (alerta) => alerta.estado === 'Descartada'
).length
const porcentajeCumplimiento =
  obligacionesFiltradas.length > 0
    ? Math.round(
        (obligacionesCumplidas / obligacionesFiltradas.length) * 100
      )
    : 0
const auditoriasProgramadas = auditoriasFiltradas.filter(
  (auditoria) => auditoria.estado === 'Programada'
).length
const auditoriasEnProgreso = auditoriasFiltradas.filter(
  (auditoria) => auditoria.estado === 'En progreso'
).length
const auditoriasCompletadas = auditoriasFiltradas.filter(
  (auditoria) => auditoria.estado === 'Completada'
).length
const auditoriasCanceladas = auditoriasFiltradas.filter(
  (auditoria) => auditoria.estado === 'Cancelada'
).length
const controlesPendientes = controlesFiltrados.filter(
  (control) => control.estado === 'Pendiente'
).length
const controlesEnProgreso = controlesFiltrados.filter(
  (control) => control.estado === 'En progreso'
).length
const controlesImplementados = controlesFiltrados.filter(
  (control) => control.estado === 'Implementado'
).length
const controlesFallidos = controlesFiltrados.filter(
  (control) => control.estado === 'Fallido'
).length
const riesgosImportantesFiltrados = riesgosFiltrados.filter(
  (riesgo) => riesgo.nivel === 'Alto' || riesgo.nivel === 'Critico'
).length
const alertasPendientesFiltradas = alertasFiltradas.filter(
  (alerta) => alerta.estado === 'Pendiente'
).length
const controlesFallidosFiltrados = controlesFiltrados.filter(
  (control) => control.estado === 'Fallido'
).length
const totalIncidenciasCriticas =
  obligacionesVencidas +
  riesgosImportantesFiltrados +
  alertasPendientesFiltradas +
  controlesFallidosFiltrados
const datosObligaciones = [
  { name: 'Pendientes', value: obligacionesPendientes },
  { name: 'En progreso', value: obligacionesEnProgreso },
  { name: 'Cumplidas', value: obligacionesCumplidas },
  { name: 'Vencidas', value: obligacionesVencidas }
]
const coloresObligaciones = [
  '#f59e0b',
  '#3b82f6',
  '#22c55e',
  '#ef4444'
]
const datosRiesgos = [
  { name: 'Bajo', value: riesgosBajos },
  { name: 'Medio', value: riesgosMedios },
  { name: 'Alto', value: riesgosAltos },
  { name: 'Crítico', value: riesgosCriticos }
]
const coloresRiesgos = [
  '#22c55e',
  '#f59e0b',
  '#f97316',
  '#ef4444'
]
const datosAuditorias = [
  { name: 'Programadas', value: auditoriasProgramadas },
  { name: 'En progreso', value: auditoriasEnProgreso },
  { name: 'Completadas', value: auditoriasCompletadas },
  { name: 'Canceladas', value: auditoriasCanceladas }
]
const datosControles = [
  { name: 'Pendientes', value: controlesPendientes },
  { name: 'En progreso', value: controlesEnProgreso },
  { name: 'Implementados', value: controlesImplementados },
  { name: 'Fallidos', value: controlesFallidos }
]
const datosAlertas = [
  { name: 'Pendientes', value: alertasPendientes },
  { name: 'Atendidas', value: alertasAtendidas },
  { name: 'Descartadas', value: alertasDescartadas }
]

  return {
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
  }
}
