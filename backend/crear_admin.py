from getpass import getpass
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from database import engine
from seguridad import generar_hash

def crear_primer_administrador():
    with engine.connect() as conexion:
        administradores = conexion.execute(
            text("""
                SELECT COUNT(*)
                FROM usuarios u
                JOIN roles r ON u.rol_id = r.id
                WHERE r.nombre = 'Administrador'
            """)
        ).scalar_one()
        if administradores > 0:
            print("Ya existe un administrador. No se creará otro.")
            return
        rol_id = conexion.execute(
            text("""
                SELECT id FROM roles
                WHERE nombre = 'Administrador'
            """)
        ).scalar_one_or_none()
    if rol_id is None:
        print("Error: no existe el rol Administrador.")
        print("Ejecuta primero database/schema.sql.")
        return
    nombre = input("Nombre del administrador: ").strip()
    correo = input("Correo del administrador: ").strip().lower()
    if not nombre or len(nombre) > 150:
        print("Error: el nombre debe tener entre 1 y 150 caracteres.")
        return
    if not correo or len(correo) > 255:
        print("Error: correo inválido.")
        return
    contrasena = getpass("Contraseña (12 a 128 caracteres): ")
    confirmacion = getpass("Confirma la contraseña: ")
    if not 12 <= len(contrasena) <= 128:
        print("Error: la contraseña debe tener entre 12 y 128 caracteres.")
        return
    if contrasena != confirmacion:
        print("Error: las contraseñas no coinciden.")
        return
    hash_seguro = generar_hash(contrasena)
    try:
        with engine.begin() as conexion:
            # Bloquea la creación simultánea del primer administrador.
            conexion.execute(
                text("LOCK TABLE usuarios IN SHARE ROW EXCLUSIVE MODE")
            )
            existentes = conexion.execute(
                text("""
                    SELECT COUNT(*)
                    FROM usuarios u
                    JOIN roles r ON u.rol_id = r.id
                    WHERE r.nombre = 'Administrador'
                """)
            ).scalar_one()

            if existentes > 0:
                print("Ya existe un administrador. No se creará otro.")
                return
            conexion.execute(
                text("""
                    INSERT INTO usuarios (
                        nombre,
                        correo,
                        rol_id,
                        activo,
                        password_hash
                    )
                    VALUES (
                        :nombre,
                        :correo,
                        :rol_id,
                        TRUE,
                        :password_hash
                    )
                """),
                {
                    "nombre": nombre,
                    "correo": correo,
                    "rol_id": rol_id,
                    "password_hash": hash_seguro,
                }
            )
        print("Administrador inicial creado correctamente.")
    except IntegrityError:
        print("Error: el correo ya existe o hay datos inválidos.")
if __name__ == "__main__":
    crear_primer_administrador()