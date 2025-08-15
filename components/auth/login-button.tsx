'use client';

import { signIn } from 'next-auth/react';

export function LoginButton() {
  return (
    <button
      onClick={() => signIn('google')}
      className="px-4 py-2 bg-dmx-primary text-white rounded-lg hover:bg-dmx-primary/80 transition"
    >
      Sign In
    </button>
  );
}
