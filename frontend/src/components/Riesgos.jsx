function Riesgos({
  puedeEditar,
  mostrarFormularioNuevoRiesgo,
  setMostrarFormularioNuevoRiesgo,
  nuevoRiesgo,
  setNuevoRiesgo,
  riesgoEditando,
  setRiesgoEditando,
  riesgos,
  obligaciones,
  crearRiesgo,
  guardarEdicionRiesgo,
  eliminarRiesgo,
}) {
  return (
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
  )
}

export default Riesgos
