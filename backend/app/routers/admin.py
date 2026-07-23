"""Admin CRUD endpoints — all require JWT authentication."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event, Project, TeamMember, GalleryImage, Sponsor
from app.schemas import (
    EventBase, EventResponse,
    ProjectBase, ProjectResponse,
    TeamMemberBase, TeamMemberResponse,
    GalleryImageBase, GalleryImageResponse,
    SponsorBase, SponsorResponse,
)
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])


# ─── Events CRUD ───

@router.post("/events", response_model=EventResponse)
async def create_event(event: EventBase, db: AsyncSession = Depends(get_db)):
    db_event = Event(**event.model_dump())
    db.add(db_event)
    await db.commit()
    await db.refresh(db_event)
    return db_event


@router.put("/events/{event_id}", response_model=EventResponse)
async def update_event(event_id: UUID, event: EventBase, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).where(Event.id == event_id))
    db_event = result.scalar_one_or_none()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    for key, value in event.model_dump().items():
        setattr(db_event, key, value)
    await db.commit()
    await db.refresh(db_event)
    return db_event


@router.delete("/events/{event_id}")
async def delete_event(event_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).where(Event.id == event_id))
    db_event = result.scalar_one_or_none()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    await db.delete(db_event)
    await db.commit()
    return {"detail": "Deleted"}


# ─── Projects CRUD ───

@router.post("/projects", response_model=ProjectResponse)
async def create_project(project: ProjectBase, db: AsyncSession = Depends(get_db)):
    db_project = Project(**project.model_dump())
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    return db_project


@router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: UUID, project: ProjectBase, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    db_project = result.scalar_one_or_none()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in project.model_dump().items():
        setattr(db_project, key, value)
    await db.commit()
    await db.refresh(db_project)
    return db_project


@router.delete("/projects/{project_id}")
async def delete_project(project_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    db_project = result.scalar_one_or_none()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(db_project)
    await db.commit()
    return {"detail": "Deleted"}


# ─── Team CRUD ───

@router.post("/team", response_model=TeamMemberResponse)
async def create_member(member: TeamMemberBase, db: AsyncSession = Depends(get_db)):
    db_member = TeamMember(**member.model_dump())
    db.add(db_member)
    await db.commit()
    await db.refresh(db_member)
    return db_member


@router.put("/team/{member_id}", response_model=TeamMemberResponse)
async def update_member(member_id: UUID, member: TeamMemberBase, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TeamMember).where(TeamMember.id == member_id))
    db_member = result.scalar_one_or_none()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    for key, value in member.model_dump().items():
        setattr(db_member, key, value)
    await db.commit()
    await db.refresh(db_member)
    return db_member


@router.delete("/team/{member_id}")
async def delete_member(member_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TeamMember).where(TeamMember.id == member_id))
    db_member = result.scalar_one_or_none()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    await db.delete(db_member)
    await db.commit()
    return {"detail": "Deleted"}


# ─── Gallery CRUD ───

@router.post("/gallery", response_model=GalleryImageResponse)
async def create_gallery_image(image: GalleryImageBase, db: AsyncSession = Depends(get_db)):
    db_image = GalleryImage(**image.model_dump())
    db.add(db_image)
    await db.commit()
    await db.refresh(db_image)
    return db_image


@router.delete("/gallery/{image_id}")
async def delete_gallery_image(image_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(GalleryImage).where(GalleryImage.id == image_id))
    db_image = result.scalar_one_or_none()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
    await db.delete(db_image)
    await db.commit()
    return {"detail": "Deleted"}


# ─── Sponsors CRUD ───

@router.post("/sponsors", response_model=SponsorResponse)
async def create_sponsor(sponsor: SponsorBase, db: AsyncSession = Depends(get_db)):
    db_sponsor = Sponsor(**sponsor.model_dump())
    db.add(db_sponsor)
    await db.commit()
    await db.refresh(db_sponsor)
    return db_sponsor


@router.put("/sponsors/{sponsor_id}", response_model=SponsorResponse)
async def update_sponsor(sponsor_id: UUID, sponsor: SponsorBase, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Sponsor).where(Sponsor.id == sponsor_id))
    db_sponsor = result.scalar_one_or_none()
    if not db_sponsor:
        raise HTTPException(status_code=404, detail="Sponsor not found")
    for key, value in sponsor.model_dump().items():
        setattr(db_sponsor, key, value)
    await db.commit()
    await db.refresh(db_sponsor)
    return db_sponsor


@router.delete("/sponsors/{sponsor_id}")
async def delete_sponsor(sponsor_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Sponsor).where(Sponsor.id == sponsor_id))
    db_sponsor = result.scalar_one_or_none()
    if not db_sponsor:
        raise HTTPException(status_code=404, detail="Sponsor not found")
    await db.delete(db_sponsor)
    await db.commit()
    return {"detail": "Deleted"}
