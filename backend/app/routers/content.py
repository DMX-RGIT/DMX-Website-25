from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import SiteContent
from app.schemas import SiteContentResponse

router = APIRouter(prefix="/content", tags=["content"])


@router.get("", response_model=SiteContentResponse)
async def get_content(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SiteContent).where(SiteContent.id == 1))
    content = result.scalar_one_or_none()
    if not content:
        # Return default if not seeded
        return {"id": 1, "stats": {"members": 0, "projects": 0, "events": 0, "papers": 0}, "about_text": None, "terminal_code": None, "testimonials": []}
    return content
