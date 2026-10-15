from sqlalchemy import text
from database import engine

try:
    with engine.connect() as connection:
        resultado = connection.execute(
            text("SELECT current_database(), current_user")
        )

        base_datos, usuario = resultado.fetchone()

        print("Conexion exitosa")
        print(f"Base de datos: {base_datos}")
        print(f"Usuario: {usuario}")

except Exception as error:
    print("No se pudo conectar a PostgreSQL.")
    print(f"Error: {error}")