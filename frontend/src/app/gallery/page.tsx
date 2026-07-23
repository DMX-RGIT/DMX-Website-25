"use client";

import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GalleryImage, GalleryFilter } from "@/types";
import { api } from "@/lib/api";
import { Lightbox } from "@/components/gallery/Lightbox";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { FilterPills } from "@/components/shared/FilterPills";

import { useSearchParams } from "next/navigation";

function GalleryContent() {
  const searchParams = useSearchParams();
  const initialEventId = searchParams.get("event_id") || "all";
  
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [events, setEvents] = useState<{id: string, title: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<GalleryFilter>("all");
  const [eventId, setEventId] = useState<string>(initialEventId);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      setLoading(true);
      try {
        const params: any = {};
        if (category !== "all") params.category = category;
        if (eventId !== "all") params.event_id = eventId;
        const data = await api.gallery.list(params);
        setImages(data);
      } catch (error) {
        console.error("Failed to fetch gallery", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, [category, eventId]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const evtData = await api.events.list();
        setEvents(evtData.map(e => ({ id: e.id, title: e.title })));
      } catch (e) {}
    }
    fetchEvents();
  }, []);

  const categories = [
    { label: "All Photos", value: "all" as GalleryFilter },
    { label: "Hackathons", value: "hackathon" as GalleryFilter },
    { label: "Workshops", value: "workshop" as GalleryFilter },
    { label: "Socials", value: "social" as GalleryFilter },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4">
            Gallery
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Moments captured from our hackathons, workshops, and team socials.
          </p>
        </div>

        <SectionDivider />

        <div className="mt-12 mb-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <FilterPills
            options={categories}
            value={category}
            onChange={setCategory}
          />
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text-secondary">Filter by Event:</span>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="px-4 py-2 bg-bg-surface border border-border-default rounded-lg focus:outline-none focus:border-brand-teal text-text-primary text-sm appearance-none min-w-[200px]"
            >
              <option value="all">All Events</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="rounded-xl bg-bg-surface animate-pulse w-full break-inside-avoid" style={{ height: `${Math.max(150, Math.random() * 300)}px` }} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-32">
            <h3 className="text-xl font-bold text-text-primary mb-2">No photos found</h3>
            <p className="text-text-secondary">Try selecting a different category.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((img, idx) => (
              <motion.div
                key={img.id}
                layoutId={`gallery-img-${img.id}`}
                className="relative break-inside-avoid rounded-xl overflow-hidden cursor-pointer group bg-bg-surface"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (idx % 10) * 0.05 }}
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img.image_url}
                  alt={img.caption || "Gallery"}
                  className="w-full h-auto object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  {img.caption && (
                    <p className="text-sm font-medium text-white line-clamp-2">
                      {img.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Lightbox 
        images={images}
        initialIndex={images.findIndex(img => img.id === selectedImage?.id)} 
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal"></div>
      </div>
    }>
      <GalleryContent />
    </Suspense>
  );
}
