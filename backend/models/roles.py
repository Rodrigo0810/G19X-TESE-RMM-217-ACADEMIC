from typing import Optional
from pydantic import BaseModel, Field, field_validator

class RolCrear(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=150)
    descripcion: Optional[str] = None
    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, valor):
        return valor.strip() if isinstance(valor, str) else valor
