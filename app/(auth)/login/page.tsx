// pages/login.js
'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const usersRef = collection(db, 'logins');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setMessage('User not found.');
        return;
      }

      const user = querySnapshot.docs[0].data();
      if (user.password === password) {
        // Store authentication status in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        // Redirect to admin panel
        window.location.href = '/admin';
      } else {
        setMessage('Incorrect password.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen metamask-page">
      <style jsx>{`
        .metamask-page {
          background: linear-gradient(135deg, #fef7f4 0%, #fff5f0 50%, #f9f4ff 100%);
          min-height: 100vh;
          padding: 1rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Floating geometric shapes animation */
        .metamask-page::before {
          content: '';
          position: absolute;
          top: 10%;
          left: -5%;
          width: 150px;
          height: 150px;
          background: linear-gradient(45deg, #ff6b35, #f7931e);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: float1 12s ease-in-out infinite;
          z-index: 1;
        }

        .metamask-page::after {
          content: '';
          position: absolute;
          top: 60%;
          right: -3%;
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          border-radius: 50% 20% 50% 20%;
          animation: float2 15s ease-in-out infinite reverse;
          z-index: 1;
        }

        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }

        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(-180deg); }
        }

        /* Add more floating shapes */
        .floating-shape-1 {
          position: absolute;
          top: 30%;
          right: 10%;
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, #06d6a0, #118ab2);
          border-radius: 20px;
          animation: float3 10s ease-in-out infinite;
          z-index: 1;
          transform-origin: center;
        }

        .floating-shape-2 {
          position: absolute;
          bottom: 20%;
          left: 8%;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #ffd60a, #ff8500);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          animation: float4 14s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes float3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.1); }
        }

        @keyframes float4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-35px) rotate(120deg); }
        }

        /* Mobile first responsive padding */
        @media (min-width: 640px) {
          .metamask-page {
            padding: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .metamask-page {
            padding: 2rem;
          }
        }

        .glass-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 
            0 20px 40px rgba(139, 92, 246, 0.1),
            0 8px 32px rgba(255, 107, 53, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        }

        /* Responsive design for larger screens */
        @media (min-width: 640px) {
          .glass-container {
            padding: 2rem;
            border-radius: 28px;
            margin-bottom: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .glass-container {
            padding: 2.5rem;
            border-radius: 32px;
            margin-bottom: 3rem;
          }
        }

        .glass-container:hover {
          transform: translateY(-8px);
          box-shadow: 
            0 32px 64px rgba(139, 92, 246, 0.2),
            0 16px 48px rgba(255, 107, 53, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          border-color: rgba(139, 92, 246, 0.4);
        }

        /* Animated gradient border effect */
        .glass-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(45deg, 
            #8b5cf6, #06d6a0, #ff6b35, #ffd60a, #8b5cf6);
          background-size: 300% 300%;
          animation: gradientShift 6s ease infinite;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: subtract;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .glass-container:hover::before {
          opacity: 1;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .page-title {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 3.5rem; /* Bold like MetaMask */
          font-weight: 900; /* Extra bold */
          background: linear-gradient(135deg, #8b5cf6, #5b21b6, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: #5b21b6; /* Fallback */
          line-height: 0.9;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          position: relative;
          z-index: 2;
          animation: titlePulse 4s ease-in-out infinite;
        }

        @keyframes titlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        /* Responsive title sizing */
        @media (min-width: 640px) {
          .page-title {
            font-size: 4rem;
            margin-bottom: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .page-title {
            font-size: 5rem;
            margin-bottom: 3rem;
          }
        }

        .section-title {
          color: #6b21a8;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
          z-index: 2;
        }

        /* Responsive section title */
        @media (min-width: 640px) {
          .section-title {
            font-size: 1.2rem;
            margin-bottom: 1.75rem;
          }
        }

        @media (min-width: 1024px) {
          .section-title {
            font-size: 1.3rem;
            margin-bottom: 2rem;
          }
        }
      `}</style>

      {/* Floating Shapes */}
      <div className="floating-shape-1"></div>
      <div className="floating-shape-2"></div>

      {/* Page Title */}
      <h1 className="page-title">
        Sign in to your account
      </h1>

      {/* Login Form Section */}
      <div className="glass-container max-w-md mx-auto">
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/register" className="font-medium text-purple-600 hover:text-purple-500">
            create a new account
          </Link>
        </p>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className={`text-sm p-3 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
