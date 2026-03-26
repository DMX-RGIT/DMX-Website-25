'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div className={isAdmin ? "" : "min-h-screen bg-team-gradient"}>
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "" : "pt-16"}>{children}</main>
    </div>
  );
}