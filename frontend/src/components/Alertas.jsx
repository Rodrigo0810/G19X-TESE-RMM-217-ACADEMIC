export default function Alertas({
  puedeEditar,
  mostrarFormularioNuevaAlerta,
  setMostrarFormularioNuevaAlerta,
  nuevaAlerta,
  setNuevaAlerta,
  alertaEditando,
  setAlertaEditando,
  alertas,
  obligaciones,
  crearAlerta,
  guardarEdicionAlerta,
  eliminarAlerta
}) {
  return (
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
  )
}