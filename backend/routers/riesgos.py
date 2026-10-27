from dependencias_auth import verificar_puede_editar
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, ProgrammingError
from database import engine
from models.riesgos import RiesgoCrear
router = APIRouter()

@router.get("/riesgos")
def listar_riesgos():
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT
                    id,
                    obligacion_id,
                    auditoria_id,
                    control_id,
                    nombre,
                    descripcion,
                    nivel,
                    probabilidad,
                    impacto,
                    estado,
                    fecha_creacion
                FROM riesgos
                ORDER BY id
            """)
        )
        riesgos = resultado.mappings().all()
    return [dict(riesgo) for riesgo in riesgos]

@router.post("/riesgos", status_code=201, dependencies=[Depends(verificar_puede_editar)])
def crear_riesgo(riesgo: RiesgoCrear):
    datos = riesgo.model_dump()
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    INSERT INTO riesgos (
                        obligacion_id,
                        auditoria_id,
                        control_id,
                        nombre,
                        descripcion,
                        nivel,
                        probabilidad,
                        impacto,
                        estado
                    )
                    VALUES (
                        :obligacion_id,
                        :auditoria_id,
                        :control_id,
                        :nombre,
                        :descripcion,
                        :nivel,
                        :probabilidad,
                        :impacto,
                        :estado
                    )
                    RETURNING
                        id,
                        obligacion_id,
                        auditoria_id,
                        control_id,
                        nombre,
                        descripcion,
                        nivel,
                        probabilidad,
                        impacto,
                        estado,
                        fecha_creacion
                """),
                datos
            )

            nuevo_riesgo = resultado.mappings().first()
        return dict(nuevo_riesgo)
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=400,
            detail="La obligacion, auditoria o control indicado no existe o los datos no son validos."
        )

@router.put("/riesgos/{riesgo_id}", dependencies=[Depends(verificar_puede_editar)])
def actualizar_riesgo(
    riesgo_id: int,
    riesgo: RiesgoCrear
):
    datos = riesgo.model_dump()
    datos["id"] = riesgo_id
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    UPDATE riesgos
                    SET
                        obligacion_id = :obligacion_id,
                        auditoria_id = :auditoria_id,
                        control_id = :control_id,
                        nombre = :nombre,
                        descripcion = :descripcion,
                        nivel = :nivel,
                        probabilidad = :probabilidad,
                        impacto = :impacto,
                        estado = :estado
                    WHERE id = :id
                    RETURNING
                        id,
                        obligacion_id,
                        auditoria_id,
                        control_id,
                        nombre,
                        descripcion,
                        nivel,
                        probabilidad,
                        impacto,
                        estado,
                        fecha_creacion
                """),
                datos
            )
            riesgo_actualizado = resultado.mappings().first()
        if riesgo_actualizado is None:
            raise HTTPException(
                status_code=404,
                detail="Riesgo no encontrado"
            )
        return dict(riesgo_actualizado)
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=400,
            detail="La obligacion, auditoria o control indicado no existe o los datos no son validos."
        )

@router.delete("/riesgos/{riesgo_id}", dependencies=[Depends(verificar_puede_editar)])
def eliminar_riesgo(riesgo_id: int):
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    DELETE FROM riesgos
                    WHERE id = :id
                    RETURNING id, nombre
                """),
                {"id": riesgo_id}
            )

            riesgo_eliminado = resultado.mappings().first()
        if riesgo_eliminado is None:
            raise HTTPException(
                status_code=404,
                detail="Riesgo no encontrado"
            )
        return {
            "mensaje": "Riesgo eliminado correctamente",
            "riesgo": dict(riesgo_eliminado)
        }
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=409,
            detail="No se puede eliminar este riesgo porque tiene alertas relacionadas."
        )