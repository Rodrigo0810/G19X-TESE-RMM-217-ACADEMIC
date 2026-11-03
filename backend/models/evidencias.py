from datetime import date
from typing import Optional, Literal
from pydantic import field_validator, BaseModel, Field

class EvidenciaCrear(BaseModel):
    obligacion_id: Optional[int] = None
    auditoria_id: Optional[int] = None
    control_id: Optional[int] = None
    nombre: str = Field(..., min_length=1, max_length=200)
    tipo: Optional[str] = Field(None, max_length=100)
    ubicacion: Optional[str] = None
    descripcion: Optional[str] = None
    fecha_documento: Optional[date] = None
    estado: Literal[
        "Pendiente",
        "Validada",
        "Rechazada"
    ] = "Pendiente"
    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, valor):
        return valor.strip() if isinstance(valor, str) else valor
