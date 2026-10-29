export default function Obligaciones({
  obligaciones,
  departamentos,
  normativas,
  puedeEditar,
  mostrarFormularioNuevo,
  setMostrarFormularioNuevo,
  nuevaObligacion,
  setNuevaObligacion,
  obligacionEditando,
  setObligacionEditando,
  crearObligacion,
  guardarEdicionObligacion,
  eliminarObligacion
}) {
  return (
    <>
<div className="card">
  <h2>Gestión de obligaciones</h2>
  <p>Aquí se administrarán las obligaciones normativas.</p>
  {puedeEditar && (
<button
    className="btn-nuevo"
    onClick={() => setMostrarFormularioNuevo(true)}
>
    Nueva obligación
  </button>
)}
{puedeEditar && mostrarFormularioNuevo && (
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

  <label>Fecha límite</label>
  <input
    type="date"
    value={nuevaObligacion.fecha_limite ?? ''}
    onChange={(e) =>
      setNuevaObligacion({
        ...nuevaObligacion,
        fecha_limite: e.target.value
      })
    }
  />
  <label>Responsable</label>
  <input
    type="text"
    maxLength={150}
    placeholder="Nombre del responsable (opcional)"
    value={nuevaObligacion.responsable ?? ''}
    onChange={(e) =>
      setNuevaObligacion({
        ...nuevaObligacion,
        responsable: e.target.value
      })
    }
  />
  <label>Departamento</label>
  <select
    value={nuevaObligacion.departamento_id ?? ''}
    onChange={(e) =>
      setNuevaObligacion({
      ...nuevaObligacion,
      departamento_id: e.target.value === ''
        ? null
        : Number(e.target.value)
    })
  }
>
  <option value="">Sin departamento asignado</option>
{departamentos.map((departamento) => (
  <option key={departamento.id} value={departamento.id}>
{departamento.nombre}
  </option>
  ))}
  </select>
  <label>Normativa</label>
  <select
    value={nuevaObligacion.normativa_id ?? ''}
    onChange={(e) =>
      setNuevaObligacion({
      ...nuevaObligacion,
      normativa_id: e.target.value === ''
        ? null
        : Number(e.target.value)
    })
  }
>
  <option value="">Sin normativa asignada</option>
{normativas.map((normativa) => (
  <option key={normativa.id} value={normativa.id}>
{normativa.nombre}
  </option>
))}
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

{puedeEditar && obligacionEditando && (
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

  <label>Fecha límite</label>
  <input
    type="date"
    value={String(obligacionEditando.fecha_limite || '').slice(0, 10)}
    onChange={(e) =>
      setObligacionEditando({
        ...obligacionEditando,
        fecha_limite: e.target.value
      })
    }
  />
  <label>Responsable</label>
  <input
    type="text"
    maxLength={150}
    placeholder="Nombre del responsable (opcional)"
    value={obligacionEditando.responsable ?? ''}
    onChange={(e) =>
      setObligacionEditando({
        ...obligacionEditando,
        responsable: e.target.value
      })
    }
  />
  <label>Departamento</label>
  <select
    value={obligacionEditando.departamento_id ?? ''}
    onChange={(e) =>
      setObligacionEditando({
      ...obligacionEditando,
      departamento_id: e.target.value === ''
        ? null
        : Number(e.target.value)
    })
  }
>
<option value="">Sin departamento asignado</option>
{departamentos.map((departamento) => (
  <option key={departamento.id} value={departamento.id}>
{departamento.nombre}
  </option>
))}
  </select>
  <label>Normativa</label>
  <select
    value={obligacionEditando.normativa_id ?? ''}
    onChange={(e) =>
      setObligacionEditando({
      ...obligacionEditando,
      normativa_id: e.target.value === ''
        ? null
        : Number(e.target.value)
    })
  }
>
  <option value="">Sin normativa asignada</option>
{normativas.map((normativa) => (
  <option key={normativa.id} value={normativa.id}>
{normativa.nombre}
  </option>
))}
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
    <th>Fecha límite</th>
    <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
{obligaciones.map((obligacion) => (
    <tr key={obligacion.id}>
    <td>{obligacion.id}</td>
    <td>{obligacion.nombre}</td>
    <td>{obligacion.estado}</td>
    <td>{obligacion.fecha_limite ? String(obligacion.fecha_limite).slice(0, 10) : 'Sin fecha asignada'}</td>
    <td>
  {puedeEditar && (
<button
    className="btn-editar"
    onClick={() => setObligacionEditando(obligacion)}
>
  Editar
  </button>
)}
  {puedeEditar && (
<button
    className="btn-eliminar"
    onClick={() => eliminarObligacion(obligacion.id)}
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
    </>
  )
}