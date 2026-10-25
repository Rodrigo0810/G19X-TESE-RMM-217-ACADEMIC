from fastapi import APIRouter, HTTPException, status
from sqlalchemy import text
from database import engine
from fastapi import Depends
from dependencias_auth import obtener_usuario_id
from seguridad import verificar_contrasena
from models.autenticacion import InicioSesion
from seguridad import crear_token_acceso
router = APIRouter()
def buscar_usuario_por_correo(correo: str):
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT
                    id,
                    nombre,
                    correo,
                    password_hash,
                    rol_id,
                    departamento_id,
                    activo
                FROM usuarios
                WHERE LOWER(correo) = LOWER(:correo)
                LIMIT 1
            """),
            {"correo": correo}
        )

        usuario = resultado.mappings().first()
    return dict(usuario) if usuario else None


def autenticar_usuario(correo: str, contrasena: str):
    usuario = buscar_usuario_por_correo(correo)
    if usuario is None:
        return None
    if not usuario["activo"]:
        return None
    if not usuario["password_hash"]:
        return None
    if not verificar_contrasena(
        contrasena,
        usuario["password_hash"]
    ):
        return None
    return usuario

@router.get("/auth/verificar")
def verificar_acceso(
    usuario_id: int = Depends(obtener_usuario_id)
):
    with engine.connect() as connection:
        usuario = connection.execute(
            text("""
                SELECT
                    u.id,
                    u.nombre,
                    u.correo,
                    u.rol_id,
                    r.nombre AS rol
                FROM usuarios u
                LEFT JOIN roles r ON u.rol_id = r.id
                WHERE u.id = :usuario_id
            """),
            {"usuario_id": usuario_id}
        ).mappings().first()

    if usuario is None:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    return {
        "mensaje": "Acceso autorizado",
        "usuario_id": usuario["id"],
        "nombre": usuario["nombre"],
        "correo": usuario["correo"],
        "rol_id": usuario["rol_id"],
        "rol": usuario["rol"],
        "es_administrador": (
            (usuario["rol"] or "").strip().lower()
            == "administrador"
        )
    }

@router.post("/auth/login")
def iniciar_sesion(datos: InicioSesion):
    usuario = autenticar_usuario(
        datos.correo,
        datos.contrasena
    )

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = crear_token_acceso(usuario["id"])

    return {
        "access_token": token,
        "token_type": "bearer"
    }