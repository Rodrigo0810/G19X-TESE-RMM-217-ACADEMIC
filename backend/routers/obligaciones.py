from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from database import engine
from models.obligaciones import ObligacionCrear
router = APIRouter()

@router.get("/obligaciones")
def listar_obligaciones():
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT
                    id,
                    normativa_id,
                    departamento_id,
                    nombre,
                    descripcion,
                    responsable,
                    fecha_limite,
                    estado,
                    nivel_riesgo,
                    fecha_creacion
                FROM obligaciones
                ORDER BY id
            """)
        )
        obligaciones = resultado.mappings().all()
    return [dict(obligacion) for obligacion in obligaciones]


@router.post("/obligaciones", status_code=201)
def crear_obligacion(obligacion: ObligacionCrear):
    datos = obligacion.model_dump()
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    INSERT INTO obligaciones (
                        normativa_id,
                        departamento_id,
                        nombre,
                        descripcion,
                        responsable,
                        fecha_limite,
                        estado,
                        nivel_riesgo
                    )
                    VALUES (
                        :normativa_id,
                        :departamento_id,
                        :nombre,
                        :descripcion,
                        :responsable,
                        :fecha_limite,
                        :estado,
                        :nivel_riesgo
                    )
                    RETURNING
                        id,
                        normativa_id,
                        departamento_id,
                        nombre,
                        descripcion,
                        responsable,
                        fecha_limite,
                        estado,
                        nivel_riesgo,
                        fecha_creacion
                """),
                datos
            )
            nueva_obligacion = resultado.mappings().one()
        return dict(nueva_obligacion)
    except IntegrityError:
        raise HTTPException(
            status_code=400,
            detail="El departamento o la normativa indicados no existen."
        )

@router.get("/obligaciones/{obligacion_id}")
def consultar_obligacion(obligacion_id: int):
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT id, nombre, estado, nivel_riesgo
                FROM obligaciones
                WHERE id = :id
            """),
            {"id": obligacion_id}
        )
        obligacion = resultado.mappings().first()
    if obligacion is None:
        raise HTTPException(
            status_code=404,
            detail="Obligacion no encontrada"
        )
    return dict(obligacion)

@router.put("/obligaciones/{obligacion_id}")
def actualizar_obligacion(
    obligacion_id: int,
    obligacion: ObligacionCrear
):
    datos = obligacion.model_dump()
    datos["id"] = obligacion_id
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    UPDATE obligaciones
                    SET
                        normativa_id = :normativa_id,
                        departamento_id = :departamento_id,
                        nombre = :nombre,
                        descripcion = :descripcion,
                        responsable = :responsable,
                        fecha_limite = :fecha_limite,
                        estado = :estado,
                        nivel_riesgo = :nivel_riesgo
                    WHERE id = :id
                    RETURNING
                        id,
                        normativa_id,
                        departamento_id,
                        nombre,
                        descripcion,
                        responsable,
                        fecha_limite,
                        estado,
                        nivel_riesgo,
                        fecha_creacion
                """),
                datos
            )
            obligacion_actualizada = resultado.mappings().first()
        if obligacion_actualizada is None:
            raise HTTPException(
                status_code=404,
                detail="Obligacion no encontrada"
            )
        return dict(obligacion_actualizada)
    except IntegrityError:
        raise HTTPException(
            status_code=400,
            detail="El departamento o la normativa indicados no existen."
        )

@router.delete("/obligaciones/{obligacion_id}")
def eliminar_obligacion(obligacion_id: int):
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    DELETE FROM obligaciones
                    WHERE id = :id
                    RETURNING id, nombre
                """),
                {"id": obligacion_id}
            )
            obligacion_eliminada = resultado.mappings().first()
        if obligacion_eliminada is None:
            raise HTTPException(
                status_code=404,
                detail="Obligacion no encontrada"
            )
        return {
            "mensaje": "Obligacion eliminada correctamente",
            "obligacion": dict(obligacion_eliminada)
        }
    except IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="No se puede eliminar esta obligacion porque tiene registros relacionados."
        )