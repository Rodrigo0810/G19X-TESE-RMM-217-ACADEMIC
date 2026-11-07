function Controles({
  puedeEditar,
  mostrarFormularioNuevoControl,
  setMostrarFormularioNuevoControl,
  nuevoControl,
  setNuevoControl,
  controlEditando,
  setControlEditando,
  controles,
  obligaciones,
  crearControl,
  guardarEdicionControl,
  eliminarControl,
}) {
  return (
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
  )
}

export default Controles