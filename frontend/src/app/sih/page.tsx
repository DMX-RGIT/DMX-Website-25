"use client";

/**
 * SIH 2026 — Internal Hackathon page.
 * Fully client-side. Uses next/dynamic with ssr: false to prevent crashes
 * from browser-only APIs (window, IntersectionObserver, matchMedia).
 */
import dynamic from "next/dynamic";

const SihInternalHackathon = dynamic(
  () => import("@/components/SihInternalHackathon"),
  { ssr: false },
);

export default function SihPage() {
  return <SihInternalHackathon />;
}
