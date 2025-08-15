'use client';

import { signOut } from 'next-auth/react';
import Image from 'next/image';

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <div className="flex items-center space-x-3">
      {user.image && (
        <Image
          src={user.image}
          alt={user.name || 'User'}
          width={32}
          height={32}
          className="rounded-full"
        />
      )}
      <span className="text-white">{user.name}</span>
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Sign Out
      </button>
    </div>
  );
}
