'use client';

import Link from 'next/link';

export function LoginButton() {
  return (
    <Link
      href="/login?callbackUrl=/admin"
      className="inline-flex px-4 py-2 bg-dmx-primary text-white rounded-lg hover:bg-dmx-primary/80 transition"
    >
      Admin Login
    </Link>
  );
}
