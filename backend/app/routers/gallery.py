from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import GalleryImage
from app.schemas import GalleryImageResponse

router = APIRouter(prefix="/gallery", tags=["gallery"])


@router.get("", response_model=list[GalleryImageResponse])
async def list_gallery(
    category: str | None = Query(None, description="Filter by category"),
    db: AsyncSession = Depends(get_db),
):
    query = select(GalleryImage).order_by(GalleryImage.created_at.desc())

    if category:
        query = query.where(GalleryImage.category == category)

    result = await db.execute(query)
    return result.scalars().all()
