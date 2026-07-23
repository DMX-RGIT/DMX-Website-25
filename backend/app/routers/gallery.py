from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import GalleryImage
from app.schemas import GalleryImageResponse

router = APIRouter(prefix="/gallery", tags=["gallery"])


from uuid import UUID

@router.get("", response_model=list[GalleryImageResponse])
async def list_gallery(
    category: str | None = Query(None, description="Filter by category"),
    event_id: UUID | None = Query(None, description="Filter by event"),
    db: AsyncSession = Depends(get_db),
):
    query = select(GalleryImage).order_by(GalleryImage.created_at.desc())

    if category:
        query = query.where(GalleryImage.category == category)
    if event_id:
        query = query.where(GalleryImage.event_id == event_id)

    result = await db.execute(query)
    return result.scalars().all()
