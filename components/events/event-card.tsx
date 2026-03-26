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
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.32);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
          cursor: pointer;
          box-shadow:
            0 20px 40px rgba(139, 92, 246, 0.08),
            0 8px 24px rgba(255, 107, 53, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        .card-glass:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow:
            0 30px 50px rgba(139, 92, 246, 0.16),
            0 14px 36px rgba(255, 107, 53, 0.12);
          border-color: rgba(139, 92, 246, 0.35);
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
          background: linear-gradient(120deg, #ff6b35, #8b5cf6, #06d6a0);
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

        .image-overlay {
          background: linear-gradient(to top, rgba(17, 24, 39, 0.58), transparent 65%);
        }

        .content-wrap {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0.72));
        }

        .category-pill {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.16), rgba(124, 58, 237, 0.22));
          color: #5b21b6;
          border: 1px solid rgba(139, 92, 246, 0.32);
        }

        .card-title {
          color: #1f2937;
          transition: color 0.25s ease;
        }

        .card-glass:hover .card-title {
          color: #6d28d9;
        }

        .meta-text {
          color: #4b5563;
        }

        .meta-icon {
          color: #7c3aed;
        }

        .tag-pill {
          border: 1px solid rgba(139, 92, 246, 0.25);
          background: rgba(255, 255, 255, 0.78);
          color: #6b21a8;
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
            <div className="absolute inset-0 image-overlay opacity-80 group-hover:opacity-55 transition-opacity duration-300" />
          </div>
        )}
        
        <div className="p-6 relative z-10 content-wrap group-hover:bg-white/80 transition-colors duration-300">
          {event.category && (
            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold mb-3 category-pill">
              {event.category}
            </span>
          )}

          <h3 className="text-xl font-bold mb-2 card-title">
            {event.title}
          </h3>
          
          <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>
          
          <div className="flex flex-col gap-2 text-sm meta-text font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 meta-icon" />
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
                <MapPin className="w-4 h-4 meta-icon" />
                {event.venue}
              </div>
            )}
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {event.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tag-pill"
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
