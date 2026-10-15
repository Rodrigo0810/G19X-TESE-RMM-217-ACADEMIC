from datetime import date
from typing import Optional
from pydantic import BaseModel, Field

class IndicadorCrear(BaseModel):
    nombre: str = Field(..., max_length=200)
    descripcion: Optional[str] = None
    categoria: Optional[str] = Field(None, max_length=100)
    valor: Optional[float] = None
    unidad: Optional[str] = Field(None, max_length=50)
    periodo_inicio: Optional[date] = None
    periodo_fin: Optional[date] = None