from pydantic import BaseModel, EmailStr, Field
class InicioSesion(BaseModel):
    correo: EmailStr
    contrasena: str = Field(min_length=1)