from datetime import date
from typing import Optional, Literal
from pydantic import field_validator, BaseModel, Field

class AuditoriaCrear(BaseModel):
    nombre: str = Field(min_length=1, max_length=200)
    descripcion: Optional[str] = None
    departamento_id: Optional[int] = None
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    estado: Literal[
        "Programada",
        "En progreso",
        "Completada",
        "Cancelada"
    ] = "Programada"
    resultado: Optional[str] = None
    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, valor):
        return valor.strip() if isinstance(valor, str) else valor
