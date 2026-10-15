from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, ProgrammingError
from database import engine
from models.controles import ControlCrear
router = APIRouter()

@router.get("/controles")
def listar_controles():
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT
                    id,
                    obligacion_id,
                    departamento_id,
                    nombre,
                    descripcion,
                    responsable,
                    estado,
                    nivel_riesgo,
                    fecha_creacion
                FROM controles
                ORDER BY id
            """)
        )
        controles = resultado.mappings().all()
    return [dict(control) for control in controles]

@router.post("/controles", status_code=201)
def crear_control(control: ControlCrear):
    datos = control.model_dump()
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    INSERT INTO controles (
                        obligacion_id,
                        departamento_id,
                        nombre,
                        descripcion,
                        responsable,
                        estado,
                        nivel_riesgo
                    )
                    VALUES (
                        :obligacion_id,
                        :departamento_id,
                        :nombre,
                        :descripcion,
                        :responsable,
                        :estado,
                        :nivel_riesgo
                    )
                    RETURNING
                        id,
                        obligacion_id,
                        departamento_id,
                        nombre,
                        descripcion,
                        responsable,
                        estado,
                        nivel_riesgo,
                        fecha_creacion
                """),
                datos
            )
            nuevo_control = resultado.mappings().first()
        return dict(nuevo_control)
    except IntegrityError:
        raise HTTPException(
            status_code=400,
            detail="La obligacion o el departamento indicado no existe."
        )

@router.put("/controles/{control_id}")
def actualizar_control(
    control_id: int,
    control: ControlCrear
):
    datos = control.model_dump()
    datos["id"] = control_id
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    UPDATE controles
                    SET
                        obligacion_id = :obligacion_id,
                        departamento_id = :departamento_id,
                        nombre = :nombre,
                        descripcion = :descripcion,
                        responsable = :responsable,
                        estado = :estado,
                        nivel_riesgo = :nivel_riesgo
                    WHERE id = :id
                    RETURNING
                        id,
                        obligacion_id,
                        departamento_id,
                        nombre,
                        descripcion,
                        responsable,
                        estado,
                        nivel_riesgo,
                        fecha_creacion
                """),
                datos
            )
            control_actualizado = resultado.mappings().first()
        if control_actualizado is None:
            raise HTTPException(
                status_code=404,
                detail="Control no encontrado"
            )
        return dict(control_actualizado)
    except IntegrityError:
        raise HTTPException(
            status_code=400,
            detail="La obligacion o el departamento indicado no existe."
        )

@router.delete("/controles/{control_id}")
def eliminar_control(control_id: int):
    try:
        with engine.begin() as connection:
            resultado = connection.execute(
                text("""
                    DELETE FROM controles
                    WHERE id = :id
                    RETURNING id, nombre
                """),
                {"id": control_id}
            )
            control_eliminado = resultado.mappings().first()

        if control_eliminado is None:
            raise HTTPException(
                status_code=404,
                detail="Control no encontrado"
            )
        return {
            "mensaje": "Control eliminado correctamente",
            "control": dict(control_eliminado)
        }
    except (IntegrityError, ProgrammingError):
        raise HTTPException(
            status_code=409,
            detail="No se puede eliminar este control porque tiene evidencias o riesgos relacionados."
        )