from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Event, Sponsor
from app.schemas import EventResponse, EventBase

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[EventResponse])
async def list_events(
    category: str | None = Query(None, description="Filter by category"),
    upcoming: bool | None = Query(None, description="Filter upcoming or past"),
    db: AsyncSession = Depends(get_db),
):
    query = select(Event).options(selectinload(Event.sponsors)).order_by(Event.date.desc())

    if category:
        query = query.where(func.lower(Event.category) == category.lower())
    if upcoming is not None:
        if upcoming:
            query = query.where(Event.date >= func.now())
        else:
            query = query.where(Event.date < func.now())

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Event).options(selectinload(Event.sponsors)).where(Event.id == event_id)
    )
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("/{event_id}/interest")
async def register_interest(event_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event.interest_count = (event.interest_count or 0) + 1
    await db.commit()
    await db.refresh(event)
    return {"status": "success", "interest_count": event.interest_count}
