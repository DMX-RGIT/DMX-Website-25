// Events Page - Server Component
// Displays all events from markdown files
// This page fetches data at build time for static generation

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { EventCard } from '@/components/events/event-card';
import { Event } from '@/types';

// Server-side function to fetch all events from markdown files
async function getEvents(): Promise<Event[]> {
  const eventsDir = path.join(process.cwd(), 'public', 'images', 'event-files');
  
  try {
    const files = await fs.readdir(eventsDir);
    const events: Event[] = [];

    for (const file of files) {
      if (path.extname(file) === '.mdx' || path.extname(file) === '.md') {
        const filePath = path.join(eventsDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const { data, content: body } = matter(content);
        
        // Find first image in body as cardImage
        const imageMatch = body.match(/!\[.*?\]\((.*?)\)/);
        const cardImage = data.image || (imageMatch ? `/images/event-files/${path.basename(file, path.extname(file))}/${imageMatch[1]}` : '');
        
        events.push({
          id: path.basename(file, path.extname(file)),
          title: data.title || 'Untitled Event',
          date: new Date(data.date || Date.now()),
          description: data.description || '',
          coverImage: cardImage,
          speakers: data.speakers || [],
          venue: data.venue || '',
          mdxSlug: '', // Not used anymore
          registrationLink: data.registrationLink || '',
        });
      }
    }
    
    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (error) {
    console.error('Error reading events:', error);
    return [];
  }
}

// Events page component - displays all events in a grid layout
export default async function EventsPage() {
  const events = await getEvents(); // Fetch events data

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page title with gradient text styling */}
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-12">Events</h1>
        
        {/* Events grid - responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length > 0 ? (
            // Render event cards if events exist
            events.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            // Show message if no events found
            <div className="col-span-full text-center text-gray-400">
              <p>No events found. Please check back later!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
