import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { remark } from 'remark';
import html from 'remark-html';
import EventDetailContent from './EventDetailContent';

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const eventsDir = path.join(process.cwd(), 'public/images/event-files');

export async function generateStaticParams() {
  if (!fs.existsSync(eventsDir)) return [];
  
  const files = fs.readdirSync(eventsDir);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => ({
      slug: file.replace(/\.mdx$/, ''),
    }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(eventsDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return {
      title: 'Event Not Found',
    };
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContent);

  return {
    title: `${data.title} | DMX Events`,
    description: data.description,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const filePath = path.join(eventsDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  const processedContent = await remark()
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  return (
    <EventDetailContent 
      event={{
        title: data.title,
        description: data.description || '',
        date: data.date,
        venue: data.venue,
        image: data.image,
        tags: data.tags
      }}
      htmlContent={contentHtml} 
    />
  );
}
