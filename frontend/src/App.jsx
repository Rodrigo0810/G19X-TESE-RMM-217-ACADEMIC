import { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import Obligaciones from './components/Obligaciones.jsx'
import Normativas from './components/Normativas.jsx'
import Notificacion from './components/Notificacion.jsx'
import './App.css'
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function App() {
const [notificacion, setNotificacion] = useState(null)

const mostrarNotificacion = (mensaje, tipo = 'info') => {
  setNotificacion({ mensaje, tipo })
}

const cerrarNotificacion = () => {
  setNotificacion(null)
}
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
  contrasena: '',
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
const [fechaReferencia] = useState(() => new Date())
const [token, setToken] = useState(null)
const [esAdministrador, setEsAdministrador] = useState(false)
const [puedeEditar, setPuedeEditar] = useState(false)
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
  estado: 'Pendiente',
  obligacion_id: null
})
const [mostrarFormularioNuevoRiesgo, setMostrarFormularioNuevoRiesgo] = useState(false)
const [nuevoRiesgo, setNuevoRiesgo] = useState({
  nombre: '',
  nivel: 'Bajo',
  estado: 'Abierto',
  obligacion_id: null
})
const [mostrarFormularioNuevoControl, setMostrarFormularioNuevoControl] = useState(false)
const [nuevoControl, setNuevoControl] = useState({
  nombre: '',
  estado: 'Pendiente',
  obligacion_id: null
})
const [mostrarFormularioNuevaAuditoria, setMostrarFormularioNuevaAuditoria] = useState(false)
const [nuevaAuditoria, setNuevaAuditoria] = useState({
  nombre: '',
  estado: 'Programada'
})
const [mostrarFormularioNuevo, setMostrarFormularioNuevo] = useState(false)
const [nuevaObligacion, setNuevaObligacion] = useState({
  nombre: '',
  estado: 'Pendiente',
  departamento_id: null,
  normativa_id: null,
  fecha_limite: '',
  responsable: ''
})
useEffect(() => {
if (!token) return
const encabezadosAuth = { Authorization: `Bearer ${token}` }
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
if (esAdministrador) {
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
}
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
}, [token, esAdministrador])
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
const respuestaPerfil = await fetch(`${API_URL}/auth/verificar`, {
  headers: {
    Authorization: `Bearer ${datos.access_token}`
  }
})
if (!respuestaPerfil.ok) {
  setErrorLogin('No se pudieron verificar los permisos del usuario')
  return
}
const perfil = await respuestaPerfil.json()
setEsAdministrador(perfil.es_administrador === true)
const rolActual = (perfil.rol || '').trim().toLowerCase()
setPuedeEditar(['administrador', 'compliance'].includes(rolActual))
setToken(datos.access_token)
setContrasenaLogin('')
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    setErrorLogin('No se pudo conectar con el servidor')
  }
}
const cerrarSesion = () => {
  setToken(null)
  setEsAdministrador(false)
  setPuedeEditar(false)
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
    mostrarNotificacion('Obligación eliminada correctamente', 'exito')
  } catch (error) {
    console.error(error)
    mostrarNotificacion('Ocurrió un error al eliminar la obligación', 'error')
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
mostrarNotificacion('Auditoría eliminada correctamente', 'exito')
  } catch (error) {
    console.error(error)
    mostrarNotificacion('Ocurrió un error al eliminar la auditoría', 'error')
  }
}
const crearObligacion = async () => {
  if (!nuevaObligacion.nombre.trim()) {
    mostrarNotificacion('Por favor, escribe el nombre de la obligación', 'info')
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
    body: JSON.stringify({
      ...nuevaObligacion,
      fecha_limite: nuevaObligacion.fecha_limite || null
    })
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
      estado: 'Pendiente',
      departamento_id: null,
      normativa_id: null,
  fecha_limite: '',
  responsable: ''
})
    setMostrarFormularioNuevo(false)
    mostrarNotificacion('Obligación registrada correctamente', 'exito')
  } catch (error) {
    console.error('Error al crear obligación:', error)
    mostrarNotificacion('No se pudo registrar la obligación. Revisa la consola.', 'error')
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
    body: JSON.stringify({
      ...obligacionEditando,
      fecha_limite: obligacionEditando.fecha_limite || null
    })
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
    mostrarNotificacion('Obligación actualizada correctamente', 'exito')
  } catch (error) {
  console.error(error)
    mostrarNotificacion('Ocurrió un error al actualizar la obligación', 'error')
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
    mostrarNotificacion('Auditoría actualizada correctamente', 'exito')
  } catch (error) {
    console.error('Error al actualizar auditoría:', error)
    mostrarNotificacion('Ocurrió un error al actualizar la auditoría', 'error')
  }
}
const crearAuditoria = async () => {
  if (!nuevaAuditoria.nombre.trim()) {
    mostrarNotificacion('Escribe el nombre de la auditoría', 'info')
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
    mostrarNotificacion('Auditoría creada correctamente', 'exito')
  } catch (error) {
    console.error('Error al crear auditoría:', error)
    mostrarNotificacion('Ocurrió un error al crear la auditoría', 'error')
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
    mostrarNotificacion('Control actualizado correctamente', 'exito')
  } catch (error) {
    console.error('Error al actualizar control:', error)
    mostrarNotificacion('Ocurrió un error al actualizar el control', 'error')
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
  mostrarNotificacion('Control eliminado correctamente', 'exito')
  } catch (error) {
  console.error('Error al eliminar control:', error)
  mostrarNotificacion(error.message, 'error')
}
}
const crearControl = async () => {
  if (!nuevoControl.nombre.trim()) {
    mostrarNotificacion('Escribe el nombre del control', 'info')
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
      estado: 'Pendiente',
      obligacion_id: null
})
  setMostrarFormularioNuevoControl(false)
    mostrarNotificacion('Control creado correctamente', 'exito')
  } catch (error) {
    console.error('Error al crear control:', error)
    mostrarNotificacion('Ocurrió un error al crear el control', 'error')
  }
}
const guardarEdicionRiesgo = async () => {
  if (!riesgoEditando) {
    return
}
  if (!riesgoEditando.nombre.trim()) {
    mostrarNotificacion('Escribe el nombre del riesgo', 'info')
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
    mostrarNotificacion('Riesgo actualizado correctamente', 'exito')
  } catch (error) {
    console.error('Error al actualizar riesgo:', error)
    mostrarNotificacion('Ocurrió un error al actualizar el riesgo', 'error')
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
    mostrarNotificacion('Riesgo eliminado correctamente', 'exito')
  } catch (error) {
    console.error('Error al eliminar riesgo:', error)
    mostrarNotificacion(error.message, 'error')
  }
}
const crearRiesgo = async () => {
  if (!nuevoRiesgo.nombre.trim()) {
    mostrarNotificacion('Escribe el nombre del riesgo', 'info')
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
      estado: 'Abierto',
      obligacion_id: null
})
    setMostrarFormularioNuevoRiesgo(false)
    mostrarNotificacion('Riesgo creado correctamente', 'exito')
  } catch (error) {
    console.error('Error al crear riesgo:', error)
    mostrarNotificacion('Ocurrió un error al crear el riesgo', 'error')
  }
}
const guardarEdicionAlerta = async () => {
  if (!alertaEditando) return
  if (!alertaEditando.mensaje.trim()) {
    mostrarNotificacion('Escribe el mensaje de la alerta', 'info')
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
    mostrarNotificacion('Alerta actualizada correctamente', 'exito')
  } catch (error) {
    console.error('Error al actualizar alerta:', error)
    mostrarNotificacion('Ocurrió un error al actualizar la alerta', 'error')
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
    mostrarNotificacion('Alerta eliminada correctamente', 'exito')
  } catch (error) {
    console.error('Error al eliminar alerta:', error)
    mostrarNotificacion(error.message, 'error')
  }
}
const crearAlerta = async () => {
  if (!nuevaAlerta.mensaje.trim()) {
    mostrarNotificacion('Escribe el mensaje de la alerta', 'info')
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
      mensaje: '',
      estado: 'Pendiente',
      obligacion_id: null
    })
    setMostrarFormularioNuevaAlerta(false)
    mostrarNotificacion('Alerta creada correctamente', 'exito')
  } catch (error) {
    console.error('Error al crear alerta:', error)
    mostrarNotificacion('Ocurrió un error al crear la alerta', 'error')
  }
}
const crearDepartamento = async () => {
  if (!nuevoDepartamento.nombre.trim()) {
    mostrarNotificacion('Escribe el nombre del departamento', 'info')
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
    mostrarNotificacion('Departamento registrado correctamente', 'exito')
  } catch (error) {
    console.error('Error al crear departamento:', error)
    mostrarNotificacion('Ocurrió un error al registrar el departamento', 'error')
  }
}
const guardarEdicionDepartamento = async () => {
  if (!departamentoEditando) return
  if (!departamentoEditando.nombre.trim()) {
    mostrarNotificacion('Escribe el nombre del departamento', 'info')
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
    mostrarNotificacion('Departamento actualizado correctamente', 'exito')
  } catch (error) {
    console.error('Error al actualizar departamento:', error)
    mostrarNotificacion('No se pudo actualizar el departamento', 'error')
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
    mostrarNotificacion('Indicador eliminado correctamente', 'exito')
  } catch (error) {
    console.error('Error al eliminar indicador:', error)
    mostrarNotificacion('No se pudo eliminar el indicador. Revisa la consola.', 'error')
  }
}
const actualizarIndicador = async () => {
  if (!indicadorEditando) return
  if (!indicadorEditando.nombre.trim()) {
    mostrarNotificacion('Escribe el nombre del indicador', 'info')
    return
  }
  if (
    indicadorEditando.periodo_inicio &&
    indicadorEditando.periodo_fin &&
    indicadorEditando.periodo_fin < indicadorEditando.periodo_inicio
  ) {
    mostrarNotificacion('El periodo fin no puede ser anterior al periodo inicio', 'info')
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
    mostrarNotificacion('Indicador actualizado correctamente', 'exito')
  } catch (error) {
    console.error('Error al actualizar indicador:', error)
    mostrarNotificacion('No se pudo actualizar el indicador. Revisa la consola.', 'error')
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
    mostrarNotificacion('Rol eliminado correctamente', 'exito')
  } catch (error) {
    console.error('Error al eliminar rol:', error)
    mostrarNotificacion(error.message, 'error')
  }
}
const guardarEdicionRol = async () => {
  if (!rolEditando) return
  if (!rolEditando.nombre.trim()) {
    mostrarNotificacion('Escribe el nombre del rol', 'info')
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
    mostrarNotificacion('Rol actualizado correctamente', 'exito')
  } catch (error) {
    console.error('Error al actualizar rol:', error)
    mostrarNotificacion('No se pudo actualizar el rol. Revisa la consola.', 'error')
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
  if (nuevoUsuario.contrasena.length < 12 || nuevoUsuario.contrasena.length > 128) {
    alert('La contraseña debe tener entre 12 y 128 caracteres')
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
      contrasena: '',
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
    mostrarNotificacion('Escribe el nombre del rol', 'info')
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
    mostrarNotificacion('Rol registrado correctamente', 'exito')

  } catch (error) {
    console.error('Error al registrar rol:', error)
    mostrarNotificacion('No se pudo registrar el rol. Revisa la consola.', 'error')
  }
}
const crearIndicador = async () => {
  if (!nuevoIndicador.nombre.trim()) {
    mostrarNotificacion('Escribe el nombre del indicador', 'info')
    return
  }
  if (
    nuevoIndicador.periodo_inicio &&
    nuevoIndicador.periodo_fin &&
    nuevoIndicador.periodo_fin < nuevoIndicador.periodo_inicio
  ) {
    mostrarNotificacion('El periodo fin no puede ser anterior al periodo inicio', 'info')
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
    mostrarNotificacion('Indicador registrado correctamente', 'exito')
  } catch (error) {
    console.error('Error al registrar indicador:', error)
    mostrarNotificacion('No se pudo registrar el indicador. Revisa la consola.', 'error')
  }
}
const crearEvidencia = async () => {
  if (!nuevaEvidencia.nombre.trim()) {
    mostrarNotificacion('Escribe el nombre de la evidencia', 'info')
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
    mostrarNotificacion('Evidencia registrada correctamente', 'exito')
  } catch (error) {
    console.error('Error al registrar evidencia:', error)
    mostrarNotificacion('No se pudo registrar la evidencia. Revisa la consola.', 'error')
  }
}
const guardarEdicionEvidencia = async () => {
  if (!evidenciaEditando) return
  if (!evidenciaEditando.nombre.trim()) {
    mostrarNotificacion('Escribe el nombre de la evidencia', 'info')
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
    mostrarNotificacion('Evidencia actualizada correctamente', 'exito')
  } catch (error) {
    console.error('Error al actualizar evidencia:', error)
    mostrarNotificacion('No se pudo actualizar la evidencia. Revisa la consola.', 'error')
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
    mostrarNotificacion('Evidencia eliminada correctamente', 'exito')
  } catch (error) {
    console.error('Error al eliminar evidencia:', error)
    mostrarNotificacion(error.message, 'error')
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
    mostrarNotificacion('Departamento eliminado correctamente', 'exito')
  } catch (error) {
    console.error('Error al eliminar departamento:', error)
    mostrarNotificacion(error.message, 'error')
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
<Notificacion
  mensaje={notificacion?.mensaje}
  tipo={notificacion?.tipo}
  onCerrar={cerrarNotificacion}
/>
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
 {esAdministrador && (
  <>
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
  </>
)}
</nav>

<main className="dashboard-content">
  {vistaActual === 'dashboard' && (
    <Dashboard
      obligaciones={obligaciones}
      auditorias={auditorias}
      controles={controles}
      riesgos={riesgos}
      alertas={alertas}
      departamentos={departamentos}
      normativas={normativas}
      filtroDepartamento={filtroDepartamento}
      filtroNormativa={filtroNormativa}
      setFiltroDepartamento={setFiltroDepartamento}
      setFiltroNormativa={setFiltroNormativa}
      fechaReferencia={fechaReferencia}
    />
  )}
{vistaActual === 'obligaciones' && (
  <Obligaciones
      obligaciones={obligaciones}
      departamentos={departamentos}
      normativas={normativas}
      puedeEditar={puedeEditar}
      mostrarFormularioNuevo={mostrarFormularioNuevo}
      setMostrarFormularioNuevo={setMostrarFormularioNuevo}
      nuevaObligacion={nuevaObligacion}
      setNuevaObligacion={setNuevaObligacion}
      obligacionEditando={obligacionEditando}
      setObligacionEditando={setObligacionEditando}
      crearObligacion={crearObligacion}
      guardarEdicionObligacion={guardarEdicionObligacion}
      eliminarObligacion={eliminarObligacion}
  />
)}

{vistaActual === 'auditorias' && (
<div className="card">
  <h2>Gestión de auditorías</h2>
  <p>Aquí se administrarán las auditorías de cumplimiento.</p>
  {puedeEditar && (
<button
    className="btn-nuevo"
    onClick={() => setMostrarFormularioNuevaAuditoria(true)}
>
   Nueva auditoría
  </button>
)}
{puedeEditar && mostrarFormularioNuevaAuditoria && (
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
{puedeEditar && auditoriaEditando && (
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
  {puedeEditar && (
<button
   className="btn-editar"
   onClick={() => setAuditoriaEditando(auditoria)}
>
  Editar
  </button>
)}
  {puedeEditar && (
<button
   className="btn-eliminar"
   onClick={() => eliminarAuditoria(auditoria.id)}
>
  Eliminar
  </button>
)}
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
  {puedeEditar && (
<button
   className="btn-nuevo"
   onClick={() => setMostrarFormularioNuevoControl(true)}
>
  Nuevo control
  </button>
)}
{puedeEditar && mostrarFormularioNuevoControl && (
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
  <label>Obligación relacionada</label>
  <select
    value={nuevoControl.obligacion_id ?? ''}
    onChange={(e) =>
      setNuevoControl({
        ...nuevoControl,
        obligacion_id: e.target.value === ''
          ? null
          : Number(e.target.value)
      })
    }
  >
    <option value="">Sin obligación</option>
    {obligaciones.map((obligacion) => (
      <option key={obligacion.id} value={obligacion.id}>
        {obligacion.nombre}
      </option>
    ))}
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

{puedeEditar && controlEditando && (
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
  {puedeEditar && (
<button
   className="btn-editar"
   onClick={() => setControlEditando(control)}
>
  Editar
  </button>
)}
  {puedeEditar && (
<button
   className="btn-eliminar"
   onClick={() => eliminarControl(control.id)}
>
  Eliminar
  </button>
)}
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
  {puedeEditar && (
<button
   className="btn-nuevo"
   onClick={() => setMostrarFormularioNuevoRiesgo(true)}
>
  Nuevo riesgo
  </button>
)}
{puedeEditar && mostrarFormularioNuevoRiesgo && (
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
  <select
    value={nuevoRiesgo.estado}
    onChange={(e) =>
      setNuevoRiesgo({
        ...nuevoRiesgo,
        estado: e.target.value
      })
    }
  >
    <option value="Abierto">Abierto</option>
    <option value="En tratamiento">En tratamiento</option>
    <option value="Mitigado">Mitigado</option>
    <option value="Cerrado">Cerrado</option>
  </select>
  <label>Obligación relacionada</label>
  <select
    value={nuevoRiesgo.obligacion_id ?? ''}
    onChange={(e) =>
      setNuevoRiesgo({
        ...nuevoRiesgo,
        obligacion_id: e.target.value === ''
          ? null
          : Number(e.target.value)
      })
    }
  >
    <option value="">Sin obligación</option>
    {obligaciones.map((obligacion) => (
      <option key={obligacion.id} value={obligacion.id}>
        {obligacion.nombre}
      </option>
    ))}
  </select>
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

{puedeEditar && riesgoEditando && (
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
   {puedeEditar && (
<button
    className="btn-editar"
    onClick={() => setRiesgoEditando(riesgo)}
>
  Editar
  </button>
)}
  {puedeEditar && (
<button
    className="btn-eliminar"
    onClick={() => eliminarRiesgo(riesgo.id)}
>
  Eliminar
  </button>
)}
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
  {puedeEditar && (
<button
    className="btn-nuevo"
   onClick={() => setMostrarFormularioNuevaAlerta(true)}
>
  Nueva alerta
  </button>
)}
{puedeEditar && mostrarFormularioNuevaAlerta && (
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
  <label>Obligación relacionada</label>
  <select
    value={nuevaAlerta.obligacion_id ?? ''}
    onChange={(e) =>
      setNuevaAlerta({
        ...nuevaAlerta,
        obligacion_id: e.target.value === ''
          ? null
          : Number(e.target.value)
      })
    }
  >
    <option value="">Sin obligación</option>
    {obligaciones.map((obligacion) => (
      <option key={obligacion.id} value={obligacion.id}>
        {obligacion.nombre}
      </option>
    ))}
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

{puedeEditar && alertaEditando && (
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
  {puedeEditar && (
<button
  className="btn-editar"
  onClick={() => setAlertaEditando(alerta)}
>
  Editar
  </button>
)}
  {puedeEditar && (
<button
  className="btn-eliminar"
  onClick={() => eliminarAlerta(alerta.id)}
>
  Eliminar
  </button>
)}
  </td>
  </tr>
))}
  </tbody>
  </table>
  </div>
)}
{vistaActual === 'normativas' && (
  <Normativas
    normativas={normativas}
    setNormativas={setNormativas}
    normativaEditando={normativaEditando}
    setNormativaEditando={setNormativaEditando}
    mostrarFormularioNuevaNormativa={mostrarFormularioNuevaNormativa}
    setMostrarFormularioNuevaNormativa={setMostrarFormularioNuevaNormativa}
    nuevaNormativa={nuevaNormativa}
    setNuevaNormativa={setNuevaNormativa}
    puedeEditar={puedeEditar}
    encabezadosAuth={encabezadosAuth}
    mostrarNotificacion={mostrarNotificacion}
  />
)}
{vistaActual === 'departamentos' && (
<div className="card">
  <h2>Gestión de departamentos</h2>
  <p>Aquí se administrarán los departamentos de la empresa.</p>
  {puedeEditar && (
<button
    className="btn-nuevo"
    onClick={() => setMostrarFormularioNuevoDepartamento(true)}
>
  Nuevo departamento
  </button>
)}
{puedeEditar && mostrarFormularioNuevoDepartamento && (
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

{puedeEditar && departamentoEditando && (
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
  {puedeEditar && (
<button
     className="btn-editar"
     onClick={() => setDepartamentoEditando(departamento)}
>
  Editar
  </button>
)}
  {puedeEditar && (
<button
     className="btn-eliminar"
     onClick={() => eliminarDepartamento(departamento.id)}
>
  Eliminar
  </button>
)}
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
  {puedeEditar && (
<button
    className="btn-nuevo"
    onClick={() => setMostrarFormularioNuevaEvidencia(true)}
>
  Nueva evidencia
  </button>
)}
{puedeEditar && mostrarFormularioNuevaEvidencia && (
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

{puedeEditar && evidenciaEditando && (
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
    {puedeEditar && (
<button
      className="btn-editar"
      onClick={() => setEvidenciaEditando(evidencia)}
>
  Editar
  </button>
)}
  {puedeEditar && (
<button
    className="btn-eliminar"
    onClick={() => eliminarEvidencia(evidencia.id)}
>
  Eliminar
  </button>
)}
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
  {puedeEditar && (
<button
    className="btn-nuevo"
    onClick={() => setMostrarFormularioNuevoIndicador(true)}
>
  Nuevo indicador
  </button>
)}
  {puedeEditar && mostrarFormularioNuevoIndicador && (
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
{puedeEditar && indicadorEditando && (
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
  {puedeEditar && (
<button
      className="btn-editar"
      onClick={() => setIndicadorEditando(indicador)}
>
  Editar
  </button>
)}
  {puedeEditar && (
<button
    className="btn-eliminar"
    onClick={() => eliminarIndicador(indicador.id)}
>
  Eliminar
  </button>
)}
</div>
  </td>
  </tr>
))}
  </tbody>
  </table>
</div>
)}
{esAdministrador && vistaActual === 'roles' && (
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
{esAdministrador && vistaActual === 'usuarios' && (
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
<label>Contraseña inicial (12 a 128 caracteres)</label>
<input
  type="password"
  value={nuevoUsuario.contrasena}
  minLength={12}
  maxLength={128}
  autoComplete="new-password"
  onChange={(e) =>
    setNuevoUsuario({ ...nuevoUsuario, contrasena: e.target.value })
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
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'nowrap'
    }}
  >
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
  </div>
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