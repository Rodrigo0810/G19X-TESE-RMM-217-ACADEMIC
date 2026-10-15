from fastapi import FastAPI, Depends
from dependencias_auth import obtener_usuario_id, verificar_administrador
from fastapi.middleware.cors import CORSMiddleware

from routers.obligaciones import router as obligaciones_router
from routers.auditorias import router as auditorias_router
from routers.controles import router as controles_router
from routers.evidencias import router as evidencias_router
from routers.riesgos import router as riesgos_router
from routers.alertas import router as alertas_router
from routers.departamentos import router as departamentos_router
from routers.normativas import router as normativas_router
from routers.indicadores import router as indicadores_router
from routers.roles import router as roles_router
from routers.usuarios import router as usuarios_router
from routers import autenticacion

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    obligaciones_router,
    dependencies=[Depends(obtener_usuario_id)]
)
app.include_router(
    auditorias_router,
    dependencies=[Depends(obtener_usuario_id)]
)
app.include_router(
    controles_router,
    dependencies=[Depends(obtener_usuario_id)]
)
app.include_router(
    evidencias_router,
    dependencies=[Depends(obtener_usuario_id)]
)
app.include_router(
    riesgos_router,
    dependencies=[Depends(obtener_usuario_id)]
)
app.include_router(
    alertas_router,
    dependencies=[Depends(obtener_usuario_id)]
)
app.include_router(
    departamentos_router,
    dependencies=[Depends(obtener_usuario_id)]
)
app.include_router(
    normativas_router,
    dependencies=[Depends(obtener_usuario_id)]
)
app.include_router(
    indicadores_router,
    dependencies=[Depends(obtener_usuario_id)]
)
app.include_router(
    roles_router,
    dependencies=[Depends(verificar_administrador)]
)
app.include_router(
    usuarios_router,
    dependencies=[Depends(verificar_administrador)]
)
app.include_router(autenticacion.router)