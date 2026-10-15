from typing import Optional
from pydantic import BaseModel, Field

class DepartamentoCrear(BaseModel):
    nombre: str = Field(..., max_length=150)
    descripcion: Optional[str] = None
    activo: bool = True