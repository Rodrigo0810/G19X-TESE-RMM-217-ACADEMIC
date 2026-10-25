from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from database import engine
from models.usuarios import UsuarioCrear, UsuarioRegistro
from seguridad import generar_hash
router = APIRouter()
def _datos(usuario):
    datos = usuario.model_dump()
    datos["nombre"] = datos["nombre"].strip()
    datos["correo"] = datos["correo"].strip().lower()
    datos["entra_id"] = (datos["entra_id"] or "").strip() or None
    if not datos["nombre"] or not datos["correo"]:
        raise HTTPException(status_code=422, detail="Nombre y correo son obligatorios")
    return datos
def _proteger_ultimo_admin(connection, usuario_id, rol_nuevo=None, activo_nuevo=None, eliminar=False):
    # Serializa operaciones de administración para evitar dos bajas simultáneas.
    connection.execute(text("SELECT pg_advisory_xact_lock(824631902)"))
    actual = connection.execute(text("""
        SELECT u.id, u.activo, r.nombre AS rol
        FROM usuarios u LEFT JOIN roles r ON r.id = u.rol_id
        WHERE u.id = :id FOR UPDATE OF u
    """), {"id": usuario_id}).mappings().first()
    if actual is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    es_admin = bool(actual["activo"] and actual["rol"] and actual["rol"].strip().lower() == "administrador")
    if not es_admin:
        return
    if eliminar:
        dejara_de_ser_admin = True
    else:
        nuevo_rol = connection.execute(
            text("SELECT nombre FROM roles WHERE id = :id"), {"id": rol_nuevo}
        ).scalar_one_or_none() if rol_nuevo is not None else None
        dejara_de_ser_admin = not activo_nuevo or not (nuevo_rol and nuevo_rol.strip().lower() == "administrador")
    if dejara_de_ser_admin:
        cantidad = connection.execute(text("""
            SELECT count(*) FROM usuarios u JOIN roles r ON r.id = u.rol_id
            WHERE u.activo = TRUE AND lower(trim(r.nombre)) = 'administrador'
        """)).scalar_one()
        if cantidad <= 1:
            raise HTTPException(status_code=409, detail="No puedes eliminar o desactivar al ultimo administrador activo")
@router.get("/usuarios")
def listar_usuarios():
    with engine.connect() as connection:
        resultado = connection.execute(text("""
            SELECT u.id, u.nombre, u.correo, u.entra_id, u.rol_id,
                   r.nombre AS rol, u.departamento_id, d.nombre AS departamento,
                   u.activo, u.fecha_creacion
            FROM usuarios u
            LEFT JOIN roles r ON u.rol_id = r.id
            LEFT JOIN departamentos d ON u.departamento_id = d.id
            ORDER BY u.id
        """))
        return [dict(fila) for fila in resultado.mappings().all()]
@router.post("/usuarios", status_code=201)
def crear_usuario(usuario: UsuarioRegistro):
    # Se conserva POST /usuarios para no romper el frontend existente.
    datos = _datos(usuario)
    contrasena = datos.pop("contrasena")
    datos["password_hash"] = generar_hash(contrasena)
    try:
        with engine.begin() as connection:
            resultado = connection.execute(text("""
                INSERT INTO usuarios (nombre, correo, entra_id, rol_id, departamento_id, activo, password_hash)
                VALUES (:nombre, :correo, :entra_id, :rol_id, :departamento_id, :activo, :password_hash)
                RETURNING id, nombre, correo, entra_id, rol_id, departamento_id, activo, fecha_creacion
            """), datos)
            return dict(resultado.mappings().one())
    except IntegrityError as exc:
        raise HTTPException(status_code=400, detail="Correo o ID Entra duplicado, o rol/departamento inexistente") from exc
@router.post("/usuarios/registro", status_code=201)
def registrar_usuario(usuario: UsuarioRegistro):
    # Compatibilidad con el endpoint de registro administrativo ya existente.
    return crear_usuario(usuario)
@router.put("/usuarios/{usuario_id}")
def actualizar_usuario(usuario_id: int, usuario: UsuarioCrear):
    datos = _datos(usuario)
    datos["id"] = usuario_id
    try:
        with engine.begin() as connection:
            _proteger_ultimo_admin(connection, usuario_id, datos["rol_id"], datos["activo"])
            resultado = connection.execute(text("""
                UPDATE usuarios SET nombre=:nombre, correo=:correo, entra_id=:entra_id,
                    rol_id=:rol_id, departamento_id=:departamento_id, activo=:activo
                WHERE id=:id
                RETURNING id, nombre, correo, entra_id, rol_id, departamento_id, activo, fecha_creacion
            """), datos)
            return dict(resultado.mappings().one())
    except IntegrityError as exc:
        raise HTTPException(status_code=400, detail="Correo o ID Entra duplicado, o rol/departamento inexistente") from exc
@router.delete("/usuarios/{usuario_id}")
def eliminar_usuario(usuario_id: int):
    try:
        with engine.begin() as connection:
            _proteger_ultimo_admin(connection, usuario_id, eliminar=True)
            resultado = connection.execute(text("""
                DELETE FROM usuarios WHERE id=:id RETURNING id, nombre, correo
            """), {"id": usuario_id})
            return {"mensaje": "Usuario eliminado correctamente", "usuario": dict(resultado.mappings().one())}
    except IntegrityError as exc:
        raise HTTPException(status_code=409, detail="No se puede eliminar el usuario porque tiene registros relacionados") from exc