from datetime import date
from typing import Optional
from pydantic import field_validator, BaseModel, Field

class IndicadorCrear(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=200)
    descripcion: Optional[str] = None
    categoria: Optional[str] = Field(None, max_length=100)
    valor: Optional[float] = None
    unidad: Optional[str] = Field(None, max_length=50)
    periodo_inicio: Optional[date] = None
    periodo_fin: Optional[date] = None
    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, valor):
        return valor.strip() if isinstance(valor, str) else valor
