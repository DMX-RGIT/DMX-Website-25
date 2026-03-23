"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Calendar, FolderOpen, Image as ImageIcon, Users, LogOut } from "lucide-react";

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

  useEffect(() => {
    if (!localStorage.getItem("isAuthenticated")) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-[100vh] bg-[#0c0c0e] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black/90 border-r border-white/10 flex flex-col pt-8">
        <div className="px-6 mb-8">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
              DMX Admin
            </h1>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              localStorage.removeItem("isAuthenticated");
              router.push("/login");
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto w-full max-h-screen">
        <header className="h-16 border-b border-white/10 flex items-center px-8 bg-black/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <h2 className="text-xl font-semibold">
            {navigation.find(n => pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href)))?.name || 'Admin'}
          </h2>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
