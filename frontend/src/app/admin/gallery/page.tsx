"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, Upload, Save, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  const toggleImageSelection = (id: string, index: number, isShiftPressed: boolean) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (isShiftPressed && lastSelectedIndex !== null) {
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        for (let i = start; i <= end; i++) {
          newSet.add(images[i].id);
        }
      } else {
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
      }
      return newSet;
    });
    setLastSelectedIndex(index);
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
        
        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.detail || "Upload failed");
        }
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
    } catch (err: any) {
      console.error("Bulk upload error", err);
      alert(`An error occurred during upload: ${err.message}`);
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

      {/* Info Card */}
      <div className="mb-6 p-4 rounded-xl border border-brand-navy-light/30 bg-brand-navy/10">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
          <div className="text-sm text-text-secondary space-y-1">
            <p className="font-semibold text-text-primary">Tips for gallery management</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Bulk Upload:</strong> Select multiple images and assign a common caption, category, and linked event.</li>
              <li><strong>Select Mode:</strong> Hold Shift+Click to select a range of images for bulk deletion.</li>
              <li>Link images to an <strong>event</strong> so they appear on that event&apos;s &quot;View Photos&quot; page.</li>
              <li>Use <strong>high-quality images</strong> (at least 1200px wide) for best results in the masonry grid.</li>
            </ul>
          </div>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img, idx) => (
            <div 
              key={img.id} 
              onClick={(e) => selectMode ? toggleImageSelection(img.id, idx, e.shiftKey) : undefined}
              className={`relative group bg-bg-surface border rounded-xl overflow-hidden aspect-video ${selectMode ? "cursor-pointer" : ""} ${selectedImages.has(img.id) ? "border-red-500 border-2" : "border-border-default"}`}
            >
              {img.image_url ? <Image src={img.image_url} alt={img.caption || ""} width={60} height={60} className="w-full h-full object-cover" unoptimized /> : <div className="w-full h-full object-cover bg-bg-surface" />}
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
                  accept="image/*,.heic,.heif"
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                  className="w-full text-sm text-text-primary"
                />
                <p className="text-xs text-text-secondary mt-1">{selectedFiles.length} files selected.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">Common Caption</label>
                <Input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g., Hack2Infinity 2026 Opening Ceremony"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">Category</label>
                <Select value={category} onValueChange={(v) => setCategory(v || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">Link to Event (Optional)</label>
                <Select value={eventId} onValueChange={(v) => setEventId(v || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {events.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
