"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";

type Event = {
  slug: string;
  frontmatter: { title?: string; description?: string; date?: string; image?: string; tags?: string[] };
  content: string;
};

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Event | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/events");
    if (res.ok) setEvents(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.slug) return alert('Slug is required');

    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (res.ok) {
      setEditing(null);
      fetchEvents();
    } else {
      alert("Failed to save event");
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete ${slug}?`)) return;
    const res = await fetch(`/api/admin/events?slug=${slug}`, { method: "DELETE" });
    if (res.ok) fetchEvents();
  };

  if (loading) return <div className="text-gray-400">Loading events...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Manage Events</h1>
        <button
          onClick={() => setEditing({ slug: "", frontmatter: { title: "", date: "", description: "" }, content: "" })}
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
                <th className="p-4 font-medium text-gray-300">File Slug</th>
                <th className="p-4 font-medium text-gray-300">Title</th>
                <th className="p-4 font-medium text-gray-300">Date</th>
                <th className="p-4 font-medium text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map((event) => (
                <tr key={event.slug} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-400 font-mono text-sm">{event.slug}.mdx</td>
                  <td className="p-4 font-medium">{event.frontmatter?.title || 'Untitled'}</td>
                  <td className="p-4 text-gray-400">{event.frontmatter?.date || 'N/A'}</td>
                  <td className="p-4 flex gap-3 justify-end text-right">
                    <button onClick={() => setEditing(event)} className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(event.slug)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No events found locally.</td>
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
            <h2 className="text-xl font-bold">{editing.slug ? `Edit: ${editing.slug}` : 'New Event'}</h2>
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL Slug (Filename)</label>
                <input required type="text" value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="e.g. hack2infinity-2025" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input required type="text" value={editing.frontmatter.title || ''} onChange={e => setEditing({...editing, frontmatter: {...editing.frontmatter, title: e.target.value}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea required value={editing.frontmatter.description || ''} onChange={e => setEditing({...editing, frontmatter: {...editing.frontmatter, description: e.target.value}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none h-24" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date (YYYY-MM-DD)</label>
                <input type="text" value={editing.frontmatter.date || ''} onChange={e => setEditing({...editing, frontmatter: {...editing.frontmatter, date: e.target.value}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Cover Image Path</label>
                <input type="text" value={editing.frontmatter.image || ''} onChange={e => setEditing({...editing, frontmatter: {...editing.frontmatter, image: e.target.value}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="/images/event-files/..." />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-white mb-2">MDX Content Body</label>
              <textarea required value={editing.content} onChange={e => setEditing({...editing, content: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg p-4 text-gray-300 font-mono text-sm h-[400px] focus:border-purple-500 outline-none" placeholder="# Start writing markdown here..." />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
              <button type="button" onClick={() => setEditing(null)} className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">Cancel</button>
              <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"><Save size={18} /> Save Event</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
