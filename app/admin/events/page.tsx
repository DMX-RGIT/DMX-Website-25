"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

type Event = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  galleryImages: string[];
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
  galleryImages: [],
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadHint, setUploadHint] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const compressImage = async (file: File): Promise<File> => {
    // Skip compression for small files.
    if (file.size <= 1.5 * 1024 * 1024) {
      return file;
    }

    const imageUrl = URL.createObjectURL(file);
    const image = new window.Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Failed to read image"));
      image.src = imageUrl;
    });

    const maxWidth = 1920;
    const maxHeight = 1080;
    const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
    const targetWidth = Math.max(1, Math.round(image.width * scale));
    const targetHeight = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      URL.revokeObjectURL(imageUrl);
      throw new Error("Unable to process image");
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.82)
    );

    URL.revokeObjectURL(imageUrl);

    if (!blob) {
      return file;
    }

    const baseName = file.name.replace(/\.[^/.]+$/, "");
    return new File([blob], `${baseName}.webp`, { type: "image/webp" });
  };

  const processAndUploadImage = async (file: File) => {
    try {
      const compressed = await compressImage(file);
      if (compressed.size < file.size) {
        const savedKb = Math.round((file.size - compressed.size) / 1024);
        setUploadHint(`Compressed image before upload (saved ~${savedKb} KB).`);
      } else {
        setUploadHint("Uploaded original image (already optimized).");
      }
      await handleImageUpload(compressed);
    } catch (error) {
      console.error(error);
      setUploadError("Failed to process image");
    }
  };

  const handleGalleryUpload = async (file: File) => {
    if (!editing) return;

    setUploadingGallery(true);
    setUploadError(null);

    try {
      const compressed = await compressImage(file);

      const formData = new FormData();
      formData.append("file", compressed);
      formData.append("slug", editing.slug || "event");

      const res = await fetch("/api/admin/uploads/events", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Failed to upload gallery image");
        setUploadingGallery(false);
        return;
      }

      setEditing({
        ...editing,
        galleryImages: [...(editing.galleryImages || []), data.url],
      });
    } catch (error) {
      console.error(error);
      setUploadError("Failed to process gallery image");
    }

    setUploadingGallery(false);
  };

  const handleGalleryMultiUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      await handleGalleryUpload(file);
    }
  };

  const removeGalleryImage = (index: number) => {
    if (!editing) return;
    const next = [...(editing.galleryImages || [])];
    next.splice(index, 1);
    setEditing({ ...editing, galleryImages: next });
  };

  const handleImageUpload = async (file: File) => {
    if (!editing) return;

    setUploadingImage(true);
    setUploadError(null);
    setUploadHint(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", editing.slug || "event");

    const res = await fetch("/api/admin/uploads/events", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      setUploadError(data.error || "Failed to upload image");
      setUploadingImage(false);
      return;
    }

    setEditing({ ...editing, coverImage: data.url });
    setUploadingImage(false);
  };

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
    setEditing({ ...event, galleryImages: event.galleryImages || [] });
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
                <div
                  className={`mt-2 rounded-lg border border-dashed p-3 transition-colors ${
                    isDragOver ? "border-purple-500 bg-purple-500/10" : "border-white/15 bg-[#1b1b1b]"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const dropped = e.dataTransfer.files?.[0];
                    if (dropped) {
                      processAndUploadImage(dropped);
                    }
                  }}
                >
                  <p className="text-xs text-gray-400 mb-2">Drag and drop an image here</p>
                  <label className="inline-flex items-center gap-2 px-3 py-2 bg-[#222] border border-white/10 rounded-lg text-sm text-gray-200 cursor-pointer hover:bg-[#2a2a2a] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const selected = e.target.files?.[0];
                        if (selected) {
                          processAndUploadImage(selected);
                        }
                        e.currentTarget.value = "";
                      }}
                    />
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                  </label>
                  <span className="text-xs text-gray-400 ml-3">Stored in Supabase Storage bucket.</span>
                </div>
                {uploadError && <p className="text-xs text-red-400 mt-2">{uploadError}</p>}
                {uploadHint && <p className="text-xs text-emerald-400 mt-2">{uploadHint}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <input type="text" value={editing.category || ""} onChange={e => setEditing({...editing, category: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tags (comma separated)</label>
                <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="hackathon, ai, workshop" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Event Gallery Images</label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 bg-[#222] border border-white/10 rounded-lg text-sm text-gray-200 cursor-pointer hover:bg-[#2a2a2a] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        handleGalleryMultiUpload(e.target.files);
                        e.currentTarget.value = "";
                      }}
                    />
                    {uploadingGallery ? "Uploading Gallery..." : "Upload Multiple Images"}
                  </label>
                  <span className="text-xs text-gray-400">Images are stored in Supabase Storage and shown in event detail gallery.</span>
                </div>
                {editing.galleryImages && editing.galleryImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {editing.galleryImages.map((url, index) => (
                      <div key={`${url}-${index}`} className="relative rounded-lg overflow-hidden border border-white/10 bg-[#161616]">
                        <Image
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          width={400}
                          height={240}
                          className="w-full h-28 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
              {editing.coverImage && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Cover Preview</p>
                  <Image
                    src={editing.coverImage}
                    alt="Cover preview"
                    width={1200}
                    height={480}
                    className="w-full max-h-72 object-cover rounded-lg border border-white/10"
                  />
                </div>
              )}

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
