"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";

type Project = {
  slug: string;
  frontmatter: { title?: string; description?: string; link?: string; tags?: string[]; author?: string; cohort?: string };
  content: string;
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/projects");
    if (res.ok) setProjects(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.slug) return alert('Slug is required');

    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (res.ok) {
      setEditing(null);
      fetchProjects();
    } else {
      alert("Failed to save project");
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete ${slug}?`)) return;
    const res = await fetch(`/api/admin/projects?slug=${slug}`, { method: "DELETE" });
    if (res.ok) fetchProjects();
  };

  if (loading) return <div className="text-gray-400">Loading projects...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Manage Projects</h1>
        <button
          onClick={() => setEditing({ slug: "", frontmatter: { title: "", description: "", link: "", tags: [], author: "", cohort: "" }, content: "" })}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {!editing && (
        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#222]">
              <tr>
                <th className="p-4 font-medium text-gray-300">Slug</th>
                <th className="p-4 font-medium text-gray-300">Title</th>
                <th className="p-4 font-medium text-gray-300">Author</th>
                <th className="p-4 font-medium text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((project) => (
                <tr key={project.slug} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-400 font-mono text-sm">{project.slug}.mdx</td>
                  <td className="p-4 font-medium">{project.frontmatter?.title || 'Untitled'}</td>
                  <td className="p-4 text-gray-400">{project.frontmatter?.author || 'N/A'}</td>
                  <td className="p-4 flex gap-3 justify-end text-right">
                    <button onClick={() => setEditing(project)} className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(project.slug)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No projects found locally.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="bg-[#111] border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{editing.slug ? `Edit: ${editing.slug}` : 'New Project'}</h2>
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL Slug (Filename)</label>
                <input required type="text" value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input required type="text" value={editing.frontmatter.title || ''} onChange={e => setEditing({...editing, frontmatter: {...editing.frontmatter, title: e.target.value}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-teal-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea required value={editing.frontmatter.description || ''} onChange={e => setEditing({...editing, frontmatter: {...editing.frontmatter, description: e.target.value}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-teal-500 outline-none h-24" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Author</label>
                <input type="text" value={editing.frontmatter.author || ''} onChange={e => setEditing({...editing, frontmatter: {...editing.frontmatter, author: e.target.value}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Project Link (Github/Website)</label>
                <input type="text" value={editing.frontmatter.link || ''} onChange={e => setEditing({...editing, frontmatter: {...editing.frontmatter, link: e.target.value}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Cohort (e.g. 2024)</label>
                <input type="text" value={editing.frontmatter.cohort || ''} onChange={e => setEditing({...editing, frontmatter: {...editing.frontmatter, cohort: e.target.value}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tags (Comma separated)</label>
                <input type="text" value={(editing.frontmatter.tags || []).join(', ')} onChange={e => setEditing({...editing, frontmatter: {...editing.frontmatter, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-teal-500 outline-none" placeholder="AI, Web, App..." />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-white mb-2">MDX Content Body</label>
              <textarea required value={editing.content} onChange={e => setEditing({...editing, content: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg p-4 text-gray-300 font-mono text-sm h-[400px] focus:border-teal-500 outline-none" />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
              <button type="button" onClick={() => setEditing(null)} className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">Cancel</button>
              <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white font-medium transition-colors"><Save size={18} /> Save Project</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
