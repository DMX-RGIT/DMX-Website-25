import type { Metadata } from "next";
import { api } from "@/lib/api";
import { stripMarkdown } from "@/lib/utils";
import { EventDetailClient } from "@/components/events/EventDetailClient";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const event = await api.events.get(id);
    const description = stripMarkdown(event.description).slice(0, 155);
    const image = event.image_url || event.poster_url || "/dmx_logo.png";

    return {
      title: event.title,
      description,
      openGraph: {
        title: `${event.title} | DMX — RGIT Mumbai`,
        description,
        type: "article",
        images: [{ url: image }],
      },
      twitter: {
        card: "summary_large_image",
        title: event.title,
        description,
        images: [image],
      },
    };
  } catch {
    return { title: "Event", description: "DMX event at RGIT Mumbai." };
  }
}




export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

const event = await api.events.get(id).catch((err) => {
    console.error("EVENT FETCH FAILED:", err);
    return null;
  });

  if (!event) notFound();

  const sponsors = event.sponsors ?? [];

  const description = stripMarkdown(event.description).slice(0, 300);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    endDate: event.end_date || event.date,
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.venue,
      address: "RGIT Campus, Mumbai",
    },
    description,
    image: [event.image_url || event.poster_url].filter(Boolean),
    organizer: { "@type": "Organization", name: "DMX — RGIT Mumbai" },
    sponsor: sponsors.map((s) => ({
      "@type": "Organization",
      name: s.name,
      url: s.website_url || undefined,
      logo: s.logo_url,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventDetailClient event={event} sponsors={sponsors} />
    </>
  );
}
