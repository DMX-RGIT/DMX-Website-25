"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { Event } from "@/types";
import { api } from "@/lib/api";
import { SectionDivider } from "@/components/shared/SectionDivider";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Events
        </button>

        <div className="overflow-hidden">
          {event.image_url && (
            <div className="w-full h-64 md:h-96 relative bg-bg-surface border-b border-border-default rounded-xl mb-8 overflow-hidden">
              <img 
                src={event.image_url} 
                alt={event.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <div className="pt-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
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
                <h1 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-4">
                  {event.title}
                </h1>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a 
                  href={`/gallery?event_id=${event.id}`}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-bg-surface border border-border-default text-text-primary font-bold hover:bg-bg-secondary transition-all"
                >
                  View Photos
                </a>
                
                {event.registration_url && (
                  <a 
                    href={event.registration_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand-teal text-bg-primary font-bold hover:bg-brand-teal-light transition-all shadow-[0_0_15px_rgba(52,217,166,0.3)] hover:-translate-y-1"
                  >
                    {event.is_upcoming ? "Register Now" : "View Event Site"}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <SectionDivider />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 my-12">
              <div className="md:col-span-2 space-y-6">
                <h2 className="text-2xl font-display font-bold text-text-primary">About the Event</h2>
                <div className="text-text-secondary leading-relaxed space-y-4 whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>

              <div className="space-y-8 bg-bg-surface p-6 rounded-xl border border-border-subtle h-fit">
                <div>
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
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
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
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
