'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();

  // In a real app, you would check for authentication status here
  // and redirect to login if not authenticated
  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-dmx-dark text-white">
      {/* Header */}
      <header className="bg-dmx-dark/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          {[
            { title: 'Total Users', value: '1,234' },
            { title: 'Active Events', value: '12' },
            { title: 'Revenue', value: '$24,567' },
          ].map((stat, index) => (
            <div key={index} className="bg-dmx-dark/50 border border-white/10 rounded-lg p-6">
              <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-dmx-dark/50 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <p className="text-sm">Activity log entry {item}</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
