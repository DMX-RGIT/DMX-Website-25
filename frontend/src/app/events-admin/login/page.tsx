"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Terminal, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DMXLogo } from "@/components/layout/DMXLogo";

export default function EventsAdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Invalid credentials");
      }

      const { access_token, role } = await res.json();

      if (role !== "events" && role !== "superadmin") {
        throw new Error("Access denied. This panel is for the Events team only.");
      }

      localStorage.setItem("dmx_events_admin_token", access_token);
      router.push("/events-admin");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-primary">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <DMXLogo className="h-10 w-auto mx-auto mb-4" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-teal/30 bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-wider mb-3">
            <CalendarDays className="w-3.5 h-3.5" />
            Events Admin
          </div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Events Panel</h1>
          <p className="text-sm text-text-secondary mt-1">Events team access only</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <Terminal className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-text-secondary">Username</label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="events"
                  className="pl-10"
                />
                <ShieldCheck className="w-5 h-5 text-text-muted absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-text-secondary">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="pl-10"
                />
                <Lock className="w-5 h-5 text-text-muted absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-sm text-bg-primary transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "var(--gradient-teal)" }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          Super admin?{" "}
          <a href="/admin/login" className="text-brand-teal hover:underline">
            Go to full admin panel →
          </a>
        </p>
      </motion.div>
    </div>
  );
}
