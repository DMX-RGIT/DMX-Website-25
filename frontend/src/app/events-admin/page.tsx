"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, X, Upload, Info, Mail } from "lucide-react";
import { cn, stripMarkdown } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getToken(): string {
  return localStorage.getItem("dmx_events_admin_token") || "";
}

/** Format a UTC date string to local YYYY-MM-DDTHH:mm for datetime-local inputs */
function formatToLocalDatetime(dateStr: string): string {
  const d = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ detail: "Request failed" }));
    let msg = data.detail;
    if (Array.isArray(msg)) msg = msg.map((m: any) => `${m.loc?.[m.loc.length - 1]}: ${m.msg}`).join(", ");
    throw new Error(msg || `Error ${res.status}`);
  }
  return res.json();
}

const FIELDS = [
  { name: "title", label: "Title", type: "text" as const, required: true },
  { name: "description", label: "Description (supports Markdown)", type: "textarea" as const, required: true },
  { name: "category", label: "Category", type: "text" as const, required: true, placeholder: "e.g., Hackathon, Workshop, etc." },
  { name: "date", label: "Date", type: "datetime" as const, required: true },
  { name: "end_date", label: "End Date", type: "datetime" as const },
  { name: "venue", label: "Venue", type: "text" as const, required: true },
  { name: "registration_url", label: "Registration URL", type: "url" as const },
  { name: "image_url", label: "Banner Image (landscape)", type: "url" as const },
  { name: "poster_url", label: "Poster Image (portrait)", type: "url" as const },
  { name: "is_flagship", label: "Is Flagship?", type: "boolean" as const },
  { name: "is_upcoming", label: "Is Upcoming?", type: "boolean" as const },
] as const;

type FieldType = (typeof FIELDS)[number];

export default function EventsAdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/events");
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const openCreate = () => {
    setEditing(null);
    const defaults: Record<string, any> = {};
    FIELDS.forEach((f) => {
      if (f.type === "boolean") defaults[f.name] = false;
      else defaults[f.name] = "";
    });
    setFormData(defaults);
    setShowForm(true);
    setError("");
  };

  const openEdit = (item: any) => {
    setEditing(item);
    const data: Record<string, any> = {};
    FIELDS.forEach((f) => {
      if (f.type === "datetime") {
        data[f.name] = item[f.name] ? formatToLocalDatetime(item[f.name]) : "";
      } else {
        data[f.name] = item[f.name] ?? (f.type === "boolean" ? false : "");
      }
    });
    setFormData(data);
    setShowForm(true);
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = { ...formData };
      FIELDS.forEach((f) => {
        if (f.type === "datetime" && payload[f.name]) {
          payload[f.name] = new Date(payload[f.name]).toISOString();
        }
      });

      if (editing) {
        await apiFetch(`/admin/events/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiFetch("/admin/events", { method: "POST", body: JSON.stringify(payload) });
      }
      setShowForm(false);
      fetchEvents();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (field: string, file: File) => {
    const token = getToken();
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_BASE}/auth/upload?folder=dmx`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!res.ok) throw new Error("Upload failed");
    const { url } = await res.json();
    setFormData((prev) => ({ ...prev, [field]: url }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Events</h1>
          <p className="text-sm text-text-secondary mt-1">Create and update events. Contact a super admin to delete.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-bg-primary transition-all hover:opacity-90"
          style={{ background: "var(--gradient-teal)" }}
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* Tips */}
      <div className="mb-6 p-4 rounded-xl border border-brand-navy-light/30 bg-brand-navy/10">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
          <div className="text-sm text-text-secondary space-y-1">
            <p className="font-semibold text-text-primary">Tips for great event pages</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Banner Image:</strong> Landscape (16:9) — spans the full width at the top.</li>
              <li><strong>Poster Image:</strong> Portrait — appears alongside the banner. Great for flyers.</li>
              <li><strong>Description</strong> supports full Markdown — headings, lists, bold text.</li>
              <li>Mark an event as <strong>Flagship</strong> to feature it on the homepage with a countdown.</li>
            </ul>
          </div>
        </div>
      </div>

      {error && !showForm && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-lg bg-bg-surface animate-pulse" />)}
        </div>
      ) : (
        <div className="border border-border-default rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-bg-surface border-b border-border-default">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-border-subtle hover:bg-bg-surface/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-text-primary font-medium max-w-xs truncate">{event.title}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{event.category}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={event.is_upcoming ? "text-brand-teal" : "text-text-secondary"}>
                      {event.is_upcoming ? "Upcoming" : "Past"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(event)}
                        className="p-1.5 rounded-md text-text-secondary hover:text-brand-teal hover:bg-brand-teal/10 transition-colors"
                        title="Edit event"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {/* Delete — disabled for events admin */}
                      <a
                        href="mailto:?subject=Please delete this event&body=Event ID: placeholder"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `mailto:?subject=Please delete event: ${encodeURIComponent(event.title)}&body=Hi, please delete the following event from the DMX website:%0A%0AEvent: ${encodeURIComponent(event.title)}%0AID: ${event.id}%0A%0AThanks!`;
                        }}
                        className="p-1.5 rounded-md text-text-muted hover:text-brand-teal hover:bg-brand-teal/10 transition-colors group relative"
                        title="Contact super admin to delete"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-bg-secondary border border-border-default text-xs text-text-secondary rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          Contact super admin to delete
                        </span>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === 0 && (
            <div className="text-center py-12 text-text-secondary text-sm">No events yet. Click "Add Event" to create one.</div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-bg-secondary border border-border-default rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">{editing ? "Edit" : "Create"} Event</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <div className="space-y-4">
              {FIELDS.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary">{field.label}</label>

                  {field.type === "textarea" ? (
                    <Textarea
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      rows={3}
                      required={field.required}
                    />
                  ) : field.type === "boolean" ? (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={!!formData[field.name]}
                        onCheckedChange={(checked) => setFormData({ ...formData, [field.name]: checked })}
                      />
                      <span className="text-sm font-medium text-text-primary">Enabled</span>
                    </label>
                  ) : field.type === "url" ? (
                    <div className="space-y-2">
                      <Input
                        type="url"
                        value={formData[field.name] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        placeholder="https://..."
                      />
                      {(field.name.includes("image") || field.name.includes("photo") || field.name.includes("poster") || field.name.includes("banner")) && (
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-border-default rounded-lg cursor-pointer hover:border-brand-teal transition-colors text-text-secondary text-xs">
                            <Upload className="w-4 h-4" />
                            Or upload an image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(field.name, file);
                              }}
                            />
                          </label>
                          {formData[field.name] && (
                            <div className={cn(
                              "overflow-hidden rounded-lg border border-border-default bg-bg-surface",
                              field.name.includes("poster") ? "w-24 h-36" : "w-36 h-24"
                            )}>
                              <img src={formData[field.name]} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Input
                      type={field.type === "datetime" ? "datetime-local" : field.type}
                      value={formData[field.name] ?? ""}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      required={"required" in field ? field.required : undefined}
                      placeholder={"placeholder" in field ? field.placeholder : undefined}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-text-secondary border border-border-default hover:text-text-primary hover:border-brand-navy-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-bg-primary transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--gradient-teal)" }}
              >
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
