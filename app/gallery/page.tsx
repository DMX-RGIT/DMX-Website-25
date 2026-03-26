import { getPublicPastEvents } from '@/lib/events';
import GalleryContent, { GalleryCategory } from './gallery-content';

interface GalleryPageProps {
  searchParams: Promise<{ event?: string }>;
}

function toCategoryLabel(slug: string, fallback: string) {
  return fallback || slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const { event: eventSlug } = await searchParams;
  const events = await getPublicPastEvents();

  const categories: GalleryCategory[] = events
    .filter((event) => (event.galleryImages || []).length > 0)
    .map((event) => ({
      id: event.slug,
      label: toCategoryLabel(event.slug, event.title),
      images: event.galleryImages || [],
      source: 'event',
    }));

  return (
    <GalleryContent
      categories={categories}
      initialCategoryId={eventSlug || 'all'}
    />
  );
}
