from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Sponsor
from app.schemas import SponsorResponse

router = APIRouter(prefix="/sponsors", tags=["sponsors"])


@router.get("", response_model=list[SponsorResponse])
async def list_sponsors(db: AsyncSession = Depends(get_db)):
    query = select(Sponsor).order_by(Sponsor.tier, Sponsor.display_order)
    result = await db.execute(query)
    return result.scalars().all()
