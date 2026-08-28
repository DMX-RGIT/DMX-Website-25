"""
DMX Database Migration Script
Adds:
  - is_active column to sponsors table
  - event_sponsors association table

Run: python migrate.py
"""
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")


async def run_migration():
    import asyncpg

    ssl = "neon.tech" in DATABASE_URL

    conn = await asyncpg.connect(
        DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://"),
        ssl=ssl
    )

    print("Connected to database.")

    await conn.execute("""
        ALTER TABLE sponsors
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
    """)
    print("DONE: Added is_active column to sponsors table")

    await conn.execute("""
        CREATE TABLE IF NOT EXISTS event_sponsors (
            event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
            sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
            PRIMARY KEY (event_id, sponsor_id)
        );
    """)
    print("DONE: Created event_sponsors association table")

    await conn.close()
    print("Migration complete!")


asyncio.run(run_migration())
