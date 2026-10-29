"""
Prueba reproducible de permisos por rol para PluriOne.

Variables de entorno:
  PLURIONE_API_URL
  PLURIONE_LECTOR_CORREO
  PLURIONE_LECTOR_CONTRASENA
  PLURIONE_EDITOR_CORREO
  PLURIONE_EDITOR_CONTRASENA

No guarda ni imprime credenciales o tokens.
No crea, modifica ni elimina registros.
"""

import json
import os
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


API_URL = os.environ.get(
    "PLURIONE_API_URL",
    "http://127.0.0.1:8000"
).rstrip("/")

MODULOS = (
    "obligaciones",
    "auditorias",
    "controles",
    "evidencias",
    "riesgos",
    "alertas",
    "normativas",
    "departamentos",
    "indicadores",
)

resultados = []


def solicitar(metodo, ruta, token=None, datos=None):
    encabezados = {"Accept": "application/json"}

    if token:
        encabezados["Authorization"] = f"Bearer {token}"

    cuerpo = None

    if datos is not None:
        encabezados["Content-Type"] = "application/json"
        cuerpo = json.dumps(datos).encode("utf-8")

    peticion = Request(
        API_URL + ruta,
        data=cuerpo,
        headers=encabezados,
        method=metodo
    )

    try:
        with urlopen(peticion, timeout=10) as respuesta:
            contenido = respuesta.read()
            return respuesta.status, (
                json.loads(contenido) if contenido else {}
            )
    except HTTPError as error:
        return error.code, {}
    except URLError as error:
        raise RuntimeError(
            "No se pudo conectar con la API. "
            "Comprueba que FastAPI este iniciado."
        ) from error


def comprobar(nombre, recibido, esperado):
    correcto = recibido == esperado
    resultados.append(correcto)

    estado = "OK" if correcto else "FALLO"

    print(
        f"[{estado}] {nombre}: "
        f"HTTP {recibido} (esperado {esperado})"
    )


def iniciar_sesion(tipo):
    correo = os.environ[f"PLURIONE_{tipo}_CORREO"]
    contrasena = os.environ[f"PLURIONE_{tipo}_CONTRASENA"]

    codigo, respuesta = solicitar(
        "POST",
        "/auth/login",
        datos={
            "correo": correo,
            "contrasena": contrasena
        }
    )

    if codigo != 200 or not respuesta.get("access_token"):
        raise RuntimeError(
            f"No se pudo iniciar sesion con el usuario {tipo}. "
            f"HTTP {codigo}"
        )

    token = respuesta["access_token"]

    codigo, perfil = solicitar(
        "GET",
        "/auth/verificar",
        token=token
    )

    if codigo != 200:
        raise RuntimeError(
            f"No se pudo verificar el rol {tipo}. HTTP {codigo}"
        )

    rol = (perfil.get("rol") or "").strip().lower()

    if tipo == "LECTOR" and rol in (
        "administrador",
        "compliance"
    ):
        raise RuntimeError(
            "El usuario LECTOR tiene permisos de edicion."
        )

    if tipo == "EDITOR" and rol not in (
        "administrador",
        "compliance"
    ):
        raise RuntimeError(
            "El usuario EDITOR no tiene permisos de edicion."
        )

    print(f"Sesion {tipo}: rol {rol}")
    return token


def ejecutar():
    requeridas = (
        "PLURIONE_LECTOR_CORREO",
        "PLURIONE_LECTOR_CONTRASENA",
        "PLURIONE_EDITOR_CORREO",
        "PLURIONE_EDITOR_CONTRASENA",
    )

    faltantes = [
        nombre for nombre in requeridas
        if not os.environ.get(nombre)
    ]

    if faltantes:
        raise RuntimeError(
            "Faltan variables de entorno: "
            + ", ".join(faltantes)
        )

    lector = iniciar_sesion("LECTOR")
    editor = iniciar_sesion("EDITOR")

    print("\n=== PRUEBAS SIN AUTENTICACION ===")

    codigo, _ = solicitar("GET", "/obligaciones")
    comprobar("GET obligaciones sin token", codigo, 401)

    print("\n=== PRUEBAS DE SOLO LECTURA ===")

    for modulo in MODULOS:
        codigo, _ = solicitar(
            "GET",
            f"/{modulo}",
            token=lector
        )
        comprobar(f"LECTOR GET {modulo}", codigo, 200)

        codigo, _ = solicitar(
            "POST",
            f"/{modulo}",
            token=lector,
            datos={}
        )
        comprobar(f"LECTOR POST {modulo}", codigo, 403)

    print("\n=== PRUEBAS DE EDICION ===")

    for modulo in MODULOS:
        codigo, _ = solicitar(
            "GET",
            f"/{modulo}",
            token=editor
        )
        comprobar(f"EDITOR GET {modulo}", codigo, 200)

        codigo, _ = solicitar(
            "POST",
            f"/{modulo}",
            token=editor,
            datos={}
        )
        comprobar(f"EDITOR POST {modulo}", codigo, 422)

    print("\n=== PRUEBAS DE ADMINISTRACION ===")

    codigo, _ = solicitar(
        "GET",
        "/usuarios",
        token=lector
    )
    comprobar("LECTOR GET usuarios", codigo, 403)

    codigo, _ = solicitar(
        "GET",
        "/roles",
        token=lector
    )
    comprobar("LECTOR GET roles", codigo, 403)

    total = len(resultados)
    aprobadas = sum(resultados)
    fallidas = total - aprobadas

    print("\n=== RESUMEN FINAL ===")
    print(f"Pruebas totales: {total}")
    print(f"Pruebas aprobadas: {aprobadas}")
    print(f"Pruebas fallidas: {fallidas}")

    if fallidas:
        return 1

    print("RESULTADO: TODAS LAS PRUEBAS APROBADAS")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(ejecutar())
    except (RuntimeError, KeyError, ValueError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)