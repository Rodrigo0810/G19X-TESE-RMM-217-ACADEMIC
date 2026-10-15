import os
from pathlib import Path

from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

if not JWT_SECRET_KEY or len(JWT_SECRET_KEY) < 64:
    raise RuntimeError(
        "JWT_SECRET_KEY no está configurada correctamente en .env"
    )

if JWT_ALGORITHM != "HS256":
    raise RuntimeError(
        "JWT_ALGORITHM debe ser HS256"
    )