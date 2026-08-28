import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse real-world projects built by DMX members at RGIT Mumbai — spanning AI, web development, computer vision, NLP, and hardware engineering.",
  openGraph: {
    title: "Projects | DMX — DataMatrix RGIT Mumbai",
    description:
      "Browse real-world projects built by DMX members at RGIT Mumbai — spanning AI, web development, computer vision, NLP, and hardware engineering.",
    type: "website",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
