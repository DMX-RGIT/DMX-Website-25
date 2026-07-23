"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X, Upload, Save } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getToken(): string {
  return localStorage.getItem("dmx_admin_token") || "";
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Bulk Upload State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("hackathon");
  const [eventId, setEventId] = useState("");

  // Bulk Delete State
  const [selectMode, setSelectMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [imgRes, evtRes] = await Promise.all([
        fetch(`${API_BASE}/gallery`),
        fetch(`${API_BASE}/events`)
      ]);
      const imgData = await imgRes.json();
      const evtData = await evtRes.json();
      setImages(imgData);
      setEvents(evtData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await fetch(`${API_BASE}/admin/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedImages.size} images?`)) return;
    setDeleting(true);
    try {
      const token = getToken();
      for (const id of selectedImages) {
        await fetch(`${API_BASE}/admin/gallery/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSelectedImages(new Set());
      setSelectMode(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error deleting some images.");
    } finally {
      setDeleting(false);
    }
  };

  const toggleImageSelection = (id: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    try {
      const token = getToken();
      for (const file of selectedFiles) {
        // Upload image to auth/upload (Cloudinary)
        const form = new FormData();
        form.append("file", file);
        const uploadRes = await fetch(`${API_BASE}/auth/upload?folder=dmx_gallery`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        
        if (!uploadRes.ok) throw new Error("Upload failed");
        const { url } = await uploadRes.json();

        // Create gallery entry
        await fetch(`${API_BASE}/admin/gallery`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            image_url: url,
            caption: caption || undefined,
            category,
            event_id: eventId || undefined,
          }),
        });
      }
      
      setShowUpload(false);
      setSelectedFiles([]);
      setCaption("");
      setEventId("");
      fetchData();
    } catch (err) {
      console.error("Bulk upload error", err);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">Gallery Images</h1>
        <div className="flex items-center gap-3">
          {selectMode ? (
            <>
              <button
                onClick={() => { setSelectMode(false); setSelectedImages(new Set()); }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-text-secondary border border-border-default hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={selectedImages.size === 0 || deleting}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : `Delete Selected (${selectedImages.size})`}
              </button>
            </>
          ) : (
            <button
              onClick={() => setSelectMode(true)}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-text-secondary border border-border-default hover:text-text-primary transition-colors"
            >
              Select Images
            </button>
          )}
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-bg-primary transition-all hover:opacity-90"
            style={{ background: "var(--gradient-teal)" }}
          >
            <Upload className="w-4 h-4" /> Bulk Upload
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div 
              key={img.id} 
              onClick={() => selectMode ? toggleImageSelection(img.id) : undefined}
              className={`relative group bg-bg-surface border rounded-xl overflow-hidden aspect-video ${selectMode ? "cursor-pointer" : ""} ${selectedImages.has(img.id) ? "border-red-500 border-2" : "border-border-default"}`}
            >
              <img src={img.image_url} alt={img.caption || ""} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-black/60 transition-opacity flex flex-col items-center justify-center p-2 text-center ${selectedImages.has(img.id) ? "opacity-50" : "opacity-0 group-hover:opacity-100"}`}>
                <span className="text-xs text-white mb-2">{img.caption || img.category}</span>
                {!selectMode && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                    className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {selectMode && (
                <div className="absolute top-2 left-2 w-5 h-5 rounded border border-white flex items-center justify-center bg-black/40">
                  {selectedImages.has(img.id) && <div className="w-3 h-3 rounded-sm bg-red-500" />}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-bg-secondary border border-border-default rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">Bulk Upload Images</h2>
              <button onClick={() => setShowUpload(false)} className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">Select Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                  className="w-full text-sm text-text-primary"
                />
                <p className="text-xs text-text-secondary mt-1">{selectedFiles.length} files selected.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">Common Caption</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-teal"
                  placeholder="e.g., Hack2Infinity 2026 Opening Ceremony"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-teal"
                >
                  <option value="hackathon">Hackathon</option>
                  <option value="workshop">Workshop</option>
                  <option value="social">Social</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">Link to Event (Optional)</label>
                <select
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-teal"
                >
                  <option value="">None</option>
                  {events.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowUpload(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-text-secondary border border-border-default hover:text-text-primary hover:border-brand-navy-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={uploading || selectedFiles.length === 0}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-bg-primary transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--gradient-teal)" }}
              >
                {uploading ? "Uploading..." : `Upload ${selectedFiles.length} Images`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
