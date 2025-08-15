// Events Page - Server Component
// Displays all events from Firestore database
// This page fetches data at build time for static generation

import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EventCard } from '@/components/events/event-card';
import { Event } from '@/types';

// Server-side function to fetch all events from Firestore
// This runs at build time for static generation
async function getEvents(): Promise<Event[]> {
  // For development/preview - use mock data directly
  if (process.env.NODE_ENV === 'development') {
    return getMockEvents();
  }
  
  try {
    const eventsCol = collection(db, 'events');  // Reference to 'events' collection
    const snapshot = await getDocs(eventsCol);   // Get all documents
    
    // Transform Firestore documents to Event objects
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Event));
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return mock data for development/preview
    return getMockEvents();
  }
}

// Mock data for development and preview
function getMockEvents(): Event[] {
  return [
    {
      id: "ai-workshop-2024",
      title: "AI/ML Workshop 2024",
      date: new Date("2024-03-15T09:00:00"),
      description: "Join us for an intensive hands-on workshop covering the fundamentals of machine learning and artificial intelligence. Learn Python, TensorFlow, and real-world applications.",
      coverImage: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=400&fit=crop",
      speakers: ["Dr. Sarah Wilson", "Prof. Mark Thompson"],
      venue: "Tech Lab, RGIT Main Campus",
      mdxSlug: "ai-workshop-2024",
      registrationLink: "https://forms.google.com/ai-workshop"
    },
    {
      id: "web-dev-bootcamp",
      title: "Full Stack Web Development Bootcamp",
      date: new Date("2024-04-20T10:00:00"),
      description: "3-day intensive bootcamp covering React, Node.js, MongoDB, and deployment strategies. Build a complete web application from scratch.",
      coverImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
      speakers: ["Alex Rivera", "Priya Sharma"],
      venue: "Innovation Lab, 2nd Floor",
      mdxSlug: "web-dev-bootcamp",
      registrationLink: "https://forms.google.com/web-bootcamp"
    },
    {
      id: "hackathon-2024",
      title: "DMX Hackathon 2024",
      date: new Date("2024-05-10T18:00:00"),
      description: "48-hour hackathon focused on solving real-world problems using AI and emerging technologies. Prizes worth ₹50,000!",
      coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop",
      speakers: ["Industry Mentors", "Tech Leaders"],
      venue: "Main Auditorium & Labs",
      mdxSlug: "hackathon-2024"
    }
  ];
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
