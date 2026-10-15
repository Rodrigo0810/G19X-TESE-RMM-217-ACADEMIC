from typing import Optional, Literal
from pydantic import BaseModel, Field

class ControlCrear(BaseModel):
    obligacion_id: Optional[int] = None
    departamento_id: Optional[int] = None
    nombre: str = Field(..., max_length=200)
    descripcion: Optional[str] = None
    responsable: Optional[str] = Field(None, max_length=150)
    estado: Literal[
        "Pendiente",
        "En progreso",
        "Implementado",
        "Fallido"
    ] = "Pendiente"
    nivel_riesgo: Optional[
        Literal["Bajo", "Medio", "Alto", "Critico"]
    ] = None