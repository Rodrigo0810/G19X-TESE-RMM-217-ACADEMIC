from typing import Optional
from pydantic import field_validator, EmailStr, BaseModel, Field
class UsuarioCrear(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=150)
    correo: EmailStr = Field(..., max_length=255)
    entra_id: Optional[str] = Field(None, max_length=255)
    rol_id: Optional[int] = None
    departamento_id: Optional[int] = None
    activo: bool = True

    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, valor):
        return valor.strip() if isinstance(valor, str) else valor
class UsuarioRegistro(UsuarioCrear):
    contrasena: str = Field(..., min_length=12, max_length=128)
