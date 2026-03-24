import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Event } from '@/types';
import EventsContent from './EventsContent';

export const metadata = {
  title: 'Events | DMX',
  description: 'Explore upcoming and past events, hackathons, and workshops organized by DMX.',
};

// Function to fetch all events from MDX files
function getEvents(): Event[] {
  const eventsDir = path.join(process.cwd(), 'public/images/event-files');
  
  // Check if directory exists
  if (!fs.existsSync(eventsDir)) {
    return [];
  }

  const files = fs.readdirSync(eventsDir);
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

  const events = mdxFiles.map((file) => {
    const filePath = path.join(eventsDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    const slug = file.replace(/\.mdx$/, '');

    // Map frontmatter to Event interface
    return {
      id: slug,
      title: data.title || 'Untitled Event',
      date: data.date ? new Date(data.date) : new Date(),
      description: data.description || '',
      coverImage: data.image || '/images/placeholder-event.jpg', // Fallback image if needed
      mdxSlug: slug,
      venue: data.venue || 'TBA', // Optional field
      speakers: data.speakers || [], // Optional field
      registrationLink: data.registrationLink // Optional field
    } as Event;
  });

  // Sort events by date (newest first)
  return events.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export default function EventsPage() {
  const allEvents = getEvents();
  const currentDate = new Date();

  // Split events into upcoming and past
  const upcomingEvents = allEvents.filter(event => event.date >= currentDate).reverse(); // Show nearest upcoming first
  const pastEvents = allEvents.filter(event => event.date < currentDate);

  return <EventsContent upcomingEvents={upcomingEvents} pastEvents={pastEvents} />;
}
