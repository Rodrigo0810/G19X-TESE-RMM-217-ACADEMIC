function Auditorias({
  puedeEditar,
  mostrarFormularioNuevaAuditoria,
  setMostrarFormularioNuevaAuditoria,
  nuevaAuditoria,
  setNuevaAuditoria,
  crearAuditoria,
  auditoriaEditando,
  setAuditoriaEditando,
  guardarEdicionAuditoria,
  auditorias,
  eliminarAuditoria
}) {
  return (

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

  )
}

export default Auditorias
