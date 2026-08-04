import asyncio
from sqlalchemy import text
from app.database import engine

MIGRATIONS = [
    # Event: poster_url
    "ALTER TABLE events ADD COLUMN poster_url VARCHAR(500) DEFAULT NULL",
    # Project: level, level_color, level_emoji, show_sidebar
    "ALTER TABLE projects ADD COLUMN level VARCHAR(100) DEFAULT NULL",
    "ALTER TABLE projects ADD COLUMN level_color VARCHAR(20) DEFAULT '#34D9A6'",
    "ALTER TABLE projects ADD COLUMN level_emoji VARCHAR(10) DEFAULT NULL",
    "ALTER TABLE projects ADD COLUMN show_sidebar BOOLEAN NOT NULL DEFAULT true",
    # TeamMember: is_alumni, batch_year
    "ALTER TABLE team_members ADD COLUMN is_alumni BOOLEAN NOT NULL DEFAULT false",
    "ALTER TABLE team_members ADD COLUMN batch_year VARCHAR(20) DEFAULT NULL",
    # SiteContent: show_timeline
    "ALTER TABLE site_content ADD COLUMN show_timeline BOOLEAN NOT NULL DEFAULT false",
]

async def migrate():
    async with engine.begin() as conn:
        for sql in MIGRATIONS:
            try:
                await conn.execute(text(sql))
                col = sql.split("ADD COLUMN ")[1].split(" ")[0]
                table = sql.split("TABLE ")[1].split(" ")[0]
                print(f"  OK  {table}.{col}")
            except Exception as e:
                if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                    col = sql.split("ADD COLUMN ")[1].split(" ")[0]
                    table = sql.split("TABLE ")[1].split(" ")[0]
                    print(f"SKIP  {table}.{col} (already exists)")
                else:
                    print(f"ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(migrate())
