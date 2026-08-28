from datetime import datetime, timezone
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, model_validator


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
    poster_url: str | None = None
    is_flagship: bool = False
    is_upcoming: bool = True  # Kept for admin form; overridden in response
    sponsor_ids: list[UUID] | None = None  # IDs of sponsors linked to this event


class EventResponse(EventBase):
    id: UUID
    interest_count: int
    created_at: datetime
    updated_at: datetime | None = None
    sponsors: list["SponsorResponse"] = []  # Sponsors linked to this event

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="after")
    def compute_upcoming(self) -> "EventResponse":
        """Override the stored is_upcoming with a date-based computation."""
        self.is_upcoming = self.date.replace(tzinfo=timezone.utc) >= datetime.now(timezone.utc) if self.date.tzinfo is None else self.date >= datetime.now(timezone.utc)
        return self


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
    level: str | None = None
    level_color: str | None = "#34D9A6"
    level_emoji: str | None = None
    show_sidebar: bool = True


class ProjectResponse(ProjectBase):
    id: UUID
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


# --- Team Member Schemas ---

class TeamMemberBase(BaseModel):
    name: str
    role: str
    department: str | None = None
    tier: str
    year: str | None = None
    photo_url: str | None = None
    fun_fact: str | None = None
    social_links: dict = {}
    display_order: int = 0
    is_alumni: bool = False
    batch_year: str | None = None


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
    is_active: bool = True


class SponsorResponse(SponsorBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


# --- Join Request Schemas ---

class JoinRequestBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    mobile_number: str
    role_interest: str
    github_url: str | None = None
    reason: str


class JoinRequestCreate(JoinRequestBase):
    pass


class JoinRequestResponse(JoinRequestBase):
    id: UUID
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class JoinRequestUpdate(JoinRequestBase):
    status: str


# --- Site Content Schemas ---

class SiteContentBase(BaseModel):
    stats: dict = {"members": 0, "projects": 0, "events": 0, "papers": 0}
    about_text: str | None = None
    terminal_code: str | None = None
    testimonials: list[dict] = []
    team_photo_url: str | None = None
    show_timeline: bool = False


class SiteContentResponse(SiteContentBase):
    id: int
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


# --- Game Score Schemas ---

class GameScoreBase(BaseModel):
    name: str
    score: int
    level: int


class GameScoreCreate(GameScoreBase):
    pass


class GameScoreResponse(GameScoreBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
