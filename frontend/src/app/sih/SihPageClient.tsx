"use client";

/**
 * SihPageClient.tsx — Client Component boundary.
 *
 * Uses `next/dynamic` with `ssr: false` to prevent SihInternalHackathon
 * from being server-rendered, since it uses browser-only APIs
 * (IntersectionObserver, window, matchMedia).
 *
 * This file intentionally only does one thing: own the dynamic import.
 * All page logic lives in SihInternalHackathon.tsx.
 */
import dynamic from "next/dynamic";

const SihInternalHackathon = dynamic(
  () => import("@/components/SihInternalHackathon"),
  { ssr: false },
);

export default function SihPageClient() {
  return <SihInternalHackathon />;
}
