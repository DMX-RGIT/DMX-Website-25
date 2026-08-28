import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about DMX (DataMatrix) — RGIT Mumbai's AI & ML student committee. Discover our mission, vision, and the story behind our technical community.",
  openGraph: {
    title: "About DMX | DataMatrix RGIT Mumbai",
    description:
      "Learn about DMX (DataMatrix) — RGIT Mumbai's AI & ML student committee. Discover our mission, vision, and the story behind our technical community.",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
