"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { useSession } from "next-auth/react";

type Event = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  category?: string;
  tags?: string[];
  isPublished?: boolean;
  content: string;
};

const emptyEvent: Event = {
  id: "",
  slug: "",
  title: "",
  description: "",
  date: "",
  coverImage: "",
  category: "",
  tags: [],
  isPublished: true,
  content: "",
};

function parseTags(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function EventsAdmin() {
  const { status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Event | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/events");
    if (res.ok) setEvents(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchEvents();
    }
  }, [status]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.slug) return alert("Slug is required");

    setSaving(true);
    const payload = {
      ...editing,
      tags: parseTags(tagsInput),
      isPublished: Boolean(editing.isPublished),
    };

    const res = await fetch("/api/admin/events", {
      method: editing.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setEditing(null);
      setTagsInput("");
      fetchEvents();
    } else {
      alert("Failed to save event");
    }

    setSaving(false);
  };

  const handleDelete = async (event: Event) => {
    if (!confirm(`Are you sure you want to delete ${event.title}?`)) return;
    const res = await fetch(`/api/admin/events?id=${event.id}`, { method: "DELETE" });
    if (res.ok) fetchEvents();
  };

  const startCreate = () => {
    setEditing(emptyEvent);
    setTagsInput("");
  };

  const startEdit = (event: Event) => {
    setEditing(event);
    setTagsInput((event.tags || []).join(", "));
  };

  if (status === "loading") {
    return <div className="text-gray-400">Loading session...</div>;
  }

  if (loading) return <div className="text-gray-400">Loading events...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Manage Events</h1>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} /> New Event
        </button>
      </div>

      {/* List View */}
      {!editing && (
        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#222]">
              <tr>
                <th className="p-4 font-medium text-gray-300">Slug</th>
                <th className="p-4 font-medium text-gray-300">Title</th>
                <th className="p-4 font-medium text-gray-300">Date</th>
                <th className="p-4 font-medium text-gray-300">Status</th>
                <th className="p-4 font-medium text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-400 font-mono text-sm">{event.slug}</td>
                  <td className="p-4 font-medium">{event.title || "Untitled"}</td>
                  <td className="p-4 text-gray-400">{event.date ? new Date(event.date).toLocaleDateString() : "N/A"}</td>
                  <td className="p-4 text-gray-400">{event.isPublished ? "Published" : "Draft"}</td>
                  <td className="p-4 flex gap-3 justify-end text-right">
                    <button onClick={() => startEdit(event)} className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(event)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor View */}
      {editing && (
        <div className="bg-[#111] border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{editing.id ? `Edit: ${editing.slug}` : "New Event"}</h2>
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Slug</label>
                <input required type="text" value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="e.g. hack2infinity-2025" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input required type="text" value={editing.title || ""} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea required value={editing.description || ""} onChange={e => setEditing({...editing, description: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none h-24" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date</label>
                <input type="date" value={editing.date ? editing.date.slice(0, 10) : ""} onChange={e => setEditing({...editing, date: new Date(e.target.value).toISOString()})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Cover Image URL</label>
                <input type="text" value={editing.coverImage || ""} onChange={e => setEditing({...editing, coverImage: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <input type="text" value={editing.category || ""} onChange={e => setEditing({...editing, category: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tags (comma separated)</label>
                <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="hackathon, ai, workshop" />
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <input
                  id="isPublished"
                  type="checkbox"
                  checked={Boolean(editing.isPublished)}
                  onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="isPublished" className="text-sm text-gray-300">Published</label>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-white mb-2">Markdown Content</label>
              <textarea required value={editing.content} onChange={e => setEditing({...editing, content: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg p-4 text-gray-300 font-mono text-sm h-[400px] focus:border-purple-500 outline-none" placeholder="# Start writing markdown here..." />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
              <button type="button" onClick={() => setEditing(null)} className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors disabled:opacity-60"><Save size={18} /> {saving ? "Saving..." : "Save Event"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
