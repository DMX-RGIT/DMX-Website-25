// Event Card Component
// Displays event information in a card format for the events grid
// This is a client component for interactive hover effects

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

// Event card component with hover effects and navigation
export function EventCard({ event }: EventCardProps) {
  const href = `/events/${event.slug || event.id}`;

  return (
    <Link href={href}>
      <style jsx>{`
        .card-glass {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
          cursor: pointer;
        }

        .card-glass:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 36px -24px rgba(30, 41, 59, 0.45);
          border-color: rgba(30, 64, 175, 0.35);
        }

        .card-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(90deg, #f97316, #2563eb, #0f172a);
          background-size: 300% 300%;
          animation: gradientShift 4s ease infinite;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: subtract;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .card-glass:hover::before {
          opacity: 1;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      <div className="card-glass group">
        {event.coverImage && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-300" />
          </div>
        )}
        
        <div className="p-6 relative z-10 bg-white/40 group-hover:bg-white/60 transition-colors duration-300">
          {event.category && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 mb-3">
              {event.category}
            </span>
          )}

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-dmx-purple transition-colors duration-300">
            {event.title}
          </h3>
          
          <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>
          
          <div className="flex flex-col gap-2 text-sm text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-dmx-primary" />
              {event.date instanceof Date 
                ? event.date.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : new Date(event.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
              }
            </div>
            
            {event.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-dmx-primary" />
                {event.venue}
              </div>
            )}
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {event.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
