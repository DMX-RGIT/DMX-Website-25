"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { Event } from "@/types";
import { api } from "@/lib/api";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [mediaModal, setMediaModal] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await api.events.get(id);
        setEvent(data);
      } catch (error) {
        console.error("Failed to fetch event", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <button onClick={() => router.back()} className="text-brand-teal hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const isHackathon = event.category === "hackathon";
  const hasBanner = !!event.image_url;
  const hasPoster = !!event.poster_url;
  const hasBothImages = hasBanner && hasPoster;

  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);
  const isGif = (url: string) => /\.gif$/i.test(url);

  const renderMedia = (url: string, alt: string, className: string) => {
    if (isVideo(url)) {
      return (
        <video
          src={url}
          autoPlay loop muted playsInline
          className={className}
        />
      );
    }
    return <img src={url} alt={alt} className={className} />;
  };

  return (
    <div className="min-h-screen pt-4 pb-16">
      {/* Fullscreen Media Modal */}
      {mediaModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setMediaModal(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
            {isVideo(mediaModal) ? (
              <video 
                src={mediaModal} 
                autoPlay loop muted playsInline 
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" 
              />
            ) : (
              <img 
                src={mediaModal} 
                alt={event.title} 
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" 
              />
            )}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Events
        </button>

        <div className="overflow-hidden">
          {/* Image Section — handles banner only, poster only, or both */}
          {(hasBanner || hasPoster) && (
            <div className={`mb-6 ${hasBothImages ? 'grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4' : ''}`}>
              {/* Banner (landscape) */}
              {hasBanner && (
                <div 
                  className={`relative bg-bg-surface border border-border-default rounded-xl overflow-hidden cursor-pointer group ${
                    hasBothImages ? 'h-64 md:h-80 lg:h-[420px]' : 'h-64 md:h-80 lg:h-[500px] w-full'
                  }`}
                  onClick={() => setMediaModal(event.image_url!)}
                >
                  {renderMedia(
                    event.image_url!,
                    `${event.title} banner`,
                    "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-md transition-opacity duration-300">
                      Click to view
                    </span>
                  </div>
                </div>
              )}

              {/* Poster (portrait) */}
              {hasPoster && (
                <div 
                  className={`relative bg-bg-surface border border-border-default rounded-xl overflow-hidden cursor-pointer group ${
                    hasBothImages ? 'h-64 md:h-80 lg:h-[420px]' : 'h-64 md:h-96 lg:h-[500px] max-w-md mx-auto w-full'
                  }`}
                  onClick={() => setMediaModal(event.poster_url!)}
                >
                  {renderMedia(
                    event.poster_url!,
                    `${event.title} poster`,
                    "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-md transition-opacity duration-300">
                      Click to view
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="pt-2">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${
                    isHackathon 
                      ? "bg-brand-teal text-bg-primary border-brand-teal" 
                      : "bg-bg-primary text-text-secondary border-border-default"
                  }`}>
                    {event.category.replace("_", " ")}
                  </span>
                  {event.is_flagship && (
                    <span className="px-3 py-1 bg-brand-navy/30 text-brand-teal-light text-xs font-bold uppercase tracking-wider rounded-full border border-brand-teal/30">
                      Flagship Event
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-text-primary">
                  {event.title}
                </h1>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a 
                  href={`/gallery?event_id=${event.id}`}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-bg-surface border border-border-default text-text-primary font-bold hover:bg-bg-secondary transition-all text-sm"
                >
                  View Photos
                </a>
                
                {event.registration_url && (
                  <a 
                    href={event.registration_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand-teal text-bg-primary font-bold hover:bg-brand-teal-light transition-all shadow-[0_0_15px_rgba(52,217,166,0.3)] hover:-translate-y-1 text-sm"
                  >
                    {event.is_upcoming ? "Register Now" : "View Event Site"}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <SectionDivider />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
              <div className="md:col-span-2 space-y-3">
                <h2 className="text-2xl font-display font-bold text-text-primary mb-2">About the Event</h2>
                <MarkdownRenderer content={event.description} />
              </div>

              <div className="space-y-6 bg-bg-surface p-5 rounded-xl border border-border-subtle h-fit">
                <div>
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-teal" />
                    Date & Time
                  </h3>
                  <div className="text-text-secondary text-sm">
                    <p className="font-semibold text-text-primary mb-1">
                      {new Date(event.date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p>
                      {new Date(event.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      {event.end_date && ` - ${new Date(event.end_date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-teal" />
                    Location
                  </h3>
                  <div className="text-text-secondary text-sm">
                    <p className="font-semibold text-text-primary mb-1">{event.venue}</p>
                    <p>RGIT Campus, Mumbai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
