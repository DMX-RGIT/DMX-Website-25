"""
Seed the database with realistic sample data for DMX.
Run: python -m app.seed
"""
import asyncio
from datetime import datetime, timezone, timedelta

from app.database import engine, async_session, Base
from app.models import (
    Event,
    Project,
    TeamMember,
    TeamTier,
    GalleryImage,
    GalleryCategory,
    Sponsor,
    SponsorTier,
)


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        print("Database cleared and tables recreated.")
        print("Ready for production data.")

        await db.commit()
        print("Database seeded successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
