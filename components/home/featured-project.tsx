'use client';

import Link from 'next/link';

export function FeaturedProject() {
  // Mock featured project data
  const featuredProject = {
    id: "ai-chatbot",
    title: "AI Student Assistant Chatbot",
    description: "Intelligent chatbot using GPT-3 API for student academic assistance, query resolution, and campus information. Integrated with college database for real-time information.",
    techStack: ["Python", "OpenAI GPT-3", "Flask", "React", "PostgreSQL"],
    githubLink: "https://github.com/dmx-rgit/ai-chatbot",
    demoLink: "https://dmx-chatbot.vercel.app",
    coverImage: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=300&fit=crop"
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-12 text-center">
          Featured Project
        </h2>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden max-w-4xl mx-auto">
          {/* Project Cover Image */}
          <div className="relative h-64 w-full">
            <img
              src={featuredProject.coverImage}
              alt={featuredProject.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dmx-dark/80 to-transparent" />
          </div>
          
          {/* Project Content */}
          <div className="p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {featuredProject.title}
            </h3>
            <p className="text-gray-400 mb-6 text-lg leading-relaxed">
              {featuredProject.description}
            </p>
            
            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {featuredProject.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs bg-dmx-primary/20 text-dmx-primary rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            {/* Call to Action */}
            <div className="flex gap-4">
              <a
                href={featuredProject.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-dmx-primary text-white rounded-lg hover:bg-dmx-primary/80 transition"
              >
                View Demo
              </a>
              <a
                href={featuredProject.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition"
              >
                View Code
              </a>
              <Link 
                href="/projects"
                className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition"
              >
                All Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
