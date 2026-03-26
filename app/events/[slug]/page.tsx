import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { remark } from 'remark';
import html from 'remark-html';
import EventDetailContent from './EventDetailContent';
import { getPublicEventBySlug, getPublicPastEvents } from '@/lib/events';

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const events = await getPublicPastEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  return {
    title: `${event.title} | DMX Events`,
    description: event.description,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) {
    notFound();
  }

  const processedContent = await remark()
    .use(html)
    .process(event.content || '');
  const contentHtml = processedContent.toString();

  return (
    <EventDetailContent 
      event={{
        slug: event.slug,
        title: event.title,
        description: event.description,
        date: event.date,
        venue: event.venue,
        image: event.coverImage,
        galleryImages: event.galleryImages,
        tags: event.tags,
      }}
      htmlContent={contentHtml} 
    />
  );
}
