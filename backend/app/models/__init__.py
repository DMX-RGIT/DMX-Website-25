import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import relationship

from app.database import Base


# --- Enums ---

class EventCategory(str, PyEnum):
    hackathon = "hackathon"
    workshop = "workshop"
    speaker_session = "speaker_session"


class ProjectDomain(str, PyEnum):
    cv = "cv"
    nlp = "nlp"
    genai = "genai"
    robotics = "robotics"
    data_science = "data_science"


class TeamTier(str, PyEnum):
    core = "core"
    lead = "lead"
    member = "member"


class GalleryCategory(str, PyEnum):
    hackathon = "hackathon"
    workshop = "workshop"
    social = "social"


class SponsorTier(str, PyEnum):
    title = "title"
    gold = "gold"
    silver = "silver"
    community = "community"


# --- Models ---

class Event(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(Enum(EventCategory), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)
    venue = Column(String(255), nullable=False)
    registration_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    is_flagship = Column(Boolean, default=False)
    is_upcoming = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    gallery_images = relationship("GalleryImage", back_populates="event")


class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    long_description = Column(Text, nullable=True)
    domain = Column(Enum(ProjectDomain), nullable=False)
    tech_stack = Column(ARRAY(String), default=[])
    github_url = Column(String(500), nullable=True)
    demo_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    contributors = Column(JSONB, default=[])
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    tier = Column(Enum(TeamTier), nullable=False)
    year = Column(String(20), nullable=True)
    photo_url = Column(String(500), nullable=True)
    fun_fact = Column(String(500), nullable=True)
    social_links = Column(JSONB, default={})
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class GalleryImage(Base):
    __tablename__ = "gallery_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    image_url = Column(String(500), nullable=False)
    caption = Column(String(500), nullable=True)
    category = Column(Enum(GalleryCategory), nullable=False)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    event = relationship("Event", back_populates="gallery_images")


class Sponsor(Base):
    __tablename__ = "sponsors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    logo_url = Column(String(500), nullable=False)
    website_url = Column(String(500), nullable=True)
    tier = Column(Enum(SponsorTier), nullable=False)
    display_order = Column(Integer, default=0)
