// Events Page - Server Component
// Displays all events from markdown files
// This page fetches data at build time for static generation

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Event } from '@/types';
import EventsContent from './EventsContent';

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

  return <EventsContent events={events} />;
}
