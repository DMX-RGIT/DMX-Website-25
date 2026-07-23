import type { Event, Project, TeamMember, GalleryImage, Sponsor, Stats } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function fetchApi<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  events: {
    list: (params?: { category?: string; upcoming?: string }) =>
      fetchApi<Event[]>("/events", params),
    get: (id: string) => fetchApi<Event>(`/events/${id}`),
  },
  projects: {
    list: (params?: { domain?: string }) =>
      fetchApi<Project[]>("/projects", params),
    get: (id: string) => fetchApi<Project>(`/projects/${id}`),
  },
  team: {
    list: () => fetchApi<TeamMember[]>("/team"),
  },
  gallery: {
    list: (params?: { category?: string }) =>
      fetchApi<GalleryImage[]>("/gallery", params),
  },
  sponsors: {
    list: () => fetchApi<Sponsor[]>("/sponsors"),
  },
  stats: {
    get: () => fetchApi<Stats>("/stats"),
  },
};
