// Navigation Bar Component
// Main navigation component with authentication integration
// Shows different content based on user authentication status

'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserMenu } from '@/components/auth/user-menu';
import { LoginButton } from '@/components/auth/login-button';

// Main navigation component
export function Navbar() {
  // Get current session data from NextAuth
  const { data: session } = useSession();

  return (
    // Fixed navigation bar with backdrop blur effect
    <nav className="fixed top-0 z-50 w-full backdrop-blur-lg bg-dmx-dark/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left side: Logo and navigation links */}
          <div className="flex items-center space-x-8">
            {/* DMX Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gradient">DMX</span>
            </Link>
            
            {/* Desktop navigation links */}
            <div className="hidden md:flex space-x-6">
              <Link href="/events" className="text-gray-300 hover:text-white transition">
                Events
              </Link>
              <Link href="/projects" className="text-gray-300 hover:text-white transition">
                Projects
              </Link>
              <Link href="/team" className="text-gray-300 hover:text-white transition">
                Team
              </Link>
            </div>
          </div>
          
          {/* Right side: Authentication section */}
          <div>
            {/* Show user menu if authenticated, login button if not */}
            {session && session.user ? <UserMenu user={session.user} /> : <LoginButton />}
          </div>
        </div>
      </div>
    </nav>
  );
}
