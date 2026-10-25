from typing import Optional
from pydantic import BaseModel, Field
class UsuarioCrear(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=150)
    correo: str = Field(..., min_length=3, max_length=255)
    entra_id: Optional[str] = Field(None, max_length=255)
    rol_id: Optional[int] = None
    departamento_id: Optional[int] = None
    activo: bool = True
class UsuarioRegistro(UsuarioCrear):
    contrasena: str = Field(..., min_length=12, max_length=128)
