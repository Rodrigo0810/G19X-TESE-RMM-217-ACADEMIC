import { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import './App.css'
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function App() {
const [obligaciones, setObligaciones] = useState([])
const [auditorias, setAuditorias] = useState([])
const [controles, setControles] = useState([])
const [riesgos, setRiesgos] = useState([])
const [alertas, setAlertas] = useState([])
const [normativas, setNormativas] = useState([])
const [usuarios, setUsuarios] = useState([])
const [usuarioEditando, setUsuarioEditando] = useState(null)
const [mostrarFormularioNuevoUsuario, setMostrarFormularioNuevoUsuario] = useState(false)
const [nuevoUsuario, setNuevoUsuario] = useState({
  nombre: '',
  correo: '',
  entra_id: '',
  rol_id: null,
  departamento_id: null,
  activo: true
})
const [roles, setRoles] = useState([])
const [rolEditando, setRolEditando] = useState(null)
const [mostrarFormularioNuevoRol, setMostrarFormularioNuevoRol] = useState(false)
const [nuevoRol, setNuevoRol] = useState({
  nombre: '',
  descripcion: ''
})
const [indicadores, setIndicadores] = useState([])
const [indicadorEditando, setIndicadorEditando] = useState(null)
const [mostrarFormularioNuevoIndicador, setMostrarFormularioNuevoIndicador] = useState(false)
const [nuevoIndicador, setNuevoIndicador] = useState({
  nombre: '',
  descripcion: '',
  categoria: '',
  valor: 0,
  unidad: '',
  periodo_inicio: '',
  periodo_fin: ''
})
const [evidencias, setEvidencias] = useState([])
const [evidenciaEditando, setEvidenciaEditando] = useState(null)
const [mostrarFormularioNuevaEvidencia, setMostrarFormularioNuevaEvidencia] = useState(false)
const [nuevaEvidencia, setNuevaEvidencia] = useState({
  obligacion_id: null,
  auditoria_id: null,
  control_id: null,
  nombre: '',
  tipo: '',
  ubicacion: '',
  descripcion: '',
  fecha_documento: '',
  estado: 'Pendiente'
})
const [departamentos, setDepartamentos] = useState([])
const [departamentoEditando, setDepartamentoEditando] = useState(null)
const [mostrarFormularioNuevoDepartamento, setMostrarFormularioNuevoDepartamento] = useState(false)
const [nuevoDepartamento, setNuevoDepartamento] = useState({
  nombre: '',
  descripcion: '',
  activo: true
})
const [normativaEditando, setNormativaEditando] = useState(null)
const [mostrarFormularioNuevaNormativa, setMostrarFormularioNuevaNormativa] = useState(false)
const [nuevaNormativa, setNuevaNormativa] = useState({
  nombre: '',
  tipo: '',
  descripcion: '',
  organismo_emisor: '',
  hipervinculo: '',
  fecha_publicacion: null,
  activa: true
})
const [vistaActual, setVistaActual] = useState('dashboard')
const [filtroDepartamento, setFiltroDepartamento] = useState('')
const [filtroNormativa, setFiltroNormativa] = useState('')
const [token, setToken] = useState(null)
const [correoLogin, setCorreoLogin] = useState('')
const [contrasenaLogin, setContrasenaLogin] = useState('')
const [errorLogin, setErrorLogin] = useState('')
const encabezadosAuth = token
  ? { Authorization: `Bearer ${token}` }
  : {}
const [obligacionEditando, setObligacionEditando] = useState(null)
const [auditoriaEditando, setAuditoriaEditando] = useState(null)
const [controlEditando, setControlEditando] = useState(null)
const [riesgoEditando, setRiesgoEditando] = useState(null)
const [alertaEditando, setAlertaEditando] = useState(null)
const [mostrarFormularioNuevaAlerta, setMostrarFormularioNuevaAlerta] = useState(false)
const [nuevaAlerta, setNuevaAlerta] = useState({
  titulo: '',
  mensaje: '',
  estado: 'Pendiente'
})
const [mostrarFormularioNuevoRiesgo, setMostrarFormularioNuevoRiesgo] = useState(false)
const [nuevoRiesgo, setNuevoRiesgo] = useState({
  nombre: '',
  nivel: 'Bajo',
  estado: 'Abierto'
})
const [mostrarFormularioNuevoControl, setMostrarFormularioNuevoControl] = useState(false)
const [nuevoControl, setNuevoControl] = useState({
  nombre: '',
  estado: 'Pendiente'
})
const [mostrarFormularioNuevaAuditoria, setMostrarFormularioNuevaAuditoria] = useState(false)
const [nuevaAuditoria, setNuevaAuditoria] = useState({
  nombre: '',
  estado: 'Programada'
})
const [mostrarFormularioNuevo, setMostrarFormularioNuevo] = useState(false)
const [nuevaObligacion, setNuevaObligacion] = useState({
nombre: '',
estado: 'Pendiente'
})
const cumplimientoPorDepartamento = departamentos.map((departamento) => {
  const obligacionesDepartamento = obligaciones.filter(
    (obligacion) =>
      Number(obligacion.departamento_id) === Number(departamento.id)
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
    porcentaje: total > 0
      ? Math.round((cumplidas / total) * 100)
      : null
  }
})
const obligacionesFiltradas = obligaciones.filter((obligacion) => {
const coincideDepartamento =
    filtroDepartamento === '' ||
    String(obligacion.departamento_id) === filtroDepartamento
const coincideNormativa =
    filtroNormativa === '' ||
    String(obligacion.normativa_id) === filtroNormativa
  return coincideDepartamento && coincideNormativa
})
const hoy = new Date()
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
const obligacionesVencidasPorFecha = obligacionesFiltradas.filter(
  (obligacion) => {
const fecha = obtenerFechaLimite(obligacion)
    return (
      fecha !== null &&
      fecha < hoy &&
      obligacion.estado !== 'Cumplida'
    )
  }
)
const obligacionesProximasAVencer = obligacionesFiltradas.filter(
  (obligacion) => {
const fecha = obtenerFechaLimite(obligacion)
  return (
      fecha !== null &&
      fecha >= hoy &&
      fecha <= limiteProximos7Dias &&
      obligacion.estado !== 'Cumplida'
    )
  }
)
const obligacionesPendientes = obligacionesFiltradas.filter(
  (obligacion) => obligacion.estado === 'Pendiente'
).length
const obligacionesEnProgreso = obligacionesFiltradas.filter(
  (obligacion) => obligacion.estado === 'En progreso'
).length
const obligacionesCumplidas = obligacionesFiltradas.filter(
  (obligacion) => obligacion.estado === 'Cumplida'
).length
const obligacionesVencidas = obligacionesFiltradas.filter(
  (obligacion) => obligacion.estado === 'Vencida'
).length
const riesgosBajos = riesgos.filter(
  (riesgo) => riesgo.nivel === 'Bajo'
).length
const riesgosMedios = riesgos.filter(
  (riesgo) => riesgo.nivel === 'Medio'
).length
const riesgosAltos = riesgos.filter(
  (riesgo) => riesgo.nivel === 'Alto'
).length
const riesgosCriticos = riesgos.filter(
  (riesgo) => riesgo.nivel === 'Critico'
).length
const riesgosImportantes = riesgos.filter(
  (riesgo) => riesgo.nivel === 'Alto' || riesgo.nivel === 'Critico'
).length
const alertasPendientes = alertas.filter(
  (alerta) => alerta.estado === 'Pendiente'
).length
const alertasAtendidas = alertas.filter(
  (alerta) => alerta.estado === 'Atendida'
).length
const alertasDescartadas = alertas.filter(
  (alerta) => alerta.estado === 'Descartada'
).length
const porcentajeCumplimiento =
  obligacionesFiltradas.length > 0
    ? Math.round(
        (obligacionesCumplidas / obligacionesFiltradas.length) * 100
      )
    : 0
const auditoriasProgramadas = auditorias.filter(
  (auditoria) => auditoria.estado === 'Programada'
).length
const auditoriasEnProgreso = auditorias.filter(
  (auditoria) => auditoria.estado === 'En progreso'
).length
const auditoriasCompletadas = auditorias.filter(
  (auditoria) => auditoria.estado === 'Completada'
).length
const auditoriasCanceladas = auditorias.filter(
  (auditoria) => auditoria.estado === 'Cancelada'
).length
const controlesPendientes = controles.filter(
  (control) => control.estado === 'Pendiente'
).length
const controlesEnProgreso = controles.filter(
  (control) => control.estado === 'En progreso'
).length
const controlesImplementados = controles.filter(
  (control) => control.estado === 'Implementado'
).length
const controlesFallidos = controles.filter(
  (control) => control.estado === 'Fallido'
).length
const totalIncidenciasCriticas =
  obligacionesVencidas +
  riesgosImportantes +
  alertasPendientes +
  controlesFallidos
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

useEffect(() => {
if (!token) return
fetch(`${API_URL}/obligaciones`, {
  headers: encabezadosAuth
})
   .then((response) => response.json())
   .then((data) => {
      setObligaciones(data)
})
   .catch((error) => {
   console.error('Error al obtener obligaciones:', error)
})
fetch(`${API_URL}/auditorias`, {
  headers: encabezadosAuth
})
   .then((response) => response.json())
   .then((data) => {
      setAuditorias(data)
})
   .catch((error) => {
    console.error('Error al obtener auditorias:', error)
})
fetch(`${API_URL}/controles`, {
  headers: encabezadosAuth
})
   .then((response) => response.json())
   .then((data) => {
      setControles(data)
})
   .catch((error) => {
    console.error('Error al obtener controles:', error)
})
fetch(`${API_URL}/riesgos`, {
  headers: encabezadosAuth
})
   .then((response) => response.json())
   .then((data) => {
      setRiesgos(data)
})
   .catch((error) => {
    console.error('Error al obtener riesgos:', error)
})
fetch(`${API_URL}/alertas`, {
  headers: encabezadosAuth
})
   .then((response) => response.json())
   .then((data) => {
      setAlertas(data)
})
   .catch((error) => {
    console.error('Error al obtener alertas:', error)
})
fetch(`${API_URL}/normativas`, {
  headers: encabezadosAuth
})
  .then((response) => {
    if (!response.ok) {
      throw new Error('No se pudieron obtener las normativas')
    }
    return response.json()
  })
  .then((data) => {
    setNormativas(data)
  })
  .catch((error) => {
    console.error('Error al obtener normativas:', error)
  })
fetch(`${API_URL}/indicadores`, {
  headers: encabezadosAuth
})
  .then((respuesta) => {
    if (!respuesta.ok) {
      throw new Error('Error al obtener los indicadores')
    }
    return respuesta.json()
  })
  .then((datos) => {
    setIndicadores(datos)
  })
  .catch((error) => {
    console.error('Error al cargar indicadores:', error)
  })
fetch(`${API_URL}/roles`, {
  headers: encabezadosAuth
})
   .then((respuesta) => {
    if (!respuesta.ok) {
    throw new Error('Error al obtener los roles')
}
    return respuesta.json()
})
    .then((datos) => {
    setRoles(datos)
})
   .catch((error) => {
    console.error('Error al cargar roles:', error)
})
fetch(`${API_URL}/usuarios`, {
  headers: encabezadosAuth
})
  .then((respuesta) => {
    if (!respuesta.ok) {
      throw new Error('Error al obtener usuarios')
    }
    return respuesta.json()
  })
  .then((datos) => {
    setUsuarios(datos)
  })
  .catch((error) => {
    console.error('Error al cargar usuarios:', error)
  })

fetch(`${API_URL}/evidencias`, {
  headers: encabezadosAuth
})
  .then((response) => {
    if (!response.ok) {
      throw new Error('No se pudieron obtener las evidencias')
    }
    return response.json()
  })
  .then((data) => {
    setEvidencias(data)
  })
  .catch((error) => {
    console.error('Error al obtener evidencias:', error)
  })
fetch(`${API_URL}/departamentos`, {
  headers: encabezadosAuth
})
  .then((response) => {
    if (!response.ok) {
      throw new Error('No se pudieron obtener los departamentos')
    }
    return response.json()
  })
  .then((data) => {
    setDepartamentos(data)
  })
  .catch((error) => {
    console.error('Error al obtener departamentos:', error)
  })
}, [token])
const iniciarSesion = async (e) => {
  e.preventDefault()
  setErrorLogin('')
  try {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
},
    body: JSON.stringify({
      correo: correoLogin,
      contrasena: contrasenaLogin
   })
})
  if (!respuesta.ok) {
    setErrorLogin('Correo o contraseña incorrectos')
    return
}
const datos = await respuesta.json()
    setToken(datos.access_token)
    setContrasenaLogin('')
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    setErrorLogin('No se pudo conectar con el servidor')
  }
}
const cerrarSesion = () => {
  setToken(null)
  setCorreoLogin('')
  setContrasenaLogin('')
  setErrorLogin('')
  setVistaActual('dashboard')
}
const eliminarObligacion = async (id) => {
const confirmar = window.confirm(
  '¿Seguro que deseas eliminar esta obligación?'
)
  if (!confirmar) {
    return
}
  try {
const respuesta = await fetch(
  `${API_URL}/obligaciones/${id}`,
  {
    method: 'DELETE',
    headers: encabezadosAuth
  }
)
  if (!respuesta.ok) {
    throw new Error('No se pudo eliminar la obligación')
}
  setObligaciones((anteriores) =>
    anteriores.filter((obligacion) => obligacion.id !== id)
)
    alert('Obligación eliminada correctamente')
  } catch (error) {
    console.error(error)
    alert('Ocurrió un error al eliminar la obligación')
}
}
const eliminarAuditoria = async (id) => {
const confirmar = window.confirm(
    '¿Seguro que deseas eliminar esta auditoría?'
)
if (!confirmar) {
  return
}
  try {
const respuesta = await fetch(
  `${API_URL}/auditorias/${id}`,
  {
    method: 'DELETE',
    headers: encabezadosAuth
  }
)
  if (!respuesta.ok) {
    throw new Error('No se pudo eliminar la auditoría')
}
setAuditorias((anteriores) =>
  anteriores.filter((auditoria) => auditoria.id !== id)
)
alert('Auditoría eliminada correctamente')
  } catch (error) {
    console.error(error)
    alert('Ocurrió un error al eliminar la auditoría')
  }
}
const crearObligacion = async () => {
  if (!nuevaObligacion.nombre.trim()) {
    alert('Por favor, escribe el nombre de la obligación')
    return
  }
  try {
const respuesta = await fetch(
    `${API_URL}/obligaciones`,
{
    method: 'POST',
headers: {
  'Content-Type': 'application/json',
  ...encabezadosAuth
},
    body: JSON.stringify(nuevaObligacion)
}
  )
if (!respuesta.ok) {
const detalle = await respuesta.text()
    throw new Error(detalle)
}
const obligacionCreada = await respuesta.json()
    setObligaciones((anteriores) => [
    ...anteriores,
    obligacionCreada
])
    setNuevaObligacion({
      nombre: '',
      estado: 'Pendiente'
})
    setMostrarFormularioNuevo(false)
    alert('Obligación registrada correctamente')
  } catch (error) {
    console.error('Error al crear obligación:', error)
    alert('No se pudo registrar la obligación. Revisa la consola.')
  }
}
const guardarEdicionObligacion = async () => {
  if (!obligacionEditando) {
    return
}
  try {
const respuesta = await fetch(
  `${API_URL}/obligaciones/${obligacionEditando.id}`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...encabezadosAuth
    },
    body: JSON.stringify(obligacionEditando)
  }
)
  if (!respuesta.ok) {
    throw new Error('No se pudo actualizar la obligación')
}
const obligacionActualizada = await respuesta.json()
  setObligaciones((anteriores) =>
    anteriores.map((obligacion) =>
    obligacion.id === obligacionActualizada.id
        ? obligacionActualizada
    : obligacion
  )
)
  setObligacionEditando(null)
    alert('Obligación actualizada correctamente')
  } catch (error) {
  console.error(error)
    alert('Ocurrió un error al actualizar la obligación')
 }
}
const guardarEdicionAuditoria = async () => {
  if (!auditoriaEditando) {
    return
  }
  try {
const respuesta = await fetch(
  `${API_URL}/auditorias/${auditoriaEditando.id}`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...encabezadosAuth
    },
    body: JSON.stringify(auditoriaEditando)
  }
)
if (!respuesta.ok) {
const detalle = await respuesta.text()
  throw new Error(detalle)
}
const auditoriaActualizada = await respuesta.json()
  setAuditorias((anteriores) =>
  anteriores.map((auditoria) =>
  auditoria.id === auditoriaActualizada.id
    ? auditoriaActualizada
    : auditoria
  )
)
  setAuditoriaEditando(null)
    alert('Auditoría actualizada correctamente')
  } catch (error) {
    console.error('Error al actualizar auditoría:', error)
    alert('Ocurrió un error al actualizar la auditoría')
  }
}
const crearAuditoria = async () => {
  if (!nuevaAuditoria.nombre.trim()) {
    alert('Escribe el nombre de la auditoría')
    return
  }
  try {
const respuesta = await fetch(
  `${API_URL}/auditorias`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...encabezadosAuth
    },
    body: JSON.stringify(nuevaAuditoria)
  }
)
if (!respuesta.ok) {
const detalle = await respuesta.text()
      throw new Error(detalle)
}
const auditoriaCreada = await respuesta.json()
  setAuditorias((anteriores) => [
      ...anteriores,
      auditoriaCreada
])
  setNuevaAuditoria({
      nombre: '',
      estado: 'Programada'
})
  setMostrarFormularioNuevaAuditoria(false)
    alert('Auditoría creada correctamente')
  } catch (error) {
    console.error('Error al crear auditoría:', error)
    alert('Ocurrió un error al crear la auditoría')
  }
}
const guardarEdicionControl = async () => {
  if (!controlEditando) {
    return
}
  try {
const respuesta = await fetch(
  `${API_URL}/controles/${controlEditando.id}`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...encabezadosAuth
    },
    body: JSON.stringify(controlEditando)
  }
)
    if (!respuesta.ok) {
const detalle = await respuesta.text()
    throw new Error(detalle)
}
const controlActualizado = await respuesta.json()
   setControles((anteriores) =>
   anteriores.map((control) =>
   control.id === controlActualizado.id
      ? controlActualizado
      : control
  )
)
  setControlEditando(null)
    alert('Control actualizado correctamente')
  } catch (error) {
    console.error('Error al actualizar control:', error)
    alert('Ocurrió un error al actualizar el control')
  }
}
const eliminarControl = async (id) => {
const confirmar = window.confirm(
    '¿Seguro que deseas eliminar este control?'
  )
  if (!confirmar) return
  try {
const respuesta = await fetch(
  `${API_URL}/controles/${id}`,
  {
    method: 'DELETE',
    headers: encabezadosAuth
  }
)
  if (!respuesta.ok) {
const datosError = await respuesta.json()
  throw new Error(
    datosError.detail || 'No se pudo eliminar el control'
  )
}
  setControles((anteriores) =>
  anteriores.filter((control) => control.id !== id)
)
  alert('Control eliminado correctamente')
  } catch (error) {
  console.error('Error al eliminar control:', error)
  alert(error.message)
}
}
const crearControl = async () => {
  if (!nuevoControl.nombre.trim()) {
    alert('Escribe el nombre del control')
    return
  }
  try {
const respuesta = await fetch(
  `${API_URL}/controles`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...encabezadosAuth
    },
    body: JSON.stringify(nuevoControl)
  }
)
  if (!respuesta.ok) {
const detalle = await respuesta.text()
  throw new Error(detalle)
}
const controlCreado = await respuesta.json()
setControles((anteriores) => [
      ...anteriores,
      controlCreado
])
setNuevoControl({
      nombre: '',
      estado: 'Pendiente'
})
  setMostrarFormularioNuevoControl(false)
    alert('Control creado correctamente')
  } catch (error) {
    console.error('Error al crear control:', error)
    alert('Ocurrió un error al crear el control')
  }
}
const guardarEdicionRiesgo = async () => {
  if (!riesgoEditando) {
    return
}
  if (!riesgoEditando.nombre.trim()) {
    alert('Escribe el nombre del riesgo')
    return
}
  try {
const respuesta = await fetch(
  `${API_URL}/riesgos/${riesgoEditando.id}`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...encabezadosAuth
    },
    body: JSON.stringify(riesgoEditando)
  }
)
  if (!respuesta.ok) {
const detalle = await respuesta.text()
      throw new Error(detalle)
}
const riesgoActualizado = await respuesta.json()
   setRiesgos((anteriores) =>
   anteriores.map((riesgo) =>
   riesgo.id === riesgoActualizado.id
   ? riesgoActualizado
      : riesgo
  )
)
   setRiesgoEditando(null)
    alert('Riesgo actualizado correctamente')
  } catch (error) {
    console.error('Error al actualizar riesgo:', error)
    alert('Ocurrió un error al actualizar el riesgo')
  }
}
const eliminarRiesgo = async (id) => {
const confirmar = window.confirm(
    '¿Seguro que deseas eliminar este riesgo?'
  )
  if (!confirmar) return
  try {
const respuesta = await fetch(
  `${API_URL}/riesgos/${id}`,
  {
    method: 'DELETE',
    headers: encabezadosAuth
  }
)
    if (!respuesta.ok) {
const datosError = await respuesta.json()
      throw new Error(
        datosError.detail || 'No se pudo eliminar el riesgo'
    )
}
   setRiesgos((anteriores) =>
   anteriores.filter((riesgo) => riesgo.id !== id)
  )
    alert('Riesgo eliminado correctamente')
  } catch (error) {
    console.error('Error al eliminar riesgo:', error)
    alert(error.message)
  }
}
const crearRiesgo = async () => {
  if (!nuevoRiesgo.nombre.trim()) {
    alert('Escribe el nombre del riesgo')
    return
  }
  try {
const respuesta = await fetch(
  `${API_URL}/riesgos`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...encabezadosAuth
    },
    body: JSON.stringify(nuevoRiesgo)
  }
)
  if (!respuesta.ok) {
const datosError = await respuesta.json()
    throw new Error(
        JSON.stringify(datosError.detail || 'No se pudo crear el riesgo')
  )
}
const riesgoCreado = await respuesta.json()
    setRiesgos((anteriores) => [
      ...anteriores,
      riesgoCreado
])
    setNuevoRiesgo({
      nombre: '',
      nivel: 'Bajo',
      estado: 'Abierto'
})
    setMostrarFormularioNuevoRiesgo(false)
    alert('Riesgo creado correctamente')
  } catch (error) {
    console.error('Error al crear riesgo:', error)
    alert('Ocurrió un error al crear el riesgo')
  }
}
const guardarEdicionAlerta = async () => {
  if (!alertaEditando) return
  if (!alertaEditando.mensaje.trim()) {
    alert('Escribe el mensaje de la alerta')
    return
  }
  try {
const respuesta = await fetch(
  `${API_URL}/alertas/${alertaEditando.id}`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...encabezadosAuth
    },
    body: JSON.stringify(alertaEditando)
  }
)
  if (!respuesta.ok) {
const detalle = await respuesta.text()
    throw new Error(detalle)
}
const alertaActualizada = await respuesta.json()
   setAlertas((anteriores) =>
    anteriores.map((alerta) =>
    alerta.id === alertaActualizada.id
        ? alertaActualizada
        : alerta
  )
)
    setAlertaEditando(null)
    alert('Alerta actualizada correctamente')
  } catch (error) {
    console.error('Error al actualizar alerta:', error)
    alert('Ocurrió un error al actualizar la alerta')
  }
}
const eliminarAlerta = async (id) => {
const confirmar = window.confirm(
    '¿Seguro que deseas eliminar esta alerta?'
)
  if (!confirmar) return
  try {
const respuesta = await fetch(
  `${API_URL}/alertas/${id}`,
  {
    method: 'DELETE',
    headers: encabezadosAuth
  }
)
  if (!respuesta.ok) {
const datosError = await respuesta.json()
  throw new Error(
      datosError.detail || 'No se pudo eliminar la alerta'
  )
}
    setAlertas((anteriores) =>
    anteriores.filter((alerta) => alerta.id !== id)
)
    alert('Alerta eliminada correctamente')
  } catch (error) {
    console.error('Error al eliminar alerta:', error)
    alert(error.message)
  }
}
const crearAlerta = async () => {
  if (!nuevaAlerta.mensaje.trim()) {
    alert('Escribe el mensaje de la alerta')
    return
  }
  try {
const respuesta = await fetch(
  `${API_URL}/alertas`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...encabezadosAuth
    },
    body: JSON.stringify(nuevaAlerta)
  }
)
  if (!respuesta.ok) {
const detalle = await respuesta.text()
  throw new Error(detalle)
}
const alertaCreada = await respuesta.json()
   setAlertas((anteriores) => [
   ...anteriores,
   alertaCreada
])
    setNuevaAlerta({
      titulo: '',
      estado: 'Pendiente'
})
    setMostrarFormularioNuevaAlerta(false)
    alert('Alerta creada correctamente')
  } catch (error) {
    console.error('Error al crear alerta:', error)
    alert('Ocurrió un error al crear la alerta')
  }
}
const crearDepartamento = async () => {
  if (!nuevoDepartamento.nombre.trim()) {
    alert('Escribe el nombre del departamento')
    return
  }
  try {
const respuesta = await fetch(
  `${API_URL}/departamentos`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...encabezadosAuth
    },
    body: JSON.stringify(nuevoDepartamento)
  }
)
  if (!respuesta.ok) {
const detalle = await respuesta.text()
  throw new Error(detalle)
}
const respuestaLista = await fetch(
  `${API_URL}/departamentos`,
  {
    headers: encabezadosAuth
  }
)
  if (!respuestaLista.ok) {
  throw new Error('No se pudo actualizar la lista de departamentos')
}
const listaActualizada = await respuestaLista.json()
    setDepartamentos(listaActualizada)
    setNuevoDepartamento({
      nombre: '',
      descripcion: '',
      activo: true
})
    setMostrarFormularioNuevoDepartamento(false)
    alert('Departamento registrado correctamente')
  } catch (error) {
    console.error('Error al crear departamento:', error)
    alert('Ocurrió un error al registrar el departamento')
  }
}
const guardarEdicionDepartamento = async () => {
  if (!departamentoEditando) return
  if (!departamentoEditando.nombre.trim()) {
    alert('Escribe el nombre del departamento')
    return
  }
  try {
const respuesta = await fetch(
   `${API_URL}/departamentos/${departamentoEditando.id}`,
{
   method: 'PUT',
   headers: {
    'Content-Type': 'application/json',
     ...encabezadosAuth
},
      body: JSON.stringify({
          nombre: departamentoEditando.nombre,
          descripcion: departamentoEditando.descripcion,
          activo: departamentoEditando.activo
    })
  }
)
  if (!respuesta.ok) {
const detalle = await respuesta.text()
  throw new Error(detalle)
}
const respuestaLista = await fetch(
  `${API_URL}/departamentos`,
  {
    headers: encabezadosAuth
  }
)
  if (!respuestaLista.ok) {
  throw new Error('No se pudo actualizar la lista')
}
const listaActualizada = await respuestaLista.json()
    setDepartamentos(listaActualizada)
    setDepartamentoEditando(null)
    alert('Departamento actualizado correctamente')
  } catch (error) {
    console.error('Error al actualizar departamento:', error)
    alert('No se pudo actualizar el departamento')
  }
}
const eliminarIndicador = async (id) => {
const confirmar = window.confirm(
    '¿Estás seguro de que deseas eliminar este indicador?'
  )
  if (!confirmar) return
  try {
const respuesta = await fetch(
  `${API_URL}/indicadores/${id}`,
  {
    method: 'DELETE',
    headers: encabezadosAuth
  }
)
  if (!respuesta.ok) {
const detalle = await respuesta.text()
      throw new Error(detalle)
}
const respuestaLista = await fetch(
  `${API_URL}/indicadores`,
  {
    headers: encabezadosAuth
  }
)
  if (!respuestaLista.ok) {
    throw new Error('No se pudo actualizar la lista de indicadores')
    }
const listaActualizada = await respuestaLista.json()
    setIndicadores(listaActualizada)
    if (indicadorEditando?.id === id) {
      setIndicadorEditando(null)
}
    alert('Indicador eliminado correctamente')
  } catch (error) {
    console.error('Error al eliminar indicador:', error)
    alert('No se pudo eliminar el indicador. Revisa la consola.')
  }
}
const actualizarIndicador = async () => {
  if (!indicadorEditando) return
  if (!indicadorEditando.nombre.trim()) {
    alert('Escribe el nombre del indicador')
    return
  }
  if (
    indicadorEditando.periodo_inicio &&
    indicadorEditando.periodo_fin &&
    indicadorEditando.periodo_fin < indicadorEditando.periodo_inicio
  ) {
    alert('El periodo fin no puede ser anterior al periodo inicio')
    return
  }
  try {
const respuesta = await fetch(
      `${API_URL}/indicadores/${indicadorEditando.id}`,
{
   method: 'PUT',
   headers: {
     'Content-Type': 'application/json',
      ...encabezadosAuth
},
    body: JSON.stringify({
      nombre: indicadorEditando.nombre,
      descripcion: indicadorEditando.descripcion,
      categoria: indicadorEditando.categoria,
      valor: Number(indicadorEditando.valor),
      unidad: indicadorEditando.unidad,
      periodo_inicio: indicadorEditando.periodo_inicio || null,
      periodo_fin: indicadorEditando.periodo_fin || null
    })
  }
)
   if (!respuesta.ok) {
const detalle = await respuesta.text()
    throw new Error(detalle)
}
const respuestaLista = await fetch(
  `${API_URL}/indicadores`,
  {
    headers: encabezadosAuth
  }
)
  if (!respuestaLista.ok) {
      throw new Error('No se pudo actualizar la lista de indicadores')
    }
const listaActualizada = await respuestaLista.json()
    setIndicadores(listaActualizada)
    setIndicadorEditando(null)
    alert('Indicador actualizado correctamente')
  } catch (error) {
    console.error('Error al actualizar indicador:', error)
    alert('No se pudo actualizar el indicador. Revisa la consola.')
  }
}
const eliminarRol = async (id) => {
const confirmar = window.confirm(
    '¿Seguro que deseas eliminar este rol?'
)
  if (!confirmar) return
  try {
const respuesta = await fetch(
  `${API_URL}/roles/${id}`,
  {
    method: 'DELETE',
    headers: encabezadosAuth
  }
)
  if (!respuesta.ok) {
const datosError = await respuesta.json().catch(() => ({}))
    throw new Error(
      datosError.detail || 'No se pudo eliminar el rol'
  )
}
  setRoles((anteriores) =>
    anteriores.filter((rol) => rol.id !== id)
)
  if (rolEditando?.id === id) {
    setRolEditando(null)
}
    alert('Rol eliminado correctamente')
  } catch (error) {
    console.error('Error al eliminar rol:', error)
    alert(error.message)
  }
}
const guardarEdicionRol = async () => {
  if (!rolEditando) return
  if (!rolEditando.nombre.trim()) {
    alert('Escribe el nombre del rol')
    return
  }
  try {
const respuesta = await fetch(
      `${API_URL}/roles/${rolEditando.id}`,
{
   method: 'PUT',
   headers: {
    'Content-Type': 'application/json',
    ...encabezadosAuth
},
       body: JSON.stringify({
       nombre: rolEditando.nombre,
       descripcion: rolEditando.descripcion
    })
  }
)
  if (!respuesta.ok) {
const detalle = await respuesta.text()
    throw new Error(detalle)
}
const respuestaLista = await fetch(
  `${API_URL}/roles`,
  {
    headers: encabezadosAuth
  }
)
  if (!respuestaLista.ok) {
    throw new Error('No se pudo actualizar la lista de roles')
}
const listaActualizada = await respuestaLista.json()
    setRoles(listaActualizada)
    setRolEditando(null)
    alert('Rol actualizado correctamente')
  } catch (error) {
    console.error('Error al actualizar rol:', error)
    alert('No se pudo actualizar el rol. Revisa la consola.')
  }
}
const eliminarUsuario = async (id) => {
  const confirmar = window.confirm(
    '¿Estás seguro de que deseas eliminar este usuario?'
  )
  if (!confirmar) return
   try {
const respuesta = await fetch(
  `${API_URL}/usuarios/${id}`,
  {
    method: 'DELETE',
    headers: encabezadosAuth
  }
)
  if (!respuesta.ok) {
    throw new Error('Error al eliminar el usuario')
}
const respuestaLista = await fetch(
  `${API_URL}/usuarios`,
  {
    headers: encabezadosAuth
  }
)
  if (!respuestaLista.ok) {
    throw new Error('Error al actualizar la lista de usuarios')
}
const datos = await respuestaLista.json()
    setUsuarios(datos)
    alert('Usuario eliminado correctamente')
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    alert('No se pudo eliminar el usuario')
  }
}
const actualizarUsuario = async () => {
  if (!usuarioEditando.nombre.trim() || !usuarioEditando.correo.trim()) {
    alert('El nombre y el correo son obligatorios')
    return
  }
try {
const respuesta = await fetch(
    `${API_URL}/usuarios/${usuarioEditando.id}`,
{
   method: 'PUT',
   headers: {
     'Content-Type': 'application/json',
     ...encabezadosAuth
},
      body: JSON.stringify({
      nombre: usuarioEditando.nombre,
      correo: usuarioEditando.correo,
      entra_id: usuarioEditando.entra_id,
      rol_id: usuarioEditando.rol_id,
      departamento_id: usuarioEditando.departamento_id,
      activo: usuarioEditando.activo
    })
  }
)
    if (!respuesta.ok) {
      throw new Error('Error al actualizar el usuario')
    }
const respuestaLista = await fetch(
  `${API_URL}/usuarios`,
  {
    headers: encabezadosAuth
  }
)
  if (!respuestaLista.ok) {
    throw new Error('Error al actualizar la lista de usuarios')
}
const datos = await respuestaLista.json()
    setUsuarios(datos)
    setUsuarioEditando(null)
    alert('Usuario actualizado correctamente')
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    alert('No se pudo actualizar el usuario')
  }
}
const crearUsuario = async () => {
  if (!nuevoUsuario.nombre.trim() || !nuevoUsuario.correo.trim()) {
    alert('Escribe el nombre y correo del usuario')
    return
  }
  try {
const respuesta = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
     ...encabezadosAuth
},
      body: JSON.stringify(nuevoUsuario)
    })

  if (!respuesta.ok) {
const detalle = await respuesta.text()
    throw new Error(detalle)
    }
const respuestaLista = await fetch(
  `${API_URL}/usuarios`,
  {
    headers: encabezadosAuth
  }
)
  if (!respuestaLista.ok) {
    throw new Error('No se pudo actualizar la lista de usuarios')
    }
const listaActualizada = await respuestaLista.json()
    setUsuarios(listaActualizada)
    setNuevoUsuario({
      nombre: '',
      correo: '',
      entra_id: '',
      rol_id: null,
      departamento_id: null,
      activo: true
    })
    setMostrarFormularioNuevoUsuario(false)
    alert('Usuario registrado correctamente')
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    alert('No se pudo registrar el usuario. Revisa la consola.')
  }
}
const crearRol = async () => {
  if (!nuevoRol.nombre.trim()) {
    alert('Escribe el nombre del rol')
    return
  }
  try {
const respuesta = await fetch(
    `${API_URL}/roles`,
{
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
     ...encabezadosAuth
},
      body: JSON.stringify(nuevoRol)
  }
)
  if (!respuesta.ok) {
const detalle = await respuesta.text()
    throw new Error(detalle)
}
const respuestaLista = await fetch(
  `${API_URL}/roles`,
  {
    headers: encabezadosAuth
  }
)
  if (!respuestaLista.ok) {
    throw new Error('No se pudo actualizar la lista de roles')
}
const listaActualizada = await respuestaLista.json()
    setRoles(listaActualizada)
    setNuevoRol({
      nombre: '',
      descripcion: ''
    })
    setMostrarFormularioNuevoRol(false)
    alert('Rol registrado correctamente')

  } catch (error) {
    console.error('Error al registrar rol:', error)
    alert('No se pudo registrar el rol. Revisa la consola.')
  }
}
const crearIndicador = async () => {
  if (!nuevoIndicador.nombre.trim()) {
    alert('Escribe el nombre del indicador')
    return
  }
  if (
    nuevoIndicador.periodo_inicio &&
    nuevoIndicador.periodo_fin &&
    nuevoIndicador.periodo_fin < nuevoIndicador.periodo_inicio
  ) {
    alert('El periodo fin no puede ser anterior al periodo inicio')
    return
  }
  try {
const respuesta = await fetch(
    `${API_URL}/indicadores`,
{
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
    ...encabezadosAuth
},
    body: JSON.stringify({
      ...nuevoIndicador,
      valor: Number(nuevoIndicador.valor),
      periodo_inicio: nuevoIndicador.periodo_inicio || null,
      periodo_fin: nuevoIndicador.periodo_fin || null
    })
  }
)
  if (!respuesta.ok) {
const detalle = await respuesta.text()
   throw new Error(detalle)
    }
const respuestaLista = await fetch(
  `${API_URL}/indicadores`,
  {
    headers: encabezadosAuth
  }
)
  if (!respuestaLista.ok) {
    throw new Error('No se pudo actualizar la lista de indicadores')
    }
const listaActualizada = await respuestaLista.json()
    setIndicadores(listaActualizada)
    setNuevoIndicador({
      nombre: '',
      descripcion: '',
      categoria: '',
      valor: 0,
      unidad: '',
      periodo_inicio: '',
      periodo_fin: ''
})
    setMostrarFormularioNuevoIndicador(false)
    alert('Indicador registrado correctamente')
  } catch (error) {
    console.error('Error al registrar indicador:', error)
    alert('No se pudo registrar el indicador. Revisa la consola.')
  }
}
const crearEvidencia = async () => {
  if (!nuevaEvidencia.nombre.trim()) {
    alert('Escribe el nombre de la evidencia')
    return
  }
  try {
const respuesta = await fetch(
  `${API_URL}/evidencias`,
{
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
    ...encabezadosAuth
},
    body: JSON.stringify({
        ...nuevaEvidencia,
        fecha_documento: nuevaEvidencia.fecha_documento || null
    })
  }
)
  if (!respuesta.ok) {
const detalle = await respuesta.text()
  throw new Error(detalle)
}
const respuestaLista = await fetch(
  `${API_URL}/evidencias`,
  {
    headers: encabezadosAuth
  }
)
  if (!respuestaLista.ok) {
  throw new Error('No se pudo actualizar la lista de evidencias')
}
const listaActualizada = await respuestaLista.json()
    setEvidencias(listaActualizada)
    setNuevaEvidencia({
      obligacion_id: null,
      auditoria_id: null,
      control_id: null,
      nombre: '',
      tipo: '',
      ubicacion: '',
      descripcion: '',
      fecha_documento: '',
      estado: 'Pendiente'
})
    setMostrarFormularioNuevaEvidencia(false)
    alert('Evidencia registrada correctamente')
  } catch (error) {
    console.error('Error al registrar evidencia:', error)
    alert('No se pudo registrar la evidencia. Revisa la consola.')
  }
}
const guardarEdicionEvidencia = async () => {
  if (!evidenciaEditando) return
  if (!evidenciaEditando.nombre.trim()) {
    alert('Escribe el nombre de la evidencia')
    return
  }
  try {
const respuesta = await fetch(
  `${API_URL}/evidencias/${evidenciaEditando.id}`,
{
   method: 'PUT',
   headers: {
    'Content-Type': 'application/json',
    ...encabezadosAuth
},
    body: JSON.stringify({
        ...evidenciaEditando,
        fecha_documento: evidenciaEditando.fecha_documento || null
    })
  }
)
  if (!respuesta.ok) {
const detalle = await respuesta.text()
  throw new Error(detalle)
}
const respuestaLista = await fetch(
  `${API_URL}/evidencias`,
  {
    headers: encabezadosAuth
  }
)
  if (!respuestaLista.ok) {
  throw new Error('No se pudo actualizar la lista de evidencias')
}
const listaActualizada = await respuestaLista.json()
    setEvidencias(listaActualizada)
    setEvidenciaEditando(null)
    alert('Evidencia actualizada correctamente')
  } catch (error) {
    console.error('Error al actualizar evidencia:', error)
    alert('No se pudo actualizar la evidencia. Revisa la consola.')
  }
}
const eliminarEvidencia = async (id) => {
const confirmar = window.confirm(
    '¿Seguro que deseas eliminar esta evidencia?'
)
  if (!confirmar) return
  try {
const respuesta = await fetch(
  `${API_URL}/evidencias/${id}`,
  {
    method: 'DELETE',
    headers: encabezadosAuth
  }
)
  if (!respuesta.ok) {
const datosError = await respuesta.json().catch(() => ({}))
  throw new Error(
    datosError.detail || 'No se pudo eliminar la evidencia'
  )
}
    setEvidencias((anteriores) =>
      anteriores.filter((evidencia) => evidencia.id !== id)
)
    setEvidenciaEditando(null)
    alert('Evidencia eliminada correctamente')
  } catch (error) {
    console.error('Error al eliminar evidencia:', error)
    alert(error.message)
  }
}
const eliminarDepartamento = async (id) => {
const confirmar = window.confirm(
    '¿Seguro que deseas eliminar este departamento?'
  )
  if (!confirmar) return
  try {
const respuesta = await fetch(
  `${API_URL}/departamentos/${id}`,
  {
    method: 'DELETE',
    headers: encabezadosAuth
  }
)
  if (!respuesta.ok) {
const datosError = await respuesta.json().catch(() => ({}))
  throw new Error(
      datosError.detail || 'No se pudo eliminar el departamento'
  )
}
  setDepartamentos((anteriores) =>
    anteriores.filter((departamento) => departamento.id !== id)
)
  setDepartamentoEditando(null)
    alert('Departamento eliminado correctamente')
  } catch (error) {
    console.error('Error al eliminar departamento:', error)
    alert(error.message)
  }
}
if (!token) {
return (

<div className="login-page">
<div className="card" style={{ maxWidth: '420px', margin: '80px auto', padding: '30px' }}>
  <h2 className="login-title">
  <span className="login-brand">PluriOne</span>
  <span className="login-subtitle"> Bienvenido de nuevo</span>
  </h2>
  <p>Dashboard Ejecutivo de Cumplimiento Normativo</p>
  <form onSubmit={iniciarSesion}>
  <input
      type="email"
      placeholder="Correo electrónico"
      value={correoLogin}
      onChange={(e) => setCorreoLogin(e.target.value)}
      required
/>
  <input
      type="password"
      placeholder="Contraseña"
      value={contrasenaLogin}
      onChange={(e) => setContrasenaLogin(e.target.value)}
      required
/>
{errorLogin && <p style={{ color: 'red' }}>{errorLogin}</p>}
    <button type="submit">Entrar</button>
    </form>
</div>
</div>
  )
}

return (

<div className="dashboard">
<header className="dashboard-header">
  <h1>Dashboard Ejecutivo de Cumplimiento Normativo</h1>
  <p>PluriOne S.A. de C.V.</p>
  <button onClick={cerrarSesion}>
  Cerrar sesión
  </button>
  </header>
 <nav className="dashboard-nav dashboard-sidebar">
  <button
  className={vistaActual === 'dashboard' ? 'nav-activo' : ''}
  onClick={() => setVistaActual('dashboard')}
>
  Dashboard
  </button>
  <button
  className={vistaActual === 'obligaciones' ? 'nav-activo' : ''}
  onClick={() => setVistaActual('obligaciones')}
>
  Obligaciones
  </button>
  <button
  className={vistaActual === 'auditorias' ? 'nav-activo' : ''}
  onClick={() => setVistaActual('auditorias')}
>
  Auditorías
  </button>
  <button
  className={vistaActual === 'controles' ? 'nav-activo' : ''}
  onClick={() => setVistaActual('controles')}
>
  Controles
  </button>
  <button
  className={vistaActual === 'riesgos' ? 'nav-activo' : ''}
  onClick={() => setVistaActual('riesgos')}
>
  Riesgos
  </button>
  <button
  className={vistaActual === 'alertas' ? 'nav-activo' : ''}
  onClick={() => setVistaActual('alertas')}
>
  Alertas
  </button>
  <button
  className={vistaActual === 'normativas' ? 'nav-activo' : ''}
  onClick={() => setVistaActual('normativas')}
>
  Normativas
  </button>
  <button
  className={vistaActual === 'departamentos' ? 'nav-activo' : ''}
  onClick={() => setVistaActual('departamentos')}
>
  Departamentos
  </button>
  <button
  className={vistaActual === 'evidencias' ? 'nav-activo' : ''}
  onClick={() => setVistaActual('evidencias')}
>
  Evidencias
  </button>
  <button
  className={vistaActual === 'indicadores' ? 'nav-activo' : ''}
  onClick={() => setVistaActual('indicadores')}
>
  Indicadores
  </button>
 <button
  className={vistaActual === 'roles' ? 'nav-activo' : ''}
  onClick={() => setVistaActual('roles')}
>
  Roles
 </button>
 <button
  className={vistaActual === 'usuarios' ? 'nav-activo' : ''}
  onClick={() => setVistaActual('usuarios')}
>
  Usuarios
</button>
</nav>

<main className="dashboard-content">
  {vistaActual === 'dashboard' && (
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
    onClick={() => {
      setFiltroDepartamento('')
      setFiltroNormativa('')
  }}
>
  Limpiar filtros
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
  <p className="total">{auditorias.length}</p>
</div>
<div className="card">
  <h2>Total de controles</h2>
  <p className="total">{controles.length}</p>
</div>
<div className="card">
  <h2>Total de riesgos</h2>
  <p className="total">{riesgos.length}</p>
</div>
<div className="card">
  <h2>Total de alertas</h2>
  <p className="total">{alertas.length}</p>
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
{obligacionesVencidasPorFecha.length > 0 && (
<div className="alerta-ejecutiva">
  <strong>⚠ Obligaciones vencidas por fecha</strong>
  <p>
    Se detectaron {obligacionesVencidasPorFecha.length} obligación(es)
    cuya fecha límite ya pasó y que requieren atención.
  </p>
  <ul>
{obligacionesVencidasPorFecha.map((obligacion) => (
  <li key={obligacion.id}>
{obligacion.nombre} — Fecha límite: {String(obligacion.fecha_limite).slice(0, 10)}
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
{obligacion.nombre} — Fecha límite: {String(obligacion.fecha_limite).slice(0, 10)}
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
  </li>
))}
  </ul>
</div>
</>
)}
{vistaActual === 'obligaciones' && (
<div className="card">
  <h2>Gestión de obligaciones</h2>
  <p>Aquí se administrarán las obligaciones normativas.</p>
  <button
    className="btn-nuevo"
    onClick={() => setMostrarFormularioNuevo(true)}
>
    Nueva obligación
  </button>
{mostrarFormularioNuevo && (
<div className="formulario-edicion">
  <h3>Nueva obligación</h3>
<div className="fila-nueva-obligacion">
  <label>Nombre</label>
  <input
    type="text"
    placeholder="Escribe el nombre de la obligación"
    value={nuevaObligacion.nombre}
    onChange={(e) =>
      setNuevaObligacion({
      ...nuevaObligacion,
      nombre: e.target.value
   })
  }
/>
  <label>Estado</label>
  <select
    value={nuevaObligacion.estado}
    onChange={(e) =>
    setNuevaObligacion({
    ...nuevaObligacion,
    estado: e.target.value
  })
 }
>
  <option value="Pendiente">Pendiente</option>
  <option value="En progreso">En progreso</option>
  <option value="Cumplida">Cumplida</option>
  <option value="Vencida">Vencida</option>
  </select>

<div className="botones-formulario">
  <button
   className="btn-guardar"
   onClick={crearObligacion}
>
  Guardar obligación
</button>
<button
    className="btn-eliminar"
    onClick={() => setMostrarFormularioNuevo(false)}
>
    Cancelar
  </button>
</div>
</div>
</div>
)}

{obligacionEditando && (
<div className="formulario-edicion">
  <h3>Editar obligación</h3>
  <label>Nombre</label>
  <input
    type="text"
    value={obligacionEditando.nombre || ''}
    onChange={(e) =>
    setObligacionEditando({
    ...obligacionEditando,
    nombre: e.target.value
   })
  }
/>
  <label>Estado</label>
  <select
    value={obligacionEditando.estado || 'Pendiente'}
    onChange={(e) =>
    setObligacionEditando({
    ...obligacionEditando,
    estado: e.target.value
  })
 }
>
  <option value="Pendiente">Pendiente</option>
  <option value="En progreso">En progreso</option>
  <option value="Cumplida">Cumplida</option>
  <option value="Vencida">Vencida</option>
  </select>
  <button
    className="btn-guardar"
    onClick={guardarEdicionObligacion}
>
  Guardar cambios
  </button>
</div>
)}
  <table className="tabla-datos">
    <thead>
    <tr>
    <th>ID</th>
    <th>Obligación</th>
    <th>Estado</th>
    <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
{obligaciones.map((obligacion) => (
    <tr key={obligacion.id}>
    <td>{obligacion.id}</td>
    <td>{obligacion.nombre}</td>
    <td>{obligacion.estado}</td>
    <td>
  <button
    className="btn-editar"
    onClick={() => setObligacionEditando(obligacion)}
>
  Editar
  </button>
  <button
    className="btn-eliminar"
    onClick={() => eliminarObligacion(obligacion.id)}
>
  Eliminar
  </button>
  </td>
  </tr>
))}
  </tbody>
  </table>
</div>
)}

{vistaActual === 'auditorias' && (
<div className="card">
  <h2>Gestión de auditorías</h2>
  <p>Aquí se administrarán las auditorías de cumplimiento.</p>
  <button
    className="btn-nuevo"
    onClick={() => setMostrarFormularioNuevaAuditoria(true)}
>
   Nueva auditoría
  </button>
{mostrarFormularioNuevaAuditoria && (
<div className="formulario-edicion">
  <h3>Nueva auditoría</h3>
<div className="fila-nueva-obligacion">
  <label>Nombre</label>
  <input
   type="text"
   placeholder="Escribe el nombre de la auditoría"
   value={nuevaAuditoria.nombre}
   onChange={(e) =>
    setNuevaAuditoria({
    ...nuevaAuditoria,
    nombre: e.target.value
    })
  }
/>
  <label>Estado</label>
  <select
   value={nuevaAuditoria.estado}
   onChange={(e) =>
    setNuevaAuditoria({
    ...nuevaAuditoria,
    estado: e.target.value
    })
  }
>
  <option value="Programada">Programada</option>
  <option value="En progreso">En progreso</option>
  <option value="Completada">Completada</option>
  <option value="Cancelada">Cancelada</option>
  </select>
<div className="botones-formulario">
  <button
   className="btn-guardar"
   onClick={crearAuditoria}
>
  Guardar auditoría
  </button>
  <button
    className="btn-eliminar"
    onClick={() => setMostrarFormularioNuevaAuditoria(false)}
  >
  Cancelar
  </button>
</div>
</div>
</div>

)}
{auditoriaEditando && (
<div className="formulario-edicion">
  <h3>Editar auditoría</h3>
  <label>Nombre</label>
  <input
    type="text"
    value={auditoriaEditando.nombre || ''}
    onChange={(e) =>
    setAuditoriaEditando({
    ...auditoriaEditando,
    nombre: e.target.value
   })
  }
/>
  <label>Estado</label>
  <select
    value={auditoriaEditando.estado || 'Programada'}
    onChange={(e) =>
    setAuditoriaEditando({
    ...auditoriaEditando,
    estado: e.target.value
  })
 }
>
  <option value="Programada">Programada</option>
  <option value="En progreso">En progreso</option>
  <option value="Completada">Completada</option>
  <option value="Cancelada">Cancelada</option>
  </select>
  <button
   className="btn-guardar"
   onClick={guardarEdicionAuditoria}
>
  Guardar cambios
  </button>
</div>
)}
  <table className="tabla-datos">
  <thead>
  <tr>
  <th>ID</th>
  <th>Auditoría</th>
  <th>Estado</th>
  <th>Acciones</th>
  </tr>
  </thead>
  <tbody>
{auditorias.map((auditoria) => (
  <tr key={auditoria.id}>
  <td>{auditoria.id}</td>
  <td>{auditoria.nombre}</td>
  <td>{auditoria.estado}</td>
  <td>
  <button
   className="btn-editar"
   onClick={() => setAuditoriaEditando(auditoria)}
>
  Editar
  </button>
  <button
   className="btn-eliminar"
   onClick={() => eliminarAuditoria(auditoria.id)}
>
  Eliminar
  </button>
  </td>
  </tr>
))}
  </tbody>
  </table>
</div>
)}

{vistaActual === 'controles' && (
<div className="card">
  <h2>Gestión de controles</h2>
  <p>Aquí se administrarán los controles internos de cumplimiento.</p>
  <button
   className="btn-nuevo"
   onClick={() => setMostrarFormularioNuevoControl(true)}
>
  Nuevo control
  </button>
{mostrarFormularioNuevoControl && (
 <div className="formulario-edicion">
   <h3>Nuevo control</h3>
 <div className="fila-nueva-obligacion">
  <label>Nombre</label>
  <input
   type="text"
   placeholder="Escribe el nombre del control"
   value={nuevoControl.nombre}
   onChange={(e) =>
   setNuevoControl({
   ...nuevoControl,
   nombre: e.target.value
   })
  }
/>
  <label>Estado</label>
  <select
   value={nuevoControl.estado}
   onChange={(e) =>
   setNuevoControl({
   ...nuevoControl,
   estado: e.target.value
    })
  }
>
  <option value="Pendiente">Pendiente</option>
  <option value="En progreso">En progreso</option>
  <option value="Implementado">Implementado</option>
  <option value="Fallido">Fallido</option>
  </select>
<div className="botones-formulario">
  <button
   className="btn-guardar"
   onClick={crearControl}
>
  Guardar control
  </button>
  <button
    className="btn-eliminar"
    onClick={() => setMostrarFormularioNuevoControl(false)}
>
  Cancelar
 </button>
</div>
</div>
</div>
)}

{controlEditando && (
  <div className="formulario-edicion">
  <h3>Editar control</h3>
  <label>Nombre</label>
  <input
    type="text"
    value={controlEditando.nombre || ''}
    onChange={(e) =>
    setControlEditando({
    ...controlEditando,
    nombre: e.target.value
   })
  }
/>
  <label>Estado</label>
  <input
    type="text"
    value={controlEditando.estado || ''}
    onChange={(e) =>
    setControlEditando({
    ...controlEditando,
    estado: e.target.value
   })
  }
/>
  <button
   className="btn-guardar"
   onClick={guardarEdicionControl}
>
  Guardar cambios
  </button>
  </div>
)}
  <table className="tabla-datos">
  <thead>
    <tr>
    <th>ID</th>
    <th>Control</th>
    <th>Estado</th>
    <th>Acciones</th>
    </tr>
  </thead>
   <tbody>
{controles.map((control) => (
    <tr key={control.id}>
    <td>{control.id}</td>
    <td>{control.nombre}</td>
    <td>{control.estado}</td>
    <td>
  <button
   className="btn-editar"
   onClick={() => setControlEditando(control)}
>
  Editar
  </button>
  <button
   className="btn-eliminar"
   onClick={() => eliminarControl(control.id)}
>
  Eliminar
  </button>
  </td>
  </tr>
))}
  </tbody>
  </table>
</div>
)}

{vistaActual === 'riesgos' && (
<div className="card">
  <h2>Gestión de riesgos</h2>
  <p>Aquí se administrarán los riesgos de cumplimiento.</p>
  <button
   className="btn-nuevo"
   onClick={() => setMostrarFormularioNuevoRiesgo(true)}
>
  Nuevo riesgo
  </button>
{mostrarFormularioNuevoRiesgo && (
<div className="formulario-edicion">
  <h3>Nuevo riesgo</h3>
<div className="fila-nueva-obligacion">
  <label>Nombre</label>
  <input
   type="text"
   placeholder="Escribe el nombre del riesgo"
   value={nuevoRiesgo.nombre}
   onChange={(e) =>
   setNuevoRiesgo({
   ...nuevoRiesgo,
  nombre: e.target.value
    })
  }
/>
  <label>Nivel de riesgo</label>
  <select
   value={nuevoRiesgo.nivel}
   onChange={(e) =>
   setNuevoRiesgo({
   ...nuevoRiesgo,
   nivel: e.target.value
    })
  }
>
  <option value="Bajo">Bajo</option>
  <option value="Medio">Medio</option>
  <option value="Alto">Alto</option>
  <option value="Critico">Crítico</option>
  </select>
  <label>Estado</label>
  <input
   type="text"
   placeholder="Escribe el estado del riesgo"
   value={nuevoRiesgo.estado}
   onChange={(e) =>
   setNuevoRiesgo({
   ...nuevoRiesgo,
   estado: e.target.value
    })
  }
/>
<div className="botones-formulario">
  <button
   className="btn-guardar"
   onClick={crearRiesgo}
>
  Guardar riesgo
  </button>
  <button
    className="btn-eliminar"
    onClick={() => setMostrarFormularioNuevoRiesgo(false)}
  >
    Cancelar
  </button>
</div>
</div>
</div>
)}

{riesgoEditando && (
<div className="formulario-edicion">
  <h3>Editar riesgo</h3>
  <label>Nombre</label>
  <input
    type="text"
    value={riesgoEditando.nombre || ''}
    onChange={(e) =>
    setRiesgoEditando({
    ...riesgoEditando,
    nombre: e.target.value
    })
  }
/>
  <label>Nivel de riesgo</label>
  <select
   value={riesgoEditando.nivel || 'Bajo'}
   onChange={(e) =>
   setRiesgoEditando({
    ...riesgoEditando,
    nivel: e.target.value
    })
  }
>
  <option value="Bajo">Bajo</option>
  <option value="Medio">Medio</option>
  <option value="Alto">Alto</option>
  <option value="Critico">Crítico</option>
  </select>
  <label>Estado</label>
  <input
    type="text"
    value={riesgoEditando.estado || ''}
    onChange={(e) =>
    setRiesgoEditando({
    ...riesgoEditando,
    estado: e.target.value
    })
  }
/>
  <button
   className="btn-guardar"
   onClick={guardarEdicionRiesgo}
>
  Guardar cambios
  </button>
</div>
)}
  <table className="tabla-datos">
  <thead>
   <tr>
   <th>ID</th>
   <th>Riesgo</th>
   <th>Estado</th>
   <th>Acciones</th>
   </tr>
   </thead>
   <tbody>
{riesgos.map((riesgo) => (
   <tr key={riesgo.id}>
   <td>{riesgo.id}</td>
   <td>{riesgo.nombre}</td>
   <td>{riesgo.estado}</td>
   <td>
   <button
    className="btn-editar"
    onClick={() => setRiesgoEditando(riesgo)}
>
  Editar
  </button>
  <button
    className="btn-eliminar"
    onClick={() => eliminarRiesgo(riesgo.id)}
>
  Eliminar
  </button>
  </td>
  </tr>
))}
  </tbody>
  </table>
</div>
)}

{vistaActual === 'alertas' && (
<div className="card">
  <h2>Gestión de alertas</h2>
  <p>Aquí se administrarán las alertas de cumplimiento.</p>
  <button
    className="btn-nuevo"
   onClick={() => setMostrarFormularioNuevaAlerta(true)}
>
  Nueva alerta
  </button>
{mostrarFormularioNuevaAlerta && (
<div className="formulario-edicion">
  <h3>Nueva alerta</h3>
<div className="fila-nueva-obligacion">
  <label>Título</label>
  <input
    type="text"
    placeholder="Escribe el título de la alerta"
    value={nuevaAlerta.titulo}
    onChange={(e) =>
    setNuevaAlerta({
    ...nuevaAlerta,
    titulo: e.target.value
    })
  }
/>
  <label>Mensaje</label>
  <input
    type="text"
    placeholder="Escribe el mensaje de la alerta"
    value={nuevaAlerta.mensaje}
    onChange={(e) =>
    setNuevaAlerta({
    ...nuevaAlerta,
    mensaje: e.target.value
     })
   }
/>
  <label>Estado</label>
  <select
    value={nuevaAlerta.estado}
    onChange={(e) =>
    setNuevaAlerta({
    ...nuevaAlerta,
    estado: e.target.value
    })
  }
>
  <option value="Pendiente">Pendiente</option>
  <option value="Atendida">Atendida</option>
  <option value="Descartada">Descartada</option>
  </select>
  <button
     className="btn-guardar"
    onClick={crearAlerta}
>
  Guardar alerta
  </button>
  <button
    className="btn-eliminar"
    onClick={() => setMostrarFormularioNuevaAlerta(false)}
>
  Cancelar
  </button>
</div>
</div>
)}

{alertaEditando && (
<div className="formulario-edicion">
  <h3>Editar alerta</h3>
  <label>Mensaje</label>
  <input
    type="text"
    value={alertaEditando.mensaje || ''}
    onChange={(e) =>
    setAlertaEditando({
    ...alertaEditando,
    mensaje: e.target.value
     })
   }
/>
  <label>Estado</label>
  <input
    type="text"
    value={alertaEditando.estado || ''}
    onChange={(e) =>
    setAlertaEditando({
    ...alertaEditando,
    estado: e.target.value
    })
  }
/>
  <button
    className="btn-guardar"
    onClick={guardarEdicionAlerta}
>
  Guardar cambios
  </button>
  </div>
)}
  <table className="tabla-datos">
    <thead>
    <tr>
    <th>ID</th>
    <th>Mensaje</th>
    <th>Estado</th>
    <th>Acciones</th>
    </tr>
    </thead>
    <tbody>
{alertas.map((alerta) => (
    <tr key={alerta.id}>
    <td>{alerta.id}</td>
    <td>{alerta.mensaje}</td>
    <td>{alerta.estado}</td>
    <td>
  <button
  className="btn-editar"
  onClick={() => setAlertaEditando(alerta)}
>
  Editar
  </button>
  <button
  className="btn-eliminar"
  onClick={() => eliminarAlerta(alerta.id)}
>
  Eliminar
  </button>
  </td>
  </tr>
))}
  </tbody>
  </table>
  </div>
)}
{vistaActual === 'normativas' && (
<div className="card">
<h2>Gestión de normativas</h2>
  <button
   className="btn-nuevo"
   onClick={() => setMostrarFormularioNuevaNormativa(true)}
>
  Nueva normativa
  </button>
{mostrarFormularioNuevaNormativa && (
<div className="formulario-edicion">
  <h3>Nueva normativa</h3>
<div className="fila-nueva-obligacion">
  <input
    type="text"
    placeholder="Nombre de la normativa"
    value={nuevaNormativa.nombre}
    onChange={(e) =>
    setNuevaNormativa({
    ...nuevaNormativa,
    nombre: e.target.value
     })
   }
/>
  <input
    type="text"
    placeholder="Tipo de normativa"
    value={nuevaNormativa.tipo}
    onChange={(e) =>
    setNuevaNormativa({
    ...nuevaNormativa,
    tipo: e.target.value
     })
   }
/>
  <input
    type="text"
    placeholder="Organismo emisor"
    value={nuevaNormativa.organismo_emisor}
    onChange={(e) =>
    setNuevaNormativa({
    ...nuevaNormativa,
    organismo_emisor: e.target.value
     })
   }
/>
  <input
    type="date"
    value={nuevaNormativa.fecha_publicacion || ''}
    onChange={(e) =>
    setNuevaNormativa({
    ...nuevaNormativa,
    fecha_publicacion: e.target.value || null
     })
   }
/>
  <select
    value={nuevaNormativa.activa ? 'true' : 'false'}
    onChange={(e) =>
    setNuevaNormativa({
    ...nuevaNormativa,
    activa: e.target.value === 'true'
    })
  }
>
  <option value="true">Activa</option>
  <option value="false">Inactiva</option>
  </select>
</div>
<div className="fila-nueva-obligacion">
  <input
    type="text"
    placeholder="Descripción"
    value={nuevaNormativa.descripcion}
    onChange={(e) =>
    setNuevaNormativa({
    ...nuevaNormativa,
    descripcion: e.target.value
    })
  }
/>
  <input
    type="url"
    placeholder="Hipervínculo"
    value={nuevaNormativa.hipervinculo}
    onChange={(e) =>
    setNuevaNormativa({
    ...nuevaNormativa,
    hipervinculo: e.target.value
    })
  }
/>
  <button
    className="btn-guardar"
    style={{ marginTop: '4px' }}
    onClick={async () => {
  if (!nuevaNormativa.nombre.trim() || !nuevaNormativa.tipo.trim()) {
      alert('Debes ingresar el nombre y el tipo de normativa')
      return
}
  try {
const response = await fetch(`${API_URL}/normativas`, {
    method: 'POST',
  headers: {
  'Content-Type': 'application/json',
  ...encabezadosAuth
},
    body: JSON.stringify(nuevaNormativa)
})
  if (!response.ok) {
  throw new Error('No se pudo guardar la normativa')
}
const responseLista = await fetch(`${API_URL}/normativas`, {
  headers: encabezadosAuth
})
  if (!responseLista.ok) {
  throw new Error('Se guardó, pero no se pudo actualizar la tabla')
}
const data = await responseLista.json()
      setNormativas(data)
      setNuevaNormativa({
        nombre: '',
        tipo: '',
        descripcion: '',
        organismo_emisor: '',
        hipervinculo: '',
        fecha_publicacion: null,
        activa: true
})
      setMostrarFormularioNuevaNormativa(false)
      alert('Normativa guardada correctamente')
    } catch (error) {
      console.error('Error al guardar normativa:', error)
      alert(error.message)
     }
  }}
>
  Guardar normativa
  </button>
  <button
     type="button"
     className="btn-eliminar"
     style={{ marginTop: '4px', marginLeft: '4px' }}
     onClick={() => {
    setMostrarFormularioNuevaNormativa(false)
    setNuevaNormativa({
      nombre: '',
      tipo: '',
      descripcion: '',
      organismo_emisor: '',
      hipervinculo: '',
      fecha_publicacion: null,
      activa: true
     })
  }}
>
  Cancelar
  </button>
</div>
</div>
)}

{normativaEditando && (
<div className="formulario-edicion">
  <h3>Editar normativa</h3>
<div className="fila-nueva-obligacion">
  <input
    type="text"
    placeholder="Nombre de la normativa"
    value={normativaEditando.nombre || ''}
    onChange={(e) =>
    setNormativaEditando({
    ...normativaEditando,
    nombre: e.target.value
     })
   }
/>
  <input
     type="text"
     placeholder="Tipo de normativa"
     value={normativaEditando.tipo || ''}
     onChange={(e) =>
     setNormativaEditando({
     ...normativaEditando,
     tipo: e.target.value
      })
    }
/>
  <input
     type="text"
     placeholder="Organismo emisor"
     value={normativaEditando.organismo_emisor || ''}
     onChange={(e) =>
     setNormativaEditando({
     ...normativaEditando,
     organismo_emisor: e.target.value
     })
   }
/>
  <input
    type="date"
    value={normativaEditando.fecha_publicacion || ''}
    onChange={(e) =>
    setNormativaEditando({
    ...normativaEditando,
    fecha_publicacion: e.target.value || null
     })
   }
/>
  <select
    value={normativaEditando.activa ? 'true' : 'false'}
    onChange={(e) =>
    setNormativaEditando({
    ...normativaEditando,
    activa: e.target.value === 'true'
     })
   }
>
  <option value="true">Activa</option>
  <option value="false">Inactiva</option>
  </select>
</div>
<div className="fila-nueva-obligacion">
  <input
    type="text"
    placeholder="Descripción"
    value={normativaEditando.descripcion || ''}
    onChange={(e) =>
    setNormativaEditando({
    ...normativaEditando,
    descripcion: e.target.value
     })
   }
/>
  <input
    type="url"
    placeholder="Hipervínculo"
    value={normativaEditando.hipervinculo || ''}
    onChange={(e) =>
    setNormativaEditando({
    ...normativaEditando,
    hipervinculo: e.target.value
     })
   }
/>
  <button
    className="btn-guardar"
    style={{ marginTop: '4px' }}
    onClick={async () => {
  if (
      !normativaEditando.nombre.trim() ||
      !normativaEditando.tipo.trim()
) {
      alert('El nombre y el tipo son obligatorios')
      return
}
  try {
const response = await fetch(
  `${API_URL}/normativas/${normativaEditando.id}`,
{
    method: 'PUT',
   headers: {
  'Content-Type': 'application/json',
  ...encabezadosAuth
},
    body: JSON.stringify({
        nombre: normativaEditando.nombre,
        tipo: normativaEditando.tipo,
        descripcion: normativaEditando.descripcion || null,
        organismo_emisor: normativaEditando.organismo_emisor || null,
        hipervinculo: normativaEditando.hipervinculo || null,
        fecha_publicacion: normativaEditando.fecha_publicacion || null,
        activa: normativaEditando.activa
    })
  }
)
  if (!response.ok) {
  throw new Error('No se pudo actualizar la normativa')
}
const responseLista = await fetch(
  `${API_URL}/normativas`,
  { headers: encabezadosAuth }
)
  if (!responseLista.ok) {
  throw new Error(
    'Se actualizó la normativa, pero no se pudo actualizar la tabla'
  )
}
const data = await responseLista.json()
      setNormativas(data)
      setNormativaEditando(null)
      alert('Normativa actualizada correctamente')
    } catch (error) {
      console.error('Error al actualizar normativa:', error)
      alert(error.message)
    }
  }}
>
  Guardar cambios
  </button>
</div>
</div>
)}

<table className="tabla-datos">
  <thead>
    <tr>
    <th>ID</th>
    <th>Nombre</th>
    <th>Tipo</th>
    <th>Estado</th>
    <th>Acciones</th>
    </tr>
    </thead>
    <tbody>
{normativas.map((normativa) => (
    <tr key={normativa.id}>
    <td>{normativa.id}</td>
    <td>{normativa.nombre}</td>
    <td>{normativa.tipo}</td>
    <td>{normativa.activa ? 'Activa' : 'Inactiva'}</td>
    <td>
    <button
      className="btn-editar"
      onClick={() => setNormativaEditando({ ...normativa })}
>
  Editar
  </button>
  <button
    className="btn-eliminar"
    onClick={async () => {
const confirmar = window.confirm(
   `¿Estás seguro de eliminar la normativa "${normativa.nombre}"?`
)
  if (!confirmar) return
  try {
const response = await fetch(
  `${API_URL}/normativas/${normativa.id}`,
  {
    method: 'DELETE',
    headers: encabezadosAuth
  }
)
  if (!response.ok) {
    throw new Error(
        'No se pudo eliminar la normativa. Puede tener registros relacionados.'
  )
}
const responseLista = await fetch(
  `${API_URL}/normativas`,
  { headers: encabezadosAuth }
)
  if (!responseLista.ok) {
    throw new Error(
        'Se eliminó la normativa, pero no se pudo actualizar la tabla'
  )
}
const data = await responseLista.json()
    setNormativas(data)
  if (normativaEditando?.id === normativa.id) {
    setNormativaEditando(null)
}
  alert('Normativa eliminada correctamente')
} catch (error) {
      console.error('Error al eliminar normativa:', error)
      alert(error.message)
    }
  }}
>
  Eliminar
  </button>
    </td>
    </tr>
))}
  </tbody>
  </table>
</div>
)}

{vistaActual === 'departamentos' && (
<div className="card">
  <h2>Gestión de departamentos</h2>
  <p>Aquí se administrarán los departamentos de la empresa.</p>
  <button
    className="btn-nuevo"
    onClick={() => setMostrarFormularioNuevoDepartamento(true)}
>
  Nuevo departamento
  </button>
{mostrarFormularioNuevoDepartamento && (
<div className="formulario-edicion">
  <h3>Nuevo departamento</h3>
<div className="fila-nueva-obligacion">
  <label>Nombre</label>
<input
  type="text"
  placeholder="Nombre del departamento"
  value={nuevoDepartamento.nombre}
  onChange={(e) =>
      setNuevoDepartamento({
      ...nuevoDepartamento,
      nombre: e.target.value
     })
   }
/>
  <label>Descripción</label>
  <input
    type="text"
    placeholder="Descripción del departamento"
    value={nuevoDepartamento.descripcion}
    onChange={(e) =>
      setNuevoDepartamento({
      ...nuevoDepartamento,
      descripcion: e.target.value
     })
   }
/>
  <label>Estado</label>
  <select
    value={nuevoDepartamento.activo ? 'true' : 'false'}
    onChange={(e) =>
        setNuevoDepartamento({
        ...nuevoDepartamento,
        activo: e.target.value === 'true'
    })
  }
>
  <option value="true">Activo</option>
  <option value="false">Inactivo</option>
  </select>
<div className="botones-formulario">
  <button
    className="btn-guardar"
    style={{ marginTop: '4px' }}
    onClick={crearDepartamento}
>
  Guardar departamento
  </button>
  <button
      className="btn-eliminar"
      style={{ marginTop: '4px' }}
      onClick={() => {
      setMostrarFormularioNuevoDepartamento(false)
      setNuevoDepartamento({
            nombre: '',
            descripcion: '',
            activo: true
     })
  }}
>
  Cancelar
  </button>
</div>
</div>
</div>
)}

{departamentoEditando && (
<div className="formulario-edicion">
  <h3>Editar departamento</h3>
<div className="fila-nueva-obligacion">
  <label>Nombre</label>
  <input
    type="text"
    value={departamentoEditando.nombre || ''}
    onChange={(e) =>
    setDepartamentoEditando({
    ...departamentoEditando,
    nombre: e.target.value
     })
   }
/>
  <label>Descripción</label>
  <input
    type="text"
    value={departamentoEditando.descripcion || ''}
    onChange={(e) =>
        setDepartamentoEditando({
        ...departamentoEditando,
        descripcion: e.target.value
     })
   }
/>
  <label>Estado</label>
  <select
      value={departamentoEditando.activo ? 'true' : 'false'}
      onChange={(e) =>
          setDepartamentoEditando({
          ...departamentoEditando,
          activo: e.target.value === 'true'
    })
  }
>
  <option value="true">Activo</option>
  <option value="false">Inactivo</option>
  </select>
  <button
    className="btn-guardar"
    style={{ marginTop: '4px' }}
    onClick={guardarEdicionDepartamento}
>
  Guardar cambios
   </button>
</div>
</div>
)}
  <table className="tabla-datos">
  <thead>
    <tr>
    <th>ID</th>
    <th>Departamento</th>
    <th>Acciones</th>
    </tr>
    </thead>
    <tbody>
{departamentos.map((departamento) => (
    <tr key={departamento.id}>
    <td>{departamento.id}</td>
    <td>{departamento.nombre}</td>
    <td>
  <button
     className="btn-editar"
     onClick={() => setDepartamentoEditando(departamento)}
>
  Editar
  </button>
  <button
     className="btn-eliminar"
     onClick={() => eliminarDepartamento(departamento.id)}
>
  Eliminar
  </button>
  </td>
  </tr>
))}
   </tbody>
   </table>
</div>
)}
{vistaActual === 'evidencias' && (
<div className="card">
  <h2>Gestión de evidencias</h2>
  <p>Aquí se administrarán las evidencias de cumplimiento normativo.</p>
  <button
    className="btn-nuevo"
    onClick={() => setMostrarFormularioNuevaEvidencia(true)}
>
  Nueva evidencia
  </button>
{mostrarFormularioNuevaEvidencia && (
  <div className="formulario-edicion">
    <h3>Nueva evidencia</h3>
    <div className="fila-nueva-obligacion">
    <label>Obligación</label>
    <select
      value={nuevaEvidencia.obligacion_id ?? ''}
      onChange={(e) =>
         setNuevaEvidencia({
         ...nuevaEvidencia,
         obligacion_id: e.target.value
           ? Number(e.target.value)
             : null
    })
  }
>
  <option value="">Selecciona una obligación</option>
{obligaciones.map((obligacion) => (
  <option key={obligacion.id} value={obligacion.id}>
    {obligacion.nombre}
  </option>
))}
  </select>
  <label>Auditoría</label>
  <select
    value={nuevaEvidencia.auditoria_id ?? ''}
    onChange={(e) =>
    setNuevaEvidencia({
      ...nuevaEvidencia,
      auditoria_id: e.target.value
        ? Number(e.target.value)
        : null
    })
  }
>
  <option value="">Selecciona una auditoría</option>
{auditorias.map((auditoria) => (
  <option key={auditoria.id} value={auditoria.id}>
    {auditoria.nombre}
  </option>
))}
  </select>
  <label>Control</label>
  <select
    value={nuevaEvidencia.control_id ?? ''}
    onChange={(e) =>
    setNuevaEvidencia({
      ...nuevaEvidencia,
      control_id: e.target.value
        ? Number(e.target.value)
        : null
    })
  }
>
  <option value="">Selecciona un control</option>
{controles.map((control) => (
  <option key={control.id} value={control.id}>
    {control.nombre}
  </option>
))}
  </select>
  <label>Nombre</label>
  <input
      type="text"
      placeholder="Nombre de la evidencia"
      value={nuevaEvidencia.nombre}
      onChange={(e) =>
        setNuevaEvidencia({
        ...nuevaEvidencia,
        nombre: e.target.value
     })
   }
/>
  <label>Tipo</label>
  <input
      type="text"
      placeholder="Ej. PDF, Informe, Acta"
      value={nuevaEvidencia.tipo}
      onChange={(e) =>
        setNuevaEvidencia({
        ...nuevaEvidencia,
        tipo: e.target.value
     })
   }
/>
  <label>Ubicación</label>
  <input
      type="text"
      placeholder="Ruta o enlace del documento"
      value={nuevaEvidencia.ubicacion}
      onChange={(e) =>
        setNuevaEvidencia({
        ...nuevaEvidencia,
        ubicacion: e.target.value
     })
   }
/>
  <label>Descripción</label>
  <input
      type="text"
      placeholder="Descripción de la evidencia"
      value={nuevaEvidencia.descripcion}
      onChange={(e) =>
      setNuevaEvidencia({
      ...nuevaEvidencia,
      descripcion: e.target.value
     })
   }
/>
  <label>Fecha</label>
  <input
      type="date"
      value={nuevaEvidencia.fecha_documento}
      onChange={(e) =>
        setNuevaEvidencia({
        ...nuevaEvidencia,
        fecha_documento: e.target.value
     })
   }
/>
  <label>Estado</label>
  <select
    value={nuevaEvidencia.estado}
    onChange={(e) =>
       setNuevaEvidencia({
      ...nuevaEvidencia,
      estado: e.target.value
     })
   }
>
  <option value="Pendiente">Pendiente</option>
  <option value="En revisión">En revisión</option>
  <option value="Aprobada">Aprobada</option>
  <option value="Rechazada">Rechazada</option>
  </select>
  <button
    className="btn-guardar"
    onClick={crearEvidencia}
>
  Guardar evidencia
  </button>
  <button
      className="btn-eliminar"
      onClick={() => setMostrarFormularioNuevaEvidencia(false)}
>
  Cancelar
  </button>
</div>
</div>
)}

{evidenciaEditando && (
<div className="formulario-edicion">
  <h3>Editar evidencia</h3>
<div className="fila-nueva-obligacion">
  <label>Nombre</label>
  <input
    type="text"
    value={evidenciaEditando.nombre || ''}
    onChange={(e) =>
      setEvidenciaEditando({
      ...evidenciaEditando,
      nombre: e.target.value
     })
   }
/>
  <label>Tipo</label>
  <input
     type="text"
     value={evidenciaEditando.tipo || ''}
     onChange={(e) =>
        setEvidenciaEditando({
        ...evidenciaEditando,
        tipo: e.target.value
      })
   }
/>
  <label>Ubicación</label>
  <input
      type="text"
      value={evidenciaEditando.ubicacion || ''}
      onChange={(e) =>
         setEvidenciaEditando({
          ...evidenciaEditando,
          ubicacion: e.target.value
     })
   }
/>
  <label>Descripción</label>
  <input
    type="text"
    value={evidenciaEditando.descripcion || ''}
    onChange={(e) =>
        setEvidenciaEditando({
        ...evidenciaEditando,
        descripcion: e.target.value
     })
   }
/>
  <label>Fecha</label>
  <input
      type="date"
      value={evidenciaEditando.fecha_documento || ''}
      onChange={(e) =>
        setEvidenciaEditando({
        ...evidenciaEditando,
        fecha_documento: e.target.value
     })
   }
/>
  <label>Estado</label>
  <select
      value={evidenciaEditando.estado || 'Pendiente'}
      onChange={(e) =>
        setEvidenciaEditando({
        ...evidenciaEditando,
          estado: e.target.value
    })
  }
>
  <option value="Pendiente">Pendiente</option>
  <option value="En revisión">En revisión</option>
  <option value="Aprobada">Aprobada</option>
  <option value="Rechazada">Rechazada</option>
  </select>
  <button
    className="btn-guardar"
    onClick={guardarEdicionEvidencia}
>
  Guardar cambios
  </button>
</div>
</div>
)}
  <table className="tabla-datos">
  <thead>
    <tr>
    <th>ID</th>
    <th>Nombre</th>
    <th>Tipo</th>
    <th>Estado</th>
    <th>Acciones</th>
    </tr>
    </thead>
    <tbody>
{evidencias.map((evidencia) => (
     <tr key={evidencia.id}>
     <td>{evidencia.id}</td>
     <td>{evidencia.nombre}</td>
     <td>{evidencia.tipo}</td>
     <td>{evidencia.estado}</td>
     <td>
    <button
      className="btn-editar"
      onClick={() => setEvidenciaEditando(evidencia)}
>
  Editar
  </button>
  <button
    className="btn-eliminar"
    onClick={() => eliminarEvidencia(evidencia.id)}
>
  Eliminar
  </button>
    </td>
    </tr>
))}
  </tbody>
  </table>
</div>
)}

{vistaActual === 'indicadores' && (
<div className="card">
  <h2>Gestión de indicadores</h2>
  <p>Aquí se administrarán los indicadores de cumplimiento.</p>
  <button
    className="btn-nuevo"
    onClick={() => setMostrarFormularioNuevoIndicador(true)}
>
  Nuevo indicador
  </button>
  {mostrarFormularioNuevoIndicador && (
  <div className="formulario-edicion">
    <h3>Nuevo indicador</h3>
  <div className="fila-nueva-obligacion">
  <label>Nombre</label>
  <input
      type="text"
      placeholder="Nombre del indicador"
      value={nuevoIndicador.nombre}
      onChange={(e) =>
        setNuevoIndicador({
        ...nuevoIndicador,
        nombre: e.target.value
     })
   }
/>
  <label>Descripción</label>
  <input
      type="text"
      placeholder="Descripción"
      value={nuevoIndicador.descripcion}
      onChange={(e) =>
        setNuevoIndicador({
        ...nuevoIndicador,
        descripcion: e.target.value
     })
   }
/>
  <label>Categoría</label>
  <input
      type="text"
      placeholder="Categoría"
      value={nuevoIndicador.categoria}
      onChange={(e) =>
        setNuevoIndicador({
        ...nuevoIndicador,
        categoria: e.target.value
     })
   }
/>
  <label>Valor</label>
  <input
      type="number"
      step="any"
      value={nuevoIndicador.valor}
      onChange={(e) =>
        setNuevoIndicador({
        ...nuevoIndicador,
        valor: e.target.value === '' ? '' : Number(e.target.value)
     })
   }
/>
  <label>Unidad</label>
  <input
      type="text"
      placeholder="Ej. %"
      value={nuevoIndicador.unidad}
      onChange={(e) =>
        setNuevoIndicador({
        ...nuevoIndicador,
        unidad: e.target.value
     })
   }
/>
  <label>Periodo inicio</label>
  <input
      type="date"
      value={nuevoIndicador.periodo_inicio}
      onChange={(e) =>
        setNuevoIndicador({
        ...nuevoIndicador,
        periodo_inicio: e.target.value
    })
  }
/>
  <label>Periodo fin</label>
  <input
      type="date"
      value={nuevoIndicador.periodo_fin}
      onChange={(e) =>
        setNuevoIndicador({
        ...nuevoIndicador,
        periodo_fin: e.target.value
      })
    }
/>
<div className="botones-formulario">
<button
  className="btn-guardar"
  type="button"
  onClick={crearIndicador}
>
  Guardar indicador
</button>
  <button
    className="btn-eliminar"
    type="button"
    onClick={() => setMostrarFormularioNuevoIndicador(false)}
>
  Cancelar
  </button>
</div>
</div>
</div>
)}
{indicadorEditando && (
<div className="formulario-edicion">
    <h3>Editar indicador</h3>
<div className="fila-nueva-obligacion">
  <label>Nombre</label>
  <input
      type="text"
      value={indicadorEditando.nombre || ''}
      onChange={(e) =>
        setIndicadorEditando({
        ...indicadorEditando,
        nombre: e.target.value
     })
   }
/>
  <label>Descripción</label>
  <input
      type="text"
      value={indicadorEditando.descripcion || ''}
      onChange={(e) =>
        setIndicadorEditando({
        ...indicadorEditando,
        descripcion: e.target.value
     })
   }
/>
  <label>Categoría</label>
  <input
      type="text"
      value={indicadorEditando.categoria || ''}
      onChange={(e) =>
        setIndicadorEditando({
        ...indicadorEditando,
        categoria: e.target.value
     })
   }
/>
  <label>Valor</label>
  <input
      type="number"
      step="any"
      value={indicadorEditando.valor ?? ''}
      onChange={(e) =>
        setIndicadorEditando({
        ...indicadorEditando,
        valor: e.target.value === '' ? '' : Number(e.target.value)
     })
   }
/>
  <label>Unidad</label>
  <input
      type="text"
      value={indicadorEditando.unidad || ''}
      onChange={(e) =>
        setIndicadorEditando({
        ...indicadorEditando,
        unidad: e.target.value
     })
   }
/>
  <label>Periodo inicio</label>
  <input
      type="date"
      value={indicadorEditando.periodo_inicio || ''}
      onChange={(e) =>
        setIndicadorEditando({
        ...indicadorEditando,
        periodo_inicio: e.target.value
     })
   }
/>
  <label>Periodo fin</label>
  <input
      type="date"
      value={indicadorEditando.periodo_fin || ''}
      onChange={(e) =>
        setIndicadorEditando({
        ...indicadorEditando,
        periodo_fin: e.target.value
     })
   }
/>
<div className="botones-formulario">
 <button
  className="btn-guardar"
  type="button"
  onClick={actualizarIndicador}
>
  Guardar cambios
</button>
</div>
</div>
</div>
)}
  <table className="tabla-datos">
  <thead>
  <tr>
  <th>ID</th>
  <th>Nombre</th>
  <th>Descripción</th>
  <th>Categoría</th>
  <th>Valor</th>
  <th>Unidad</th>
  <th>Periodo inicio</th>
  <th>Periodo fin</th>
  <th>Acciones</th>
  </tr>
  </thead>
  <tbody>
{indicadores.map((indicador) => (
  <tr key={indicador.id}>
  <td>{indicador.id}</td>
  <td>{indicador.nombre}</td>
  <td>{indicador.descripcion}</td>
  <td>{indicador.categoria}</td>
  <td>{indicador.valor}</td>
  <td>{indicador.unidad}</td>
  <td>{indicador.periodo_inicio}</td>
  <td>{indicador.periodo_fin}</td>
  <td>
<div
    style={{
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      flexWrap: 'nowrap'
    }}
  >
  <button
      className="btn-editar"
      onClick={() => setIndicadorEditando(indicador)}
>
  Editar
  </button>
  <button
    className="btn-eliminar"
    onClick={() => eliminarIndicador(indicador.id)}
>
  Eliminar
  </button>
</div>
  </td>
  </tr>
))}
  </tbody>
  </table>
</div>
)}
{vistaActual === 'roles' && (
<div className="card">
  <h2>Gestión de roles</h2>
  <p>Aquí se administrarán los roles de los usuarios del sistema.</p>
  <button
  className="btn-nuevo"
  onClick={() => setMostrarFormularioNuevoRol(true)}
>
  Nuevo rol
</button>
{mostrarFormularioNuevoRol && (
<div className="formulario-edicion">
  <h3>Nuevo rol</h3>
<div className="fila-nueva-obligacion">
  <label>Nombre</label>
  <input
      type="text"
      placeholder="Nombre del rol"
      value={nuevoRol.nombre}
      onChange={(e) =>
        setNuevoRol({
        ...nuevoRol,
        nombre: e.target.value
     })
   }
/>
  <label>Descripción</label>
  <input
      type="text"
      placeholder="Descripción del rol"
      value={nuevoRol.descripcion}
      onChange={(e) =>
        setNuevoRol({
        ...nuevoRol,
        descripcion: e.target.value
     })
   }
/>
<div className="botones-formulario">
 <button
  className="btn-guardar"
  type="button"
  onClick={crearRol}
>
  Guardar rol
</button>
  <button
    className="btn-eliminar"
    onClick={() => setMostrarFormularioNuevoRol(false)}
>
  Cancelar
  </button>
</div>
</div>
</div>
)}
{rolEditando && (
<div className="formulario-edicion">
  <h3>Editar rol</h3>
<div className="fila-nueva-obligacion">
  <label>Nombre</label>
  <input
      type="text"
      value={rolEditando.nombre || ''}
      onChange={(e) =>
        setRolEditando({
         ...rolEditando,
         nombre: e.target.value
     })
   }
/>
  <label>Descripción</label>
  <input
      type="text"
      value={rolEditando.descripcion || ''}
      onChange={(e) =>
        setRolEditando({
        ...rolEditando,
        descripcion: e.target.value
     })
   }
/>
<div className="botones-formulario">
<button
  className="btn-guardar"
  type="button"
  onClick={guardarEdicionRol}
>
  Guardar cambios
  </button>
</div>
</div>
</div>
)}
<table className="tabla-datos">
 <thead>
  <tr>
  <th>ID</th>
  <th>Nombre</th>
  <th>Descripción</th>
  <th>Acciones</th>
  </tr>
  </thead>
  <tbody>
{roles.map((rol) => (
  <tr key={rol.id}>
  <td>{rol.id}</td>
  <td>{rol.nombre}</td>
  <td>{rol.descripcion}</td>
  <td>
<div style={{
      display: 'flex',
       gap: '8px',
      alignItems: 'center',
      flexWrap: 'nowrap'
}}>
  <button
      className="btn-editar"
      onClick={() => setRolEditando(rol)}
>
  Editar
  </button>
 <button
  className="btn-eliminar"
  onClick={() => eliminarRol(rol.id)}
>
  Eliminar
  </button>
</div>
  </td>
  </tr>
))}
  </tbody>
  </table>
</div>
)}
{vistaActual === 'usuarios' && (
<div className="card">
  <h2>Gestión de usuarios</h2>
  <p>Aquí se administrarán los usuarios registrados en el sistema.</p>
  <button
  className="btn-nuevo"
  onClick={() => setMostrarFormularioNuevoUsuario(true)}
>
  Nuevo usuario
  </button>
  {mostrarFormularioNuevoUsuario && (
<div className="formulario-edicion">
  <h3>Registrar nuevo usuario</h3>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
  <label>Nombre</label>
  <input
    type="text"
    value={nuevoUsuario.nombre}
    onChange={(e) =>
        setNuevoUsuario({
        ...nuevoUsuario,
        nombre: e.target.value
     })
   }
/>
  <label>Correo electrónico</label>
  <input
    type="email"
    value={nuevoUsuario.correo}
    onChange={(e) =>
        setNuevoUsuario({
        ...nuevoUsuario,
        correo: e.target.value
     })
   }
/>
  <label>ID de Microsoft Entra</label>
  <input
    type="text"
    value={nuevoUsuario.entra_id}
    onChange={(e) =>
      setNuevoUsuario({
      ...nuevoUsuario,
      entra_id: e.target.value
    })
  }
/>
  <label>Rol</label>
  <select
    value={nuevoUsuario.rol_id ?? ''}
    onChange={(e) =>
      setNuevoUsuario({
      ...nuevoUsuario,
      rol_id: e.target.value === '' ? null : Number(e.target.value)
    })
  }
>
  <option value="">Selecciona un rol</option>
  {roles.map((rol) => (
    <option key={rol.id} value={rol.id}>
      {rol.nombre}
    </option>
  ))}
  </select>
  <label>Departamento</label>
  <select
    value={nuevoUsuario.departamento_id ?? ''}
    onChange={(e) =>
      setNuevoUsuario({
      ...nuevoUsuario,
      departamento_id: e.target.value === '' ? null : Number(e.target.value)
    })
  }
>
  <option value="">Selecciona un departamento</option>
  {departamentos.map((departamento) => (
    <option key={departamento.id} value={departamento.id}>
      {departamento.nombre}
    </option>
  ))}
  </select>
  <label>Estado</label>
  <select
    value={nuevoUsuario.activo ? 'activo' : 'inactivo'}
    onChange={(e) =>
      setNuevoUsuario({
      ...nuevoUsuario,
      activo: e.target.value === 'activo'
    })
  }
>
  <option value="activo">Activo</option>
  <option value="inactivo">Inactivo</option>
  </select>
<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
  <button
    className="btn-guardar"
    onClick={crearUsuario}
  >
    Guardar usuario
  </button>
  <button
    className="btn-eliminar"
    onClick={() => setMostrarFormularioNuevoUsuario(false)}
>
  Cancelar
  </button>
</div>
</div>
</div>
)}
{usuarioEditando && (
<div className="formulario-edicion">
  <h3>Editar usuario</h3>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
  <label>Nombre</label>
  <input
      type="text"
      value={usuarioEditando.nombre || ''}
      onChange={(e) =>
        setUsuarioEditando({
        ...usuarioEditando,
        nombre: e.target.value
     })
   }
/>
  <label>Correo electrónico</label>
  <input
      type="email"
      value={usuarioEditando.correo || ''}
      onChange={(e) =>
        setUsuarioEditando({
        ...usuarioEditando,
        correo: e.target.value
    })
  }
/>
  <label>ID de Microsoft Entra</label>
  <input
    type="text"
    value={usuarioEditando.entra_id || ''}
    onChange={(e) =>
      setUsuarioEditando({
      ...usuarioEditando,
      entra_id: e.target.value
    })
  }
/>
  <label>Rol</label>
  <select
     value={usuarioEditando.rol_id ?? ''}
    onChange={(e) =>
      setUsuarioEditando({
      ...usuarioEditando,
      rol_id: e.target.value === '' ? null : Number(e.target.value)
    })
  }
>
  <option value="">Selecciona un rol</option>
  {roles.map((rol) => (
  <option key={rol.id} value={rol.id}>
      {rol.nombre}
  </option>
))}
  </select>
  <label>Departamento</label>
  <select
    value={usuarioEditando.departamento_id ?? ''}
    onChange={(e) =>
      setUsuarioEditando({
      ...usuarioEditando,
      departamento_id: e.target.value === '' ? null : Number(e.target.value)
    })
  }
>
  <option value="">Selecciona un departamento</option>
  {departamentos.map((departamento) => (
  <option key={departamento.id} value={departamento.id}>
      {departamento.nombre}
  </option>
))}
  </select>
  <label>Estado</label>
  <select
    value={usuarioEditando.activo ? 'activo' : 'inactivo'}
    onChange={(e) =>
      setUsuarioEditando({
      ...usuarioEditando,
      activo: e.target.value === 'activo'
    })
  }
>
  <option value="activo">Activo</option>
  <option value="inactivo">Inactivo</option>
  </select>
  <button
    className="btn-guardar"
    style={{ marginLeft: '8px' }}
    onClick={actualizarUsuario}
>
  Guardar cambios
  </button>
</div>
</div>
)}
  <h3>Lista de usuarios registrados</h3>
  <table
  className="tabla"
  style={{
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  }}
>
  <thead style={{ backgroundColor: '#f3f4f6' }}>
  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
  <th>ID</th>
  <th>Nombre</th>
  <th>Correo</th>
  <th>Rol</th>
  <th>Departamento</th>
  <th>Estado</th>
  <th>Acciones</th>
  </tr>
  </thead>
  <tbody>
{usuarios.map((usuario) => (
  <tr key={usuario.id}>
  <td>{usuario.id}</td>
  <td>{usuario.nombre}</td>
  <td>{usuario.correo}</td>
  <td>{usuario.rol_id}</td>
  <td>{usuario.departamento_id}</td>
  <td>{usuario.activo ? 'Activo' : 'Inactivo'}</td>
  <td>
  <button
    className="btn-editar"
    onClick={() => {
     setUsuarioEditando({ ...usuario })
     setMostrarFormularioNuevoUsuario(false)
}}
  >
  Editar
  </button>
  <button
    className="btn-eliminar"
    onClick={() => eliminarUsuario(usuario.id)}
  >
    Eliminar
  </button>
</td>
  </tr>
))}
  </tbody>
  </table>
</div>
)}

  </main>
</div>
)
}
export default App