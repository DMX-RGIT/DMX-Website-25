from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import engine, Base
from app.routers import events, projects, team, gallery, sponsors, stats, auth, admin

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup (use Alembic migrations in production)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="DMX API",
    description="Backend API for DMX (DataMatrix) — RGIT Mumbai's AI & ML Committee",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(events.router, prefix="/api/v1")
app.include_router(projects.router, prefix="/api/v1")
app.include_router(team.router, prefix="/api/v1")
app.include_router(gallery.router, prefix="/api/v1")
app.include_router(sponsors.router, prefix="/api/v1")
app.include_router(stats.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "DMX API", "docs": "/docs"}
