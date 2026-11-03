from datetime import date
from typing import Optional, Literal
from pydantic import field_validator, BaseModel, Field

class ObligacionCrear(BaseModel):
    normativa_id: Optional[int] = None
    departamento_id: Optional[int] = None
    nombre: str = Field(..., min_length=1, max_length=200)
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
    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, valor):
        return valor.strip() if isinstance(valor, str) else valor
