from typing import Optional, Literal
from pydantic import BaseModel, Field, field_validator

class AlertaCrear(BaseModel):
    obligacion_id: Optional[int] = None
    riesgo_id: Optional[int] = None
    titulo: str = Field(..., min_length=1, max_length=200)
    mensaje: str = Field(..., min_length=1)
    nivel: Literal[
        "Bajo",
        "Medio",
        "Alto",
        "Critico"
    ] = "Medio"
    estado: Literal[
        "Pendiente",
        "Atendida",
        "Descartada"
    ] = "Pendiente"
    @field_validator("titulo", "mensaje", mode="before")
    @classmethod
    def validar_texto_obligatorio(cls, valor):
        return valor.strip() if isinstance(valor, str) else valor
