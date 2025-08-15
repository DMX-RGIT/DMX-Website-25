'use client';

import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push('/');
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
        <h1 className="text-3xl font-bold text-gradient mb-8 text-center">Register</h1>
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full px-6 py-3 bg-dmx-primary text-white rounded-lg hover:bg-dmx-primary/80 transition"
        >
          Register with Google
        </button>
      </div>
    </div>
  );
}
