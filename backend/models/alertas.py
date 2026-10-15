from typing import Optional, Literal
from pydantic import BaseModel, Field

class AlertaCrear(BaseModel):
    obligacion_id: Optional[int] = None
    riesgo_id: Optional[int] = None
    titulo: str = Field(..., max_length=200)
    mensaje: str
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