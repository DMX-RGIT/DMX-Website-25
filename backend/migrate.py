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

    await conn.execute("""
        ALTER TABLE gallery_images
        ADD COLUMN IF NOT EXISTS date TIMESTAMP WITH TIME ZONE DEFAULT NULL;
    """)
    print("DONE: Added date column to gallery_images table")

    await conn.execute("""
        UPDATE gallery_images
        SET date = events.date
        FROM events
        WHERE gallery_images.event_id = events.id AND gallery_images.date IS NULL;
    """)
    print("DONE: Backfilled existing gallery image dates from linked events")

    await conn.close()
    print("Migration complete!")


asyncio.run(run_migration())
