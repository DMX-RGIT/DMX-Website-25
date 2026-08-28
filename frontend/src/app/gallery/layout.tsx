import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A visual archive of DMX events at RGIT Mumbai — hackathons, workshops, team socials, and behind-the-scenes moments captured in photos.",
  openGraph: {
    title: "Gallery | DMX — DataMatrix RGIT Mumbai",
    description:
      "A visual archive of DMX events at RGIT Mumbai — hackathons, workshops, team socials, and behind-the-scenes moments.",
    type: "website",
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
