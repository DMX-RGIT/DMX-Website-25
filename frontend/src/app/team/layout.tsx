import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the team behind DMX — the students, leads, and core members driving AI, ML, and tech innovation at RGIT Mumbai.",
  openGraph: {
    title: "Team | DMX — DataMatrix RGIT Mumbai",
    description:
      "Meet the students, leads, and core members driving AI, ML, and tech innovation at DMX, RGIT Mumbai.",
    type: "website",
  },
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
