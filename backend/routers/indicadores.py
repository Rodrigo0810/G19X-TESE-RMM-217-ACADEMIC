from dependencias_auth import verificar_puede_editar
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, ProgrammingError
from database import engine
from models.indicadores import IndicadorCrear
router = APIRouter()

@router.get("/indicadores")
def listar_indicadores():
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT
                    id,
                    nombre,
                    descripcion,
                    categoria,
                    valor,
                    unidad,
                    periodo_inicio,
                    periodo_fin,
                    fecha_calculo
                FROM indicadores
                ORDER BY id
            """)
        )
        indicadores = resultado.mappings().all()
    return [dict(indicador) for indicador in indicadores]

@router.post("/indicadores", status_code=201, dependencies=[Depends(verificar_puede_editar)])
def crear_indicador(indicador: IndicadorCrear):
    datos = indicador.model_dump()
    if (
        datos["periodo_inicio"] is not None
        and datos["periodo_fin"] is not None
        and datos["periodo_fin"] < datos["periodo_inicio"]
    ):
        raise HTTPException(
            status_code=400,
            detail="La fecha de fin no puede ser anterior a la fecha de inicio."
        )
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    INSERT INTO indicadores (
                        nombre,
                        descripcion,
                        categoria,
                        valor,
                        unidad,
                        periodo_inicio,
                        periodo_fin
                    )
                    VALUES (
                        :nombre,
                        :descripcion,
                        :categoria,
                        :valor,
                        :unidad,
                        :periodo_inicio,
                        :periodo_fin
                    )
                    RETURNING
                        id,
                        nombre,
                        descripcion,
                        categoria,
                        valor,
                        unidad,
                        periodo_inicio,
                        periodo_fin,
                        fecha_calculo
                """),
                datos
            )
            nuevo_indicador = resultado.mappings().first()
        return dict(nuevo_indicador)
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=400,
            detail="No se pudo crear el indicador. Verifica los datos enviados."
        )

@router.put("/indicadores/{indicador_id}", dependencies=[Depends(verificar_puede_editar)])
def actualizar_indicador(
    indicador_id: int,
    indicador: IndicadorCrear
):
    datos = indicador.model_dump()
    datos["id"] = indicador_id
    if (
        datos["periodo_inicio"] is not None
        and datos["periodo_fin"] is not None
        and datos["periodo_fin"] < datos["periodo_inicio"]
    ):
        raise HTTPException(
            status_code=400,
            detail="La fecha de fin no puede ser anterior a la fecha de inicio."
        )
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    UPDATE indicadores
                    SET
                        nombre = :nombre,
                        descripcion = :descripcion,
                        categoria = :categoria,
                        valor = :valor,
                        unidad = :unidad,
                        periodo_inicio = :periodo_inicio,
                        periodo_fin = :periodo_fin
                    WHERE id = :id
                    RETURNING
                        id,
                        nombre,
                        descripcion,
                        categoria,
                        valor,
                        unidad,
                        periodo_inicio,
                        periodo_fin,
                        fecha_calculo
                """),
                datos
            )
            indicador_actualizado = resultado.mappings().first()
        if indicador_actualizado is None:
            raise HTTPException(
                status_code=404,
                detail="Indicador no encontrado"
            )
        return dict(indicador_actualizado)
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=400,
            detail="No se pudo actualizar el indicador. Verifica los datos enviados."
        )

@router.delete("/indicadores/{indicador_id}", dependencies=[Depends(verificar_puede_editar)])
def eliminar_indicador(indicador_id: int):
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    DELETE FROM indicadores
                    WHERE id = :id
                    RETURNING id, nombre
                """),
                {"id": indicador_id}
            )
            indicador_eliminado = resultado.mappings().first()

        if indicador_eliminado is None:
            raise HTTPException(
                status_code=404,
                detail="Indicador no encontrado"
            )
        return {
            "mensaje": "Indicador eliminado correctamente",
            "indicador": dict(indicador_eliminado)
        }
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=409,
            detail="No se pudo eliminar el indicador porque tiene registros relacionados."
        )