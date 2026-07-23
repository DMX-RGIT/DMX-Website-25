from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


# --- Event Schemas ---

class EventBase(BaseModel):
    title: str
    description: str
    category: str
    date: datetime
    end_date: datetime | None = None
    venue: str
    registration_url: str | None = None
    image_url: str | None = None
    is_flagship: bool = False
    is_upcoming: bool = True


class EventResponse(EventBase):
    id: UUID
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


# --- Project Schemas ---

class ProjectBase(BaseModel):
    title: str
    description: str
    long_description: str | None = None
    domain: str
    tech_stack: list[str] = []
    github_url: str | None = None
    demo_url: str | None = None
    image_url: str | None = None
    contributors: list[dict] = []
    is_featured: bool = False


class ProjectResponse(ProjectBase):
    id: UUID
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


# --- Team Member Schemas ---

class TeamMemberBase(BaseModel):
    name: str
    role: str
    tier: str
    year: str | None = None
    photo_url: str | None = None
    fun_fact: str | None = None
    social_links: dict = {}
    display_order: int = 0


class TeamMemberResponse(TeamMemberBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Gallery Image Schemas ---

class GalleryImageBase(BaseModel):
    image_url: str
    caption: str | None = None
    category: str
    event_id: UUID | None = None


class GalleryImageResponse(GalleryImageBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Sponsor Schemas ---

class SponsorBase(BaseModel):
    name: str
    logo_url: str
    website_url: str | None = None
    tier: str
    display_order: int = 0


class SponsorResponse(SponsorBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


# --- Stats ---

class StatsResponse(BaseModel):
    members: int
    projects: int
    events: int
    papers: int
