from dependencias_auth import verificar_puede_editar
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, ProgrammingError
from database import engine
from models.normativas import NormativaCrear
router = APIRouter()

@router.get("/normativas")
def listar_normativas():
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT
                    id,
                    nombre,
                    tipo,
                    descripcion,
                    organismo_emisor,
                    hipervinculo,
                    fecha_publicacion,
                    activa,
                    fecha_creacion
                FROM normativas
                ORDER BY id
            """)
        )
        normativas = resultado.mappings().all()
    return [dict(normativa) for normativa in normativas]

@router.post("/normativas", status_code=201, dependencies=[Depends(verificar_puede_editar)])
def crear_normativa(normativa: NormativaCrear):
    datos = normativa.model_dump()
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    INSERT INTO normativas (
                        nombre,
                        tipo,
                        descripcion,
                        organismo_emisor,
                        hipervinculo,
                        fecha_publicacion,
                        activa
                    )
                    VALUES (
                        :nombre,
                        :tipo,
                        :descripcion,
                        :organismo_emisor,
                        :hipervinculo,
                        :fecha_publicacion,
                        :activa
                    )
                    RETURNING
                        id,
                        nombre,
                        tipo,
                        descripcion,
                        organismo_emisor,
                        hipervinculo,
                        fecha_publicacion,
                        activa,
                        fecha_creacion
                """),
                datos
            )
            nueva_normativa = resultado.mappings().first()
        return dict(nueva_normativa)
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=400,
            detail="No se pudo crear la normativa. Verifica los datos enviados."
        )

@router.put("/normativas/{normativa_id}", dependencies=[Depends(verificar_puede_editar)])
def actualizar_normativa(
    normativa_id: int,
    normativa: NormativaCrear
):
    datos = normativa.model_dump()
    datos["id"] = normativa_id
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    UPDATE normativas
                    SET
                        nombre = :nombre,
                        tipo = :tipo,
                        descripcion = :descripcion,
                        organismo_emisor = :organismo_emisor,
                        hipervinculo = :hipervinculo,
                        fecha_publicacion = :fecha_publicacion,
                        activa = :activa
                    WHERE id = :id
                    RETURNING
                        id,
                        nombre,
                        tipo,
                        descripcion,
                        organismo_emisor,
                        hipervinculo,
                        fecha_publicacion,
                        activa,
                        fecha_creacion
                """),
                datos
            )
            normativa_actualizada = resultado.mappings().first()
        if normativa_actualizada is None:
            raise HTTPException(
                status_code=404,
                detail="Normativa no encontrada"
            )
        return dict(normativa_actualizada)
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=400,
            detail="No se pudo actualizar la normativa. Verifica los datos enviados."
        )

@router.delete("/normativas/{normativa_id}", dependencies=[Depends(verificar_puede_editar)])
def eliminar_normativa(normativa_id: int):
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    DELETE FROM normativas
                    WHERE id = :id
                    RETURNING id, nombre
                """),
                {"id": normativa_id}
            )
            normativa_eliminada = resultado.mappings().first()
        if normativa_eliminada is None:
            raise HTTPException(
                status_code=404,
                detail="Normativa no encontrada"
            )
        return {
            "mensaje": "Normativa eliminada correctamente",
            "normativa": dict(normativa_eliminada)
        }
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=409,
            detail="No se puede eliminar esta normativa porque tiene obligaciones relacionadas."
        )