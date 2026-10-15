from typing import Optional, Literal
from pydantic import BaseModel, Field

class RiesgoCrear(BaseModel):
    obligacion_id: Optional[int] = None
    auditoria_id: Optional[int] = None
    control_id: Optional[int] = None
    nombre: str = Field(..., max_length=200)
    descripcion: Optional[str] = None
    nivel: Literal[
        "Bajo",
        "Medio",
        "Alto",
        "Critico"
    ]
    probabilidad: Optional[int] = Field(None, ge=1, le=5)
    impacto: Optional[int] = Field(None, ge=1, le=5)
    estado: Literal[
        "Abierto",
        "En tratamiento",
        "Mitigado",
        "Cerrado"
    ] = "Abierto"