from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import text

from database import engine
from seguridad import verificar_token_acceso


esquema_seguridad = HTTPBearer(auto_error=False)


def obtener_usuario_id(
    credenciales: HTTPAuthorizationCredentials = Depends(
        esquema_seguridad
    )
):
    if credenciales is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Debes iniciar sesión para acceder",
            headers={"WWW-Authenticate": "Bearer"}
        )

    usuario_id = verificar_token_acceso(
        credenciales.credentials
    )

    if usuario_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"}
        )

    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT id, activo, rol_id
                FROM usuarios
                WHERE id = :usuario_id
            """),
            {"usuario_id": usuario_id}
        )

        usuario = resultado.mappings().first()

    if usuario is None or not usuario["activo"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inexistente o inactivo",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return usuario_id

def verificar_administrador(
    usuario_id: int = Depends(obtener_usuario_id)
):
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT r.nombre
                FROM usuarios u
                JOIN roles r ON u.rol_id = r.id
                WHERE u.id = :usuario_id
            """),
            {"usuario_id": usuario_id}
        )

        rol = resultado.scalar_one_or_none()

    if rol is None or rol.strip().lower() != "administrador":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos de administrador"
        )

    return usuario_id

def verificar_puede_editar(
    usuario_id: int = Depends(obtener_usuario_id)
):
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT r.nombre
                FROM usuarios u
                JOIN roles r ON u.rol_id = r.id
                WHERE u.id = :usuario_id
            """),
            {"usuario_id": usuario_id}
        )

        rol = resultado.scalar_one_or_none()

    if rol is None or rol.strip().lower() not in (
        "administrador",
        "compliance"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para modificar esta información"
        )

    return usuario_id