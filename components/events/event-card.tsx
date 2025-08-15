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
    // Link wrapper for navigation to event detail page
    <Link href={`/events/${event.id}`}> {/* Uses Firestore document ID as slug */}
      <div className="group relative bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 card-hover">
        {/* Event cover image section */}
        {event.coverImage && (
          <div className="relative h-48 w-full">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              // TODO: Add placeholder/fallback image
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-dmx-dark/80 to-transparent" />
          </div>
        )}
        
        {/* Event information section */}
        <div className="p-6">
          {/* Event title with hover effect */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition">
            {event.title}
          </h3>
          
          {/* Event description - truncated to 2 lines */}
          <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>
          
          {/* Event metadata (date and venue) */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {/* Event date */}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {event.date instanceof Date 
                ? event.date.toLocaleDateString()
                : new Date(event.date).toLocaleDateString()
              }
            </div>
            
            {/* Event venue (if available) */}
            {event.venue && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {event.venue}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
