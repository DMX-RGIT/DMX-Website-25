from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.config import get_settings
from app.database import engine, Base
from app.routers import events, projects, team, gallery, sponsors, content, auth, admin, join, gamescores

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # Apply safe migrations for columns added after initial table creation
        migrations = [
            "ALTER TABLE events ADD COLUMN IF NOT EXISTS poster_url VARCHAR(500) DEFAULT NULL",
            "ALTER TABLE projects ADD COLUMN IF NOT EXISTS level VARCHAR(100) DEFAULT NULL",
            "ALTER TABLE projects ADD COLUMN IF NOT EXISTS level_color VARCHAR(20) DEFAULT '#34D9A6'",
            "ALTER TABLE projects ADD COLUMN IF NOT EXISTS level_emoji VARCHAR(10) DEFAULT NULL",
            "ALTER TABLE projects ADD COLUMN IF NOT EXISTS show_sidebar BOOLEAN NOT NULL DEFAULT true",
            "ALTER TABLE team_members ADD COLUMN IF NOT EXISTS is_alumni BOOLEAN NOT NULL DEFAULT false",
            "ALTER TABLE team_members ADD COLUMN IF NOT EXISTS batch_year VARCHAR(20) DEFAULT NULL",
            "ALTER TABLE site_content ADD COLUMN IF NOT EXISTS show_timeline BOOLEAN NOT NULL DEFAULT false",
            "ALTER TABLE sponsors ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true",
            "ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS date TIMESTAMP WITH TIME ZONE DEFAULT NULL",
            "UPDATE gallery_images SET date = events.date FROM events WHERE gallery_images.event_id = events.id AND gallery_images.date IS NULL",
        ]
        for sql in migrations:
            try:
                await conn.execute(text(sql))
            except Exception as e:
                print(f"[Migration warning]: {e}")
    yield
    await engine.dispose()


app = FastAPI(
    title="DMX API",
    description="Backend API for DMX (DataMatrix) — RGIT Mumbai's Computer Engineering Committee",
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
app.include_router(content.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(join.router, prefix="/api/v1")
app.include_router(gamescores.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "DMX API", "docs": "/docs"}


@app.get("/health")
async def health():   # Intentionally no Db check to avoid waking neon on every hit
    return {"status": "ok"}
