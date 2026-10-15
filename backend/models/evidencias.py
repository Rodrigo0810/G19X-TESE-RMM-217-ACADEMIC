from datetime import date
from typing import Optional, Literal
from pydantic import BaseModel, Field

class EvidenciaCrear(BaseModel):
    obligacion_id: Optional[int] = None
    auditoria_id: Optional[int] = None
    control_id: Optional[int] = None
    nombre: str = Field(..., max_length=200)
    tipo: Optional[str] = Field(None, max_length=100)
    ubicacion: Optional[str] = None
    descripcion: Optional[str] = None
    fecha_documento: Optional[date] = None
    estado: Literal[
        "Pendiente",
        "Validada",
        "Rechazada"
    ] = "Pendiente"