from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, ProgrammingError
from database import engine
from models.departamentos import DepartamentoCrear
router = APIRouter()

@router.get("/departamentos")
def listar_departamentos():
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT
                    id,
                    nombre,
                    descripcion,
                    activo,
                    fecha_creacion
                FROM departamentos
                ORDER BY id
            """)
        )
        departamentos = resultado.mappings().all()
    return [dict(departamento) for departamento in departamentos]

@router.post("/departamentos", status_code=201)
def crear_departamento(departamento: DepartamentoCrear):
    datos = departamento.model_dump()
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    INSERT INTO departamentos (
                        nombre,
                        descripcion,
                        activo
                    )
                    VALUES (
                        :nombre,
                        :descripcion,
                        :activo
                    )
                    RETURNING
                        id,
                        nombre,
                        descripcion,
                        activo,
                        fecha_creacion
                """),
                datos
            )
            nuevo_departamento = resultado.mappings().first()
        return dict(nuevo_departamento)
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=400,
            detail="No se pudo crear el departamento. Verifica que el nombre no este repetido."
        )

@router.put("/departamentos/{departamento_id}")
def actualizar_departamento(
    departamento_id: int,
    departamento: DepartamentoCrear
):
    datos = departamento.model_dump()
    datos["id"] = departamento_id
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    UPDATE departamentos
                    SET
                        nombre = :nombre,
                        descripcion = :descripcion,
                        activo = :activo
                    WHERE id = :id
                    RETURNING
                        id,
                        nombre,
                        descripcion,
                        activo,
                        fecha_creacion
                """),
                datos
            )
            departamento_actualizado = resultado.mappings().first()
        if departamento_actualizado is None:
            raise HTTPException(
                status_code=404,
                detail="Departamento no encontrado"
            )
        return dict(departamento_actualizado)
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=400,
            detail="No se pudo actualizar el departamento. Verifica que el nombre no este repetido."
        )

@router.delete("/departamentos/{departamento_id}")
def eliminar_departamento(departamento_id: int):
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    DELETE FROM departamentos
                    WHERE id = :id
                    RETURNING id, nombre
                """),
                {"id": departamento_id}
            )
            departamento_eliminado = resultado.mappings().first()
        if departamento_eliminado is None:
            raise HTTPException(
                status_code=404,
                detail="Departamento no encontrado"
            )
        return {
            "mensaje": "Departamento eliminado correctamente",
            "departamento": dict(departamento_eliminado)
        }
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=409,
            detail="No se puede eliminar este departamento porque tiene obligaciones, auditorias, controles o usuarios relacionados."
        )