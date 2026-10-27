from dependencias_auth import verificar_puede_editar
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, ProgrammingError
from database import engine
from models.alertas import AlertaCrear
router = APIRouter()

@router.get("/alertas")
def listar_alertas():
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT
                    id,
                    obligacion_id,
                    riesgo_id,
                    titulo,
                    mensaje,
                    nivel,
                    estado,
                    fecha_creacion
                FROM alertas
                ORDER BY id
            """)
        )
        alertas = resultado.mappings().all()
    return [dict(alerta) for alerta in alertas]

@router.post("/alertas", status_code=201, dependencies=[Depends(verificar_puede_editar)])
def crear_alerta(alerta: AlertaCrear):
    datos = alerta.model_dump()
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    INSERT INTO alertas (
                        obligacion_id,
                        riesgo_id,
                        titulo,
                        mensaje,
                        nivel,
                        estado
                    )
                    VALUES (
                        :obligacion_id,
                        :riesgo_id,
                        :titulo,
                        :mensaje,
                        :nivel,
                        :estado
                    )
                    RETURNING
                        id,
                        obligacion_id,
                        riesgo_id,
                        titulo,
                        mensaje,
                        nivel,
                        estado,
                        fecha_creacion
                """),
                datos
            )
            nueva_alerta = resultado.mappings().first()
        return dict(nueva_alerta)
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=400,
            detail="La obligacion o el riesgo indicado no existe o los datos no son validos."
        )

@router.put("/alertas/{alerta_id}", dependencies=[Depends(verificar_puede_editar)])
def actualizar_alerta(
    alerta_id: int,
    alerta: AlertaCrear
):
    datos = alerta.model_dump()
    datos["id"] = alerta_id
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    UPDATE alertas
                    SET
                        obligacion_id = :obligacion_id,
                        riesgo_id = :riesgo_id,
                        titulo = :titulo,
                        mensaje = :mensaje,
                        nivel = :nivel,
                        estado = :estado
                    WHERE id = :id
                    RETURNING
                        id,
                        obligacion_id,
                        riesgo_id,
                        titulo,
                        mensaje,
                        nivel,
                        estado,
                        fecha_creacion
                """),
                datos
            )
            alerta_actualizada = resultado.mappings().first()
        if alerta_actualizada is None:
            raise HTTPException(
                status_code=404,
                detail="Alerta no encontrada"
            )
        return dict(alerta_actualizada)
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=400,
            detail="La obligacion o el riesgo indicado no existe o los datos no son validos."
        )

@router.delete("/alertas/{alerta_id}", dependencies=[Depends(verificar_puede_editar)])
def eliminar_alerta(alerta_id: int):
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    DELETE FROM alertas
                    WHERE id = :id
                    RETURNING id, titulo
                """),
                {"id": alerta_id}
            )
            alerta_eliminada = resultado.mappings().first()
        if alerta_eliminada is None:
            raise HTTPException(
                status_code=404,
                detail="Alerta no encontrada"
            )
        return {
            "mensaje": "Alerta eliminada correctamente",
            "alerta": dict(alerta_eliminada)
        }
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=409,
            detail="No se puede eliminar esta alerta porque tiene registros relacionados."
        )