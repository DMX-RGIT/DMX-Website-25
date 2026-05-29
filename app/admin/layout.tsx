"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, Calendar, FolderOpen, Image as ImageIcon, Users, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Team', href: '/admin/team', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAdmin = Boolean(session?.user?.isAdmin);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (status === "loading") {
    return <div className="min-h-screen bg-dmx-dark text-white grid place-items-center">Checking authentication...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-dmx-dark text-white flex items-center justify-center p-6">
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-dmx-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
             <LayoutDashboard className="text-dmx-primary w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-white">Admin Access</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">Sign in with your admin credentials to continue to the dashboard.</p>
          <button
            onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(pathname || '/admin')}`)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-dmx-primary to-dmx-secondary hover:opacity-90 text-white font-medium transition-all shadow-lg shadow-dmx-primary/25 active:scale-[0.98]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-dmx-dark text-white flex items-center justify-center p-6">
        <div className="bg-slate-900/80 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogOut className="text-red-500 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-white">Unauthorized</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">Your account does not have admin access for this dashboard. Please contact an administrator.</p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-medium transition-colors"
          >
            Back to Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dmx-dark text-slate-200 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-dmx-dark/80 backdrop-blur-md sticky top-0 z-40 shrink-0">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/images/dmx logo.png" alt="DMX Logo" width={100} height={30} className="w-auto h-8 brightness-0 mt-1 invert" />
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-slate-900 border-r border-white/5 flex flex-col pt-0 md:pt-8 z-40 transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="px-8 mb-10 hidden md:flex items-center gap-3">
          <Link href="/admin">
            <Image src="/images/dmx logo.png" alt="DMX Logo" width={140} height={42} className="w-auto h-12 brightness-0 invert hover:opacity-80 transition-opacity" />
          </Link>
        </div>

        {/* Mobile Sidebar Header */}
        <div className="p-6 flex items-center justify-between md:hidden border-b border-white/5 mb-4">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Navigation</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 lg:px-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-gradient-to-r from-dmx-primary/20 to-dmx-secondary/10 text-dmx-secondary border border-dmx-primary/20 shadow-inner' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-dmx-secondary' : 'text-slate-500'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 lg:p-6 border-t border-white/5 mt-auto">
          <div className="bg-white/5 rounded-xl p-4 mb-4 flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dmx-primary to-dmx-secondary flex items-center justify-center text-white font-bold text-sm">
               {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'A'}
            </div>
            <div className="flex-col overflow-hidden hidden lg:flex">
              <span className="text-sm font-medium text-white truncate">{session.user?.name || 'Admin User'}</span>
              <span className="text-xs text-slate-400 truncate">{session.user?.email}</span>
            </div>
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0c0c0e]">
        <header className="hidden md:flex h-20 border-b border-white/5 items-center px-10 bg-[#0c0c0e]/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {navigation.find(n => pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href)))?.name || 'Dashboard'}
          </h2>
          <div className="ml-auto flex items-center gap-4">
             {/* Additional header actions can go here */}
             <div className="text-sm text-gray-400">
               <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
               System Online
             </div>
          </div>
        </header>
        <div className="p-4 md:p-8 lg:p-10 overflow-y-auto flex-1 custom-scrollbar w-full relative">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
