from datetime import date
from typing import Optional, Literal
from pydantic import BaseModel, Field

class ObligacionCrear(BaseModel):
    normativa_id: Optional[int] = None
    departamento_id: Optional[int] = None
    nombre: str = Field(..., max_length=200)
    descripcion: Optional[str] = None
    responsable: Optional[str] = Field(default=None, max_length=150)
    fecha_limite: Optional[date] = None
    estado: Literal[
        "Pendiente",
        "En progreso",
        "Cumplida",
        "Vencida"
    ] = "Pendiente"
    nivel_riesgo: Optional[
        Literal["Bajo", "Medio", "Alto", "Critico"]
    ] = None