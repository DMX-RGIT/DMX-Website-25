from fastapi import APIRouter

from app.schemas import StatsResponse

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=StatsResponse)
async def get_stats():
    # In production these would come from the database.
    # For now, return curated numbers that match DMX's actual scale.
    return StatsResponse(
        members=500,
        projects=50,
        events=15,
        papers=10,
    )
