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
    category = Column(String(255), nullable=False)  # Was Enum, now dynamic String
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
    domain = Column(String(255), nullable=False)  # Was Enum, now dynamic String
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
    department = Column(String(255), nullable=True)
    tier = Column(Enum(TeamTier), nullable=False)
    year = Column(String(50), nullable=True)
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


class JoinRequest(Base):
    __tablename__ = "join_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    role_interest = Column(String(255), nullable=False)
    github_url = Column(String(500), nullable=True)
    reason = Column(Text, nullable=False)
    status = Column(String(50), default="pending")  # pending, reviewed, accepted, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SiteContent(Base):
    __tablename__ = "site_content"

    id = Column(Integer, primary_key=True, default=1)
    stats = Column(JSONB, default={"members": 50, "projects": 15, "events": 30, "papers": 5})
    about_text = Column(Text, nullable=True)
    terminal_code = Column(Text, nullable=True)
    testimonials = Column(JSONB, default=[])
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
