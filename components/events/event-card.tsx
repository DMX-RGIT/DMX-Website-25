// Event Card Component
// Displays event information in a card format for the events grid
// This is a client component for interactive hover effects

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  event: Event; // Event data from Firestore
}

// Event card component with hover effects and navigation
export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <style jsx>{`
        .card-glass {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
          cursor: pointer;
        }

        .card-glass:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow:
            0 24px 48px rgba(139, 92, 246, 0.2),
            0 12px 24px rgba(255, 107, 53, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          border-color: rgba(139, 92, 246, 0.5);
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
          background: linear-gradient(45deg,
            #8b5cf6, #06d6a0, #ff6b35, #ffd60a, #8b5cf6);
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
        </div>
      </div>
    </Link>
  );
}
