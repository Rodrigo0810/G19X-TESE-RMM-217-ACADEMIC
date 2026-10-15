from datetime import datetime, timedelta, timezone

import jwt
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash

from jwt_config import JWT_SECRET_KEY, JWT_ALGORITHM


password_hash = PasswordHash.recommended()


def generar_hash(contrasena: str) -> str:
    return password_hash.hash(contrasena)


def verificar_contrasena(
    contrasena: str,
    hash_guardado: str
) -> bool:
    return password_hash.verify(
        contrasena,
        hash_guardado
    )


def crear_token_acceso(usuario_id: int) -> str:
    fecha_actual = datetime.now(timezone.utc)

    datos_token = {
        "sub": str(usuario_id),
        "exp": fecha_actual + timedelta(minutes=30),
        "iat": fecha_actual
    }

    token = jwt.encode(
        datos_token,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )

    return token


def verificar_token_acceso(token: str):
    try:
        datos = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
            options={"require": ["sub", "exp", "iat"]}
        )

        usuario_id = int(datos["sub"])

        if usuario_id <= 0:
            return None

        return usuario_id

    except (InvalidTokenError, ValueError, TypeError):
        return None