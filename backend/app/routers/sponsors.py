from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Sponsor
from app.schemas import SponsorResponse

router = APIRouter(prefix="/sponsors", tags=["sponsors"])


@router.get("", response_model=list[SponsorResponse])
async def list_sponsors(
    active_only: bool = Query(False, description="If true, only return active sponsors"),
    db: AsyncSession = Depends(get_db),
):
    query = select(Sponsor).order_by(Sponsor.tier, Sponsor.display_order)
    if active_only:
        query = query.where(Sponsor.is_active == True)
    result = await db.execute(query)
    return result.scalars().all()
