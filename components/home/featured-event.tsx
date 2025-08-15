'use client';

import Link from 'next/link';

export function FeaturedEvent() {
  // Mock featured event data
  const featuredEvent = {
    id: "ai-workshop-2024",
    title: "AI/ML Workshop 2024",
    description: "Join us for an intensive hands-on workshop covering the fundamentals of machine learning and artificial intelligence. Learn Python, TensorFlow, and real-world applications.",
    date: "March 15, 2024",
    venue: "Tech Lab, RGIT Main Campus",
    coverImage: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=300&fit=crop"
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-12 text-center">
          Featured Event
        </h2>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden max-w-4xl mx-auto">
          {/* Event Cover Image */}
          <div className="relative h-64 w-full">
            <img
              src={featuredEvent.coverImage}
              alt={featuredEvent.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dmx-dark/80 to-transparent" />
          </div>
          
          {/* Event Content */}
          <div className="p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {featuredEvent.title}
            </h3>
            <p className="text-gray-400 mb-6 text-lg leading-relaxed">
              {featuredEvent.description}
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-2">
                📅 {featuredEvent.date}
              </span>
              <span className="flex items-center gap-2">
                📍 {featuredEvent.venue}
              </span>
            </div>
            
            {/* Call to Action */}
            <div className="flex gap-4">
              <Link 
                href={`/events/${featuredEvent.id}`}
                className="px-6 py-3 bg-dmx-primary text-white rounded-lg hover:bg-dmx-primary/80 transition"
              >
                Learn More
              </Link>
              <Link 
                href="/events"
                className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition"
              >
                View All Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
