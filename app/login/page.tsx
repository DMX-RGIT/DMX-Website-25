'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h1 className="text-3xl font-bold mb-3">Welcome Back</h1>
        <p className="text-slate-300 mb-6">Sign in to access the DMX admin dashboard.</p>
        <button
          onClick={() => signIn('google', { callbackUrl: '/admin' })}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-700 transition-colors"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
