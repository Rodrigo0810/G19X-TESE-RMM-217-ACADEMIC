from typing import Optional, Literal
from pydantic import field_validator, BaseModel, Field

class ControlCrear(BaseModel):
    obligacion_id: Optional[int] = None
    departamento_id: Optional[int] = None
    nombre: str = Field(..., min_length=1, max_length=200)
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
    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, valor):
        return valor.strip() if isinstance(valor, str) else valor
