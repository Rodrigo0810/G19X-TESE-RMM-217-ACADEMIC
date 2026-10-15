from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from database import engine
from models.usuarios import UsuarioCrear, UsuarioRegistro
from seguridad import generar_hash
router = APIRouter()

@router.get("/usuarios")
def listar_usuarios():
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT
                    u.id,
                    u.nombre,
                    u.correo,
                    u.entra_id,
                    u.rol_id,
                    r.nombre AS rol,
                    u.departamento_id,
                    d.nombre AS departamento,
                    u.activo,
                    u.fecha_creacion
                FROM usuarios u
                LEFT JOIN roles r
                    ON u.rol_id = r.id
                LEFT JOIN departamentos d
                    ON u.departamento_id = d.id
                ORDER BY u.id
            """)
        )
        usuarios = resultado.mappings().all()
    return [dict(usuario) for usuario in usuarios]

@router.post("/usuarios", status_code=201)
def crear_usuario(usuario: UsuarioCrear):
    datos = usuario.model_dump()
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    INSERT INTO usuarios (
                        nombre,
                        correo,
                        entra_id,
                        rol_id,
                        departamento_id,
                        activo
                    )
                    VALUES (
                        :nombre,
                        :correo,
                        :entra_id,
                        :rol_id,
                        :departamento_id,
                        :activo
                    )
                    RETURNING
                        id,
                        nombre,
                        correo,
                        entra_id,
                        rol_id,
                        departamento_id,
                        activo,
                        fecha_creacion
                """),
                datos
            )
            nuevo_usuario = resultado.mappings().first()
        return dict(nuevo_usuario)
    except IntegrityError:
        raise HTTPException(
            status_code=400,
            detail="No se pudo crear el usuario. Verifica que el correo y entra_id no esten repetidos y que el rol y departamento existan."
        )

@router.put("/usuarios/{usuario_id}")
def actualizar_usuario(
    usuario_id: int,
    usuario: UsuarioCrear
):
    datos = usuario.model_dump()
    datos["id"] = usuario_id
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    UPDATE usuarios
                    SET
                        nombre = :nombre,
                        correo = :correo,
                        entra_id = :entra_id,
                        rol_id = :rol_id,
                        departamento_id = :departamento_id,
                        activo = :activo
                    WHERE id = :id
                    RETURNING
                        id,
                        nombre,
                        correo,
                        entra_id,
                        rol_id,
                        departamento_id,
                        activo,
                        fecha_creacion
                """),
                datos
            )
            usuario_actualizado = resultado.mappings().first()
        if usuario_actualizado is None:
            raise HTTPException(
                status_code=404,
                detail="Usuario no encontrado"
            )
        return dict(usuario_actualizado)
    except IntegrityError:
        raise HTTPException(
            status_code=400,
            detail="No se pudo actualizar el usuario. Verifica que el correo y entra_id no esten repetidos y que el rol y departamento existan."
        )

@router.delete("/usuarios/{usuario_id}")
def eliminar_usuario(usuario_id: int):
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    DELETE FROM usuarios
                    WHERE id = :id
                    RETURNING id, nombre, correo
                """),
                {"id": usuario_id}
            )
            usuario_eliminado = resultado.mappings().first()
        if usuario_eliminado is None:
            raise HTTPException(
                status_code=404,
                detail="Usuario no encontrado"
            )
        return {
            "mensaje": "Usuario eliminado correctamente",
            "usuario": dict(usuario_eliminado)
        }
    except IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="No se pudo eliminar el usuario porque tiene registros relacionados."
        )
@router.post("/usuarios/registro", status_code=201)
def registrar_usuario(usuario: UsuarioRegistro):
    datos = usuario.model_dump(exclude={"contrasena"})
    datos["password_hash"] = generar_hash(usuario.contrasena)
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    INSERT INTO usuarios (
                        nombre,
                        correo,
                        entra_id,
                        rol_id,
                        departamento_id,
                        activo,
                        password_hash
                    )
                    VALUES (
                        :nombre,
                        :correo,
                        :entra_id,
                        :rol_id,
                        :departamento_id,
                        :activo,
                        :password_hash
                    )
                    RETURNING
                        id,
                        nombre,
                        correo,
                        rol_id,
                        departamento_id,
                        activo,
                        fecha_creacion
                """),
                datos
            )
            nuevo_usuario = resultado.mappings().first()
        return dict(nuevo_usuario)
    except IntegrityError:
        raise HTTPException(
            status_code=400,
            detail="No se pudo registrar el usuario. Verifica el correo, rol y departamento."
        )