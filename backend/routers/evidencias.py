from dependencias_auth import verificar_puede_editar
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, ProgrammingError
from database import engine
from models.evidencias import EvidenciaCrear
router = APIRouter()

@router.get("/evidencias")
def listar_evidencias():
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT
                    id,
                    obligacion_id,
                    auditoria_id,
                    control_id,
                    nombre,
                    tipo,
                    ubicacion,
                    descripcion,
                    fecha_documento,
                    estado,
                    fecha_creacion
                FROM evidencias
                ORDER BY id
            """)
        )
        evidencias = resultado.mappings().all()
    return [dict(evidencia) for evidencia in evidencias]

@router.post("/evidencias", status_code=201, dependencies=[Depends(verificar_puede_editar)])
def crear_evidencia(evidencia: EvidenciaCrear):
    datos = evidencia.model_dump()
    if (
        datos["obligacion_id"] is None
        and datos["auditoria_id"] is None
        and datos["control_id"] is None
    ):
        raise HTTPException(
            status_code=400,
            detail="La evidencia debe estar relacionada con una obligacion, auditoria o control."
        )
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    INSERT INTO evidencias (
                        obligacion_id,
                        auditoria_id,
                        control_id,
                        nombre,
                        tipo,
                        ubicacion,
                        descripcion,
                        fecha_documento,
                        estado
                    )
                    VALUES (
                        :obligacion_id,
                        :auditoria_id,
                        :control_id,
                        :nombre,
                        :tipo,
                        :ubicacion,
                        :descripcion,
                        :fecha_documento,
                        :estado
                    )
                    RETURNING
                        id,
                        obligacion_id,
                        auditoria_id,
                        control_id,
                        nombre,
                        tipo,
                        ubicacion,
                        descripcion,
                        fecha_documento,
                        estado,
                        fecha_creacion
                """),
                datos
            )
            nueva_evidencia = resultado.mappings().first()
        return dict(nueva_evidencia)
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=400,
            detail="La obligacion, auditoria o control indicado no existe."
        )

@router.put("/evidencias/{evidencia_id}", dependencies=[Depends(verificar_puede_editar)])
def actualizar_evidencia(
    evidencia_id: int,
    evidencia: EvidenciaCrear
):
    datos = evidencia.model_dump()
    datos["id"] = evidencia_id

    if (
        datos["obligacion_id"] is None
        and datos["auditoria_id"] is None
        and datos["control_id"] is None
    ):
        raise HTTPException(
            status_code=400,
            detail="La evidencia debe estar relacionada con una obligacion, auditoria o control."
        )
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    UPDATE evidencias
                    SET
                        obligacion_id = :obligacion_id,
                        auditoria_id = :auditoria_id,
                        control_id = :control_id,
                        nombre = :nombre,
                        tipo = :tipo,
                        ubicacion = :ubicacion,
                        descripcion = :descripcion,
                        fecha_documento = :fecha_documento,
                        estado = :estado
                    WHERE id = :id
                    RETURNING
                        id,
                        obligacion_id,
                        auditoria_id,
                        control_id,
                        nombre,
                        tipo,
                        ubicacion,
                        descripcion,
                        fecha_documento,
                        estado,
                        fecha_creacion
                """),
                datos
            )
            evidencia_actualizada = resultado.mappings().first()
        if evidencia_actualizada is None:
            raise HTTPException(
                status_code=404,
                detail="Evidencia no encontrada"
            )
        return dict(evidencia_actualizada)
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=400,
            detail="La obligacion, auditoria o control indicado no existe."
        )

@router.delete("/evidencias/{evidencia_id}", dependencies=[Depends(verificar_puede_editar)])
def eliminar_evidencia(evidencia_id: int):
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    DELETE FROM evidencias
                    WHERE id = :id
                    RETURNING id, nombre
                """),
                {"id": evidencia_id}
            )
            evidencia_eliminada = resultado.mappings().first()
        if evidencia_eliminada is None:
            raise HTTPException(
                status_code=404,
                detail="Evidencia no encontrada"
            )
        return {
            "mensaje": "Evidencia eliminada correctamente",
            "evidencia": dict(evidencia_eliminada)
        }
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=409,
            detail="No se puede eliminar esta evidencia porque esta relacionada con otros registros."
        )