// Individual Event Page - Dynamic Route
// Displays detailed information for a specific event
// Route: /events/[slug] where slug is the document ID

import { notFound } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Event detail page component
// TODO: Integrate with Fumadocs for MDX content rendering
export default async function EventPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // Fetch specific event document from Firestore using the slug as document ID
  const eventDoc = await getDoc(doc(db, 'events', params.slug));
  
  // Return 404 if event doesn't exist
  if (!eventDoc.exists()) {
    notFound();
  }

  const eventData = eventDoc.data();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Event title with gradient styling */}
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
          {eventData.title}
        </h1>
        
        {/* Event metadata */}
        <div className="mb-8 text-gray-400">
          <p>Date: {new Date(eventData.date.toDate()).toLocaleDateString()}</p>
          {eventData.venue && <p>Venue: {eventData.venue}</p>}
        </div>
        
        {/* Event content */}
        <div className="prose prose-invert max-w-none">
          {/* Basic description - TODO: Replace with MDX content */}
          <p className="text-gray-300">{eventData.description}</p>
          
          {/* Speakers section */}
          {eventData.speakers && (
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white mb-2">Speakers</h3>
              <ul className="text-gray-300">
                {eventData.speakers.map((speaker: string, index: number) => (
                  <li key={index}>{speaker}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Registration link */}
          {eventData.registrationLink && (
            <div className="mt-6">
              <a 
                href={eventData.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-dmx-primary text-white rounded-lg hover:bg-dmx-primary/80 transition"
              >
                Register for Event
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
