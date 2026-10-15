from datetime import date
from typing import Optional
from pydantic import BaseModel, Field

class NormativaCrear(BaseModel):
    nombre: str = Field(..., max_length=200)
    tipo: str = Field(..., max_length=100)
    descripcion: Optional[str] = None
    organismo_emisor: Optional[str] = Field(None, max_length=200)
    hipervinculo: Optional[str] = None
    fecha_publicacion: Optional[date] = None
    activa: bool = True