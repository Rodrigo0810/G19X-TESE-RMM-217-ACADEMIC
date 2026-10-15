from typing import Optional
from pydantic import BaseModel, Field

class RolCrear(BaseModel):
    nombre: str = Field(..., max_length=150)
    descripcion: Optional[str] = None