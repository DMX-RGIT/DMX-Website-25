'use client';

import { EventCard } from '@/components/events/event-card';
import { Event } from '@/types';

interface EventsContentProps {
  events: Event[];
}

export default function EventsContent({ events }: EventsContentProps) {
  return (
    <div className="min-h-screen blog-events-page">
      <style jsx>{`
        .blog-events-page {
          background: radial-gradient(circle at 20% 20%, rgba(251, 146, 60, 0.08), transparent 40%),
            radial-gradient(circle at 80% 10%, rgba(37, 99, 235, 0.08), transparent 35%),
            linear-gradient(165deg, #f8fafc 0%, #f1f5f9 55%, #fff7ed 100%);
          min-height: 100vh;
          padding: 1rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: relative;
          color: #0f172a;
        }

        @media (min-width: 640px) {
          .blog-events-page {
            padding: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .blog-events-page {
            padding: 2rem;
          }
        }

        .hero {
          max-width: 72rem;
          margin: 0 auto 2.5rem auto;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 24px;
          padding: 1.5rem;
          position: relative;
          box-shadow: 0 25px 50px -30px rgba(30, 41, 59, 0.35);
        }

        .page-title {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          background: linear-gradient(120deg, #0f172a, #1d4ed8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: #0f172a;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .subtitle {
          color: #334155;
          max-width: 50rem;
          font-size: 1rem;
        }

        @media (min-width: 640px) {
          .page-title {
            font-size: 3rem;
          }
        }
      `}</style>

      <div className="hero">
        <h1 className="page-title">Events Archive</h1>
        <p className="subtitle">
          Every past DMX event in one place. Browse stories, outcomes, and highlights in reverse chronological order.
        </p>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="hero text-center py-12">
            <p className="text-slate-500">No past events found.</p>
          </div>
        )}
      </div>
    </div>
  );
}