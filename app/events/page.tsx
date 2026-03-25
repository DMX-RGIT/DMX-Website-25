import EventsContent from './EventsContent';
import { getPublicPastEvents } from '@/lib/events';

export const metadata = {
  title: 'Events | DMX',
  description: 'Explore all past DMX events, hackathons, workshops, and sessions in reverse chronological order.',
};

export default async function EventsPage() {
  const events = await getPublicPastEvents();
  return <EventsContent events={events} />;
}
