import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Explore upcoming and past events by DMX at RGIT Mumbai — hackathons, workshops, seminars, LAN parties, and campus fests. Register and stay in the loop.",
  openGraph: {
    title: "Events | DMX — DataMatrix RGIT Mumbai",
    description:
      "From 36-hour hackathons to deep learning workshops, join DMX events at RGIT Mumbai to build, learn, and connect.",
    type: "website",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
