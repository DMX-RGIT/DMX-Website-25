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
import EventDetailContent from './EventDetailContent';

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
      <EventDetailContent
        title={data.title}
        date={new Date(data.date).toLocaleDateString()}
        venue={data.venue}
        description={data.description}
        speakers={data.speakers}
        registrationLink={data.registrationLink}
        htmlContent={htmlString}
        galleryImages={filteredGalleryImages}
      />
    );
  } catch (error) {
    console.error('Error loading event:', error);
    notFound();
  }
}
