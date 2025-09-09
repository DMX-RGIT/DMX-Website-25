// Navigation Bar Component
// Main navigation component with authentication integration
// Shows different content based on user authentication status

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { UserMenu } from '@/components/auth/user-menu';
import { LoginButton } from '@/components/auth/login-button';

// Main navigation component
export function Navbar() {
  // Get current session data from NextAuth
  const { data: session } = useSession();
  // State for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Fixed navigation bar with MetaMask theme */}
      <nav className="fixed top-0 z-50 w-full metamask-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left side: Logo and navigation links */}
            <div className="flex items-center space-x-12"> {/* Increased spacing like MetaMask */}
              {/* DMX Logo */}
              <Link href="/" className="flex items-center space-x-2 logo-link">
                <Image
                  src="/images/dmx logo.png"
                  alt="DMX Logo"
                  width={120}
                  height={40}
                  className="dmx-logo-image"
                  priority
                />
              </Link>
              
              {/* Desktop navigation links */}
              <div className="hidden md:flex space-x-8"> {/* Increased spacing between links */}
                <Link href="https://events.dmxrgit.com/docs" className="nav-link text-dmx-primary hover:text-dmx-purple">
                  Events
                </Link>
                <Link href="/projects" className="nav-link text-dmx-primary hover:text-dmx-purple">
                  Projects
                </Link>
                <Link href="/team" className="nav-link text-dmx-primary hover:text-dmx-purple">
                  Team
                </Link>
              </div>
            </div>
            
            {/* Right side: Authentication section and mobile menu button */}
            <div className="flex items-center space-x-4">
              {/* Desktop auth section */}
              <div className="hidden md:block">
                {/* Show user menu if authenticated, login button if not */}
                {session && session.user ? <UserMenu user={session.user} /> : <LoginButton />}
              </div>
              
              {/* Mobile hamburger menu button */}
              <button
                className="md:hidden hamburger-button"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <div className={`hamburger-line ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`hamburger-line ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`hamburger-line ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
              </button>
            </div>
          </div>
          
          {/* Mobile menu overlay */}
          {isMobileMenuOpen && (
            <div className="mobile-menu-overlay md:hidden">
              <div className="mobile-menu">
                <div className="mobile-nav-links">
                  <Link 
                    href="https://events.dmxrgit.com/docs" 
                    className="mobile-nav-link text-dmx-primary hover:text-dmx-purple"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Events
                  </Link>
                  <Link 
                    href="/projects" 
                    className="mobile-nav-link text-dmx-primary hover:text-dmx-purple"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Projects
                  </Link>
                  <Link 
                    href="/team" 
                    className="mobile-nav-link text-dmx-primary hover:text-dmx-purple"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Team
                  </Link>
                </div>
                
                {/* Mobile auth section */}
                <div className="mobile-auth-section">
                  {session && session.user ? <UserMenu user={session.user} /> : <LoginButton />}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* MetaMask-inspired styling */}
      <style jsx>{`
        .metamask-navbar {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.98), 
            rgba(248, 250, 252, 0.95)); /* Light MetaMask background */
          border-bottom: 1px solid rgba(111, 66, 193, 0.08); /* Even more subtle border like MetaMask */
          backdrop-filter: blur(20px);
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.02),
            0 1px 2px rgba(0, 0, 0, 0.02); /* Much more subtle shadow like MetaMask */
        }

        .dmx-logo-image {
          height: auto;
          width: auto;
          max-height: 40px; /* Limit height to fit navbar */
          max-width: 120px; /* Limit width */
          transition: all 0.3s ease;
          filter: brightness(1) contrast(1);
        }

        .logo-link:hover .dmx-logo-image {
          transform: scale(1.05);
          filter: brightness(1.1) contrast(1.1);
        }

        .nav-link {
          color: #8b5cf6; /* Purple like team page */
          font-weight: 500; /* Medium weight like MetaMask */
          font-size: 0.95rem;
          letter-spacing: -0.01em; /* Tighter like MetaMask */
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px; /* Slightly less rounded like MetaMask */
          transition: all 0.2s ease; /* Faster transition like MetaMask */
          position: relative;
          text-transform: none;
        }

        .nav-link:hover {
          background: rgba(139, 92, 246, 0.1); /* Purple hover background */
          color: #7c3aed; /* Darker purple on hover */
          border-radius: 8px;
          transform: none; /* No transform like MetaMask */
        }

        /* Remove the underline effect */
        .nav-link::after {
          display: none;
        }

        /* Hamburger menu styles */
        .hamburger-button {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95), 
            rgba(248, 250, 252, 0.9));
          border: 2px solid rgba(111, 66, 193, 0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
          box-shadow: 
            0 4px 15px rgba(111, 66, 193, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        /* Hide hamburger on desktop */
        @media (min-width: 768px) {
          .hamburger-button {
            display: none !important;
          }
        }

        .hamburger-button:hover {
          background: linear-gradient(135deg, 
            rgba(111, 66, 193, 0.08), 
            rgba(246, 133, 27, 0.05));
          border-color: #f6851b;
          box-shadow: 
            0 6px 20px rgba(246, 133, 27, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transform: scale(1.05);
        }

        .hamburger-line {
          width: 20px;
          height: 2px;
          background: #6f42c1;
          margin: 2px 0;
          transition: all 0.3s ease;
          border-radius: 1px;
        }

        /* Mobile menu overlay */
        .mobile-menu-overlay {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.98), 
            rgba(248, 250, 252, 0.95));
          backdrop-filter: blur(20px);
          border-bottom: 2px solid rgba(111, 66, 193, 0.1);
          box-shadow: 
            0 8px 30px rgba(111, 66, 193, 0.15),
            0 4px 15px rgba(0, 0, 0, 0.08);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-menu {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-nav-link {
          color: #8b5cf6; /* Purple like team page */
          font-weight: 600;
          font-size: 1.1rem;
          letter-spacing: 0.01em;
          text-decoration: none;
          padding: 12px 16px;
          border-radius: 12px;
          transition: all 0.3s ease;
          background: transparent;
          border: 1px solid rgba(139, 92, 246, 0.2); /* Purple border */
        }

        .mobile-nav-link:hover {
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.1), 
            rgba(246, 133, 27, 0.05));
          color: #7c3aed; /* Darker purple on hover */
          border-color: rgba(246, 133, 27, 0.3);
          box-shadow: 
            0 4px 15px rgba(139, 92, 246, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transform: translateX(4px);
        }

        .mobile-auth-section {
          padding-top: 1rem;
          border-top: 1px solid rgba(111, 66, 193, 0.1);
          display: flex;
          justify-content: center;
        }

        /* Mobile responsive */
        @media (max-width: 767px) {
          .dmx-logo-image {
            max-height: 32px;
            max-width: 100px;
          }
          
          .metamask-navbar {
            padding: 0 1rem;
          }
        }

        /* Medium screens */
        @media (min-width: 768px) and (max-width: 1023px) {
          .dmx-logo-image {
            max-height: 36px;
            max-width: 110px;
          }
        }
      `}</style>
    </>
  );
}
