from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event, EventCategory
from app.schemas import EventResponse

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[EventResponse])
async def list_events(
    category: str | None = Query(None, description="Filter by category"),
    upcoming: bool | None = Query(None, description="Filter upcoming or past"),
    db: AsyncSession = Depends(get_db),
):
    query = select(Event).order_by(Event.date.desc())

    if category:
        query = query.where(Event.category == category)
    if upcoming is not None:
        query = query.where(Event.is_upcoming == upcoming)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Event not found")
    return event
