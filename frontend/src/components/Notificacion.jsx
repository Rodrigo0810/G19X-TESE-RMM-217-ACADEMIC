function Notificacion({ mensaje, tipo = 'info', onCerrar }) {
  if (!mensaje) return null

  const tipos = {
    exito: {
      titulo: 'Operación realizada',
      clase: 'notificacion-exito'
    },
    error: {
      titulo: 'No se pudo completar la operación',
      clase: 'notificacion-error'
    },
    info: {
      titulo: 'Información',
      clase: 'notificacion-info'
    }
  }

  const configuracion = tipos[tipo] || tipos.info

  return (
    <div
      className={`notificacion ${configuracion.clase}`}
      role={tipo === 'error' ? 'alert' : 'status'}
      aria-live={tipo === 'error' ? 'assertive' : 'polite'}
    >
      <div className="notificacion-contenido">
        <strong>{configuracion.titulo}</strong>
        <p>{mensaje}</p>
      </div>

      <button
        type="button"
        className="notificacion-cerrar"
        onClick={onCerrar}
        aria-label="Cerrar notificación"
      >
        X</button>
    </div>
  )
}

export default Notificacion