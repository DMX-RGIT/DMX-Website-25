"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Save, Upload, Trash2 } from "lucide-react";

type AdminEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  galleryImages: string[];
  date: string;
  category?: string;
  tags?: string[];
  isPublished?: boolean;
};

export default function GalleryAdmin() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/events");
    if (res.ok) {
      const data = await res.json();
      setEvents(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const saveEvent = async (event: AdminEvent) => {
    setSavingId(event.id);
    const res = await fetch("/api/admin/events", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    setSavingId(null);

    if (!res.ok) {
      alert("Failed to save gallery changes for this event");
      return;
    }

    alert(`Gallery saved for ${event.title}`);
  };

  const uploadToEvent = async (event: AdminEvent, file: File) => {
    setUploadingId(event.id);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", event.slug || "event");

    const res = await fetch("/api/admin/uploads/events", {
      method: "POST",
      body: formData,
    });

    setUploadingId(null);

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Upload failed");
      return;
    }

    setEvents((prev) =>
      prev.map((item) =>
        item.id === event.id
          ? {
              ...item,
              galleryImages: [...(item.galleryImages || []), data.url],
            }
          : item
      )
    );
  };

  const uploadMultiple = async (event: AdminEvent, files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      await uploadToEvent(event, file);
    }
  };

  const removeImage = (eventId: string, index: number) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event;
        const next = [...(event.galleryImages || [])];
        next.splice(index, 1);
        return { ...event, galleryImages: next };
      })
    );
  };

  if (loading) {
    return <div className="text-gray-400">Loading event galleries...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
          Manage Event Galleries
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Upload and organize gallery images per event. Click Save for each event after changes.
        </p>
      </div>

      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="bg-[#111] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">{event.title}</h2>
                <p className="text-xs text-gray-400 font-mono">{event.slug}</p>
              </div>

              <button
                onClick={() => saveEvent(event)}
                disabled={savingId === event.id}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save size={16} />
                {savingId === event.id ? "Saving..." : "Save"}
              </button>
            </div>

            <div className="mb-4">
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm text-gray-200 cursor-pointer hover:bg-[#232323] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    uploadMultiple(event, e.target.files);
                    e.currentTarget.value = "";
                  }}
                />
                <Upload size={15} />
                {uploadingId === event.id ? "Uploading..." : "Upload Images"}
              </label>
            </div>

            {event.galleryImages && event.galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {event.galleryImages.map((url, index) => (
                  <div key={`${url}-${index}`} className="relative rounded-lg overflow-hidden border border-white/10 bg-[#171717]">
                    <Image
                      src={url}
                      alt={`Gallery image ${index + 1}`}
                      width={400}
                      height={240}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(event.id, index)}
                      className="absolute top-1 right-1 p-1.5 rounded bg-black/70 text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 border border-dashed border-white/15 rounded-lg p-4">
                No gallery images yet for this event.
              </div>
            )}
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-gray-500 border border-dashed border-white/20 rounded-lg p-8 text-center">
            No events found. Create events first in admin events.
          </div>
        )}
      </div>
    </div>
  );
}
