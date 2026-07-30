import asyncio
from sqlalchemy import text
from app.database import engine

async def migrate():
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE join_requests ADD COLUMN mobile_number VARCHAR(20) NOT NULL DEFAULT ''"))
            print("Successfully added mobile_number column")
        except Exception as e:
            print("Error or already exists:", e)

if __name__ == "__main__":
    asyncio.run(migrate())
