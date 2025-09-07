// Individual Event Page - Dynamic Route
// Displays detailed information for a specific event
// Route: /events/[slug] where slug is the document ID

import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { ImageGallery } from '@/components/events/image-gallery';

// Event detail page component
export default async function EventPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const filePath = path.join(process.cwd(), 'public', 'images', 'event-files', `${params.slug}.mdx`);
  
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const { data, content: body } = matter(content);
    
    const bodyImageMatch = body.match(/!\[.*?\]\((.*?)\)/);
    const cardImageSrc = data.image || (bodyImageMatch ? bodyImageMatch[1] : '');
    
    // Replace image src with full path
    const processedBody = body.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, (match, alt, src) => {
      const fullSrc = `/images/event-files/${params.slug}/${src}`;
      return `![${alt}](${fullSrc})`;
    });
    
    // Convert markdown to HTML
    const html = await remark().use(remarkHtml).process(processedBody);
    const htmlString = html.toString();
    
    // Get gallery images
    const imageDir = path.join(process.cwd(), 'public', 'images', 'event-files', params.slug);
    const imageFiles = await fs.readdir(imageDir).catch(() => []);
    const galleryImages = imageFiles
      .filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg') || file.endsWith('.gif'))
      .map(file => `/images/event-files/${params.slug}/${file}`);
    
    // Exclude card image from gallery
    let filteredGalleryImages = galleryImages;
    if (cardImageSrc) {
      const filename = path.basename(cardImageSrc);
      const cardSrc = `/images/event-files/${params.slug}/${filename}`;
      filteredGalleryImages = galleryImages.filter(img => img !== cardSrc);
    }

    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Event title with gradient styling */}
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            {data.title}
          </h1>
          
          {/* Event metadata */}
          <div className="mb-8 text-gray-400">
            <p>Date: {new Date(data.date).toLocaleDateString()}</p>
            {data.venue && <p>Venue: {data.venue}</p>}
          </div>
          
          {/* Event content */}
          <div className="prose prose-invert max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: htmlString }} />
          </div>
          
          {/* Speakers section */}
          {data.speakers && data.speakers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">Speakers</h3>
              <ul className="text-gray-300">
                {data.speakers.map((speaker: string, index: number) => (
                  <li key={index}>{speaker}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Registration link */}
          {data.registrationLink && (
            <div className="mb-8">
              <a 
                href={data.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-dmx-primary text-white rounded-lg hover:bg-dmx-primary/80 transition"
              >
                Register for Event
              </a>
            </div>
          )}
          
          {/* Image Gallery */}
          <ImageGallery images={filteredGalleryImages} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading event:', error);
    notFound();
  }
}
