from fastapi import APIRouter, Depends
from sqlalchemy import select, case
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import TeamMember, TeamTier
from app.schemas import TeamMemberResponse

router = APIRouter(prefix="/team", tags=["team"])


@router.get("", response_model=list[TeamMemberResponse])
async def list_team(db: AsyncSession = Depends(get_db)):
    # Order by tier (core first, then lead, then member), then display_order
    tier_order = case(
        (TeamMember.tier == TeamTier.core, 0),
        (TeamMember.tier == TeamTier.lead, 1),
        (TeamMember.tier == TeamTier.member, 2),
        else_=3,
    )
    query = select(TeamMember).order_by(tier_order, TeamMember.display_order)
    result = await db.execute(query)
    return result.scalars().all()
