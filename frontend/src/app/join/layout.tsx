import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join DMX",
  description:
    "Apply to join DMX — the AI & ML student committee at RGIT Mumbai. We're looking for developers, designers, researchers, and creators passionate about technology.",
  openGraph: {
    title: "Join DMX | DataMatrix RGIT Mumbai",
    description:
      "Apply to join DMX — the AI & ML student committee at RGIT Mumbai. We're looking for developers, designers, researchers, and creators passionate about technology.",
    type: "website",
  },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
