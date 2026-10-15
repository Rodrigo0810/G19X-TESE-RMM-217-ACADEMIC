from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, ProgrammingError
from database import engine
from models.roles import RolCrear
router = APIRouter()

@router.get("/roles")
def listar_roles():
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT
                    id,
                    nombre,
                    descripcion
                FROM roles
                ORDER BY id
            """)
        )
        roles = resultado.mappings().all()
    return [dict(rol) for rol in roles]

@router.post("/roles", status_code=201)
def crear_rol(rol: RolCrear):
    datos = rol.model_dump()
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    INSERT INTO roles (
                        nombre,
                        descripcion
                    )
                    VALUES (
                        :nombre,
                        :descripcion
                    )
                    RETURNING
                        id,
                        nombre,
                        descripcion
                """),
                datos
            )
            nuevo_rol = resultado.mappings().first()
        return dict(nuevo_rol)
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=400,
            detail="No se pudo crear el rol. Verifica que el nombre no esté repetido."
        )

@router.put("/roles/{rol_id}")
def actualizar_rol(rol_id: int, rol: RolCrear):
    datos = rol.model_dump()
    datos["id"] = rol_id
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    UPDATE roles
                    SET
                        nombre = :nombre,
                        descripcion = :descripcion
                    WHERE id = :id
                    RETURNING
                        id,
                        nombre,
                        descripcion
                """),
                datos
            )
            rol_actualizado = resultado.mappings().first()
        if rol_actualizado is None:
            raise HTTPException(
                status_code=404,
                detail="Rol no encontrado"
            )
        return dict(rol_actualizado)
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=400,
            detail="No se pudo actualizar el rol. Verifica que el nombre no este repetido."
        )

@router.delete("/roles/{rol_id}")
def eliminar_rol(rol_id: int):
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    DELETE FROM roles
                    WHERE id = :id
                    RETURNING id, nombre
                """),
                {"id": rol_id}
            )
            rol_eliminado = resultado.mappings().first()
        if rol_eliminado is None:
            raise HTTPException(
                status_code=404,
                detail="Rol no encontrado"
            )
        return {
            "mensaje": "Rol eliminado correctamente",
            "rol": dict(rol_eliminado)
        }
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=409,
            detail="No se puede eliminar este rol porque tiene usuarios relacionados."
        )