from dependencias_auth import verificar_puede_editar
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from database import engine
from models.auditorias import AuditoriaCrear
router = APIRouter()

@router.get("/auditorias")
def listar_auditorias():
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT
                    id,
                    nombre,
                    descripcion,
                    departamento_id,
                    fecha_inicio,
                    fecha_fin,
                    estado,
                    resultado,
                    fecha_creacion
                FROM auditorias
                ORDER BY id
            """)
        )
        auditorias = [
            dict(fila)
            for fila in resultado.mappings().all()
        ]
    return auditorias

@router.post("/auditorias", status_code=201, dependencies=[Depends(verificar_puede_editar)])
def crear_auditoria(auditoria: AuditoriaCrear):
    datos = auditoria.model_dump()
    if (
        datos["fecha_inicio"] is not None
        and datos["fecha_fin"] is not None
        and datos["fecha_fin"] < datos["fecha_inicio"]
    ):
        raise HTTPException(
            status_code=400,
            detail="La fecha de fin no puede ser anterior a la fecha de inicio."
        )
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    INSERT INTO auditorias (
                        nombre,
                        descripcion,
                        departamento_id,
                        fecha_inicio,
                        fecha_fin,
                        estado,
                        resultado
                    )
                    VALUES (
                        :nombre,
                        :descripcion,
                        :departamento_id,
                        :fecha_inicio,
                        :fecha_fin,
                        :estado,
                        :resultado
                    )
                    RETURNING
                        id,
                        nombre,
                        descripcion,
                        departamento_id,
                        fecha_inicio,
                        fecha_fin,
                        estado,
                        resultado,
                        fecha_creacion
                """),
                datos
            )
            nueva_auditoria = resultado.mappings().one()
        return dict(nueva_auditoria)
    except IntegrityError:
        raise HTTPException(
            status_code=400,
            detail="El departamento indicado no existe."
        )


@router.put("/auditorias/{auditoria_id}", dependencies=[Depends(verificar_puede_editar)])
def actualizar_auditoria(
    auditoria_id: int,
    auditoria: AuditoriaCrear
):
    datos = auditoria.model_dump()
    datos["id"] = auditoria_id
    if (
        datos["fecha_inicio"] is not None
        and datos["fecha_fin"] is not None
        and datos["fecha_fin"] < datos["fecha_inicio"]
    ):
        raise HTTPException(
            status_code=400,
            detail="La fecha de fin no puede ser anterior a la fecha de inicio."
        )
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    UPDATE auditorias
                    SET
                        nombre = :nombre,
                        descripcion = :descripcion,
                        departamento_id = :departamento_id,
                        fecha_inicio = :fecha_inicio,
                        fecha_fin = :fecha_fin,
                        estado = :estado,
                        resultado = :resultado
                    WHERE id = :id
                    RETURNING
                        id,
                        nombre,
                        descripcion,
                        departamento_id,
                        fecha_inicio,
                        fecha_fin,
                        estado,
                        resultado,
                        fecha_creacion
                """),
                datos
            )
            auditoria_actualizada = resultado.mappings().first()
        if auditoria_actualizada is None:
            raise HTTPException(
                status_code=404,
                detail="Auditoria no encontrada"
            )
        return dict(auditoria_actualizada)
    except IntegrityError:
        raise HTTPException(
            status_code=400,
            detail="El departamento indicado no existe."
        )

@router.delete("/auditorias/{auditoria_id}", dependencies=[Depends(verificar_puede_editar)])
def eliminar_auditoria(auditoria_id: int):
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    DELETE FROM auditorias
                    WHERE id = :id
                    RETURNING id, nombre
                """),
                {"id": auditoria_id}
            )
            auditoria_eliminada = resultado.mappings().first()
        if auditoria_eliminada is None:
            raise HTTPException(
                status_code=404,
                detail="Auditoria no encontrada"
            )
        return {
            "mensaje": "Auditoria eliminada correctamente",
            "auditoria": dict(auditoria_eliminada)
        }
    except IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="No se puede eliminar esta auditoria porque tiene evidencias o riesgos relacionados."
        )