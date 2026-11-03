from datetime import date
from typing import Optional
from pydantic import field_validator, BaseModel, Field

class NormativaCrear(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=200)
    tipo: str = Field(..., max_length=100)
    descripcion: Optional[str] = None
    organismo_emisor: Optional[str] = Field(None, max_length=200)
    hipervinculo: Optional[str] = None
    fecha_publicacion: Optional[date] = None
    activa: bool = True
    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, valor):
        return valor.strip() if isinstance(valor, str) else valor
