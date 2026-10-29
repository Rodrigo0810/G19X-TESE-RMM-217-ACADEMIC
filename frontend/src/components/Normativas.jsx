const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function Normativas({
  normativas,
  setNormativas,
  normativaEditando,
  setNormativaEditando,
  mostrarFormularioNuevaNormativa,
  setMostrarFormularioNuevaNormativa,
  nuevaNormativa,
  setNuevaNormativa,
  puedeEditar,
  encabezadosAuth,
  mostrarNotificacion
}) {
  return (
<div className="card">
<h2>Gestión de normativas</h2>
  {puedeEditar && (
<button
   className="btn-nuevo"
   onClick={() => setMostrarFormularioNuevaNormativa(true)}
>
  Nueva normativa
  </button>
)}
{puedeEditar && mostrarFormularioNuevaNormativa && (
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
      mostrarNotificacion('Debes ingresar el nombre y el tipo de normativa', 'info')
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
      mostrarNotificacion('Normativa guardada correctamente', 'exito')
    } catch (error) {
      console.error('Error al guardar normativa:', error)
      mostrarNotificacion(error.message, 'error')
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

{puedeEditar && normativaEditando && (
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
      mostrarNotificacion('El nombre y el tipo son obligatorios', 'info')
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
      mostrarNotificacion('Normativa actualizada correctamente', 'exito')
    } catch (error) {
      console.error('Error al actualizar normativa:', error)
      mostrarNotificacion(error.message, 'error')
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
    {puedeEditar && (
<button
      className="btn-editar"
      onClick={() => setNormativaEditando({ ...normativa })}
>
  Editar
  </button>
)}
  {puedeEditar && (
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
  mostrarNotificacion('Normativa eliminada correctamente', 'exito')
} catch (error) {
      console.error('Error al eliminar normativa:', error)
      mostrarNotificacion(error.message, 'error')
    }
  }}
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
  )
}

export default Normativas