// API response types matching the backend Pydantic schemas

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  end_date: string | null;
  venue: string;
  registration_url: string | null;
  image_url: string | null;
  poster_url: string | null;
  is_flagship: boolean;
  is_upcoming: boolean;
  interest_count: number;
  created_at: string;
  updated_at: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  domain: string;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  contributors: Contributor[];
  is_featured: boolean;
  level: string | null;
  level_color: string | null;
  level_emoji: string | null;
  show_sidebar: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface Contributor {
  name: string;
  role: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  tier: "core" | "lead" | "member";
  year?: string | null;
  photo_url: string | null;
  fun_fact: string | null;
  social_links: Record<string, string>;
  display_order: number;
  is_alumni: boolean;
  batch_year: string | null;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  category: "hackathon" | "workshop" | "social";
  event_id: string | null;
  created_at: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  tier: "title" | "gold" | "silver" | "community";
  display_order: number;
}

export interface Stats {
  members: number;
  projects: number;
  events: number;
  papers: number;
}

// Filter types for the frontend
export type EventCategory = "all" | string;
export type ProjectDomain = "all" | string;
export type GalleryFilter = "all" | GalleryImage["category"];
export type TeamTier = TeamMember["tier"];
