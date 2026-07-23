"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getToken(): string {
  return localStorage.getItem("dmx_admin_token") || "";
}

export default function ContentAdminPage() {
  const [data, setData] = useState({
    stats: { members: 0, projects: 0, events: 0, papers: 0 },
    about_text: "",
    terminal_code: "",
    testimonials: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/content`)
      .then(res => res.json())
      .then(json => {
        const defaultTerminal = `dmx status
→ 15+ active research projects
→ 500+ members trained across 3 years
→ 3 hackathons completed this year
→ Next event: Hack2Infinity 2026 — Dec 14

dmx list-projects --featured
┌─ SentimentLens     [NLP]     ██████████ 92%
├─ VisionForge       [CV]      ████████░░ 78%
├─ DataPulse         [GenAI]   ██████░░░░ 65%
└─ RoboSense         [Robotics] █████░░░░░ 52%

dmx upcoming --format=short
Dec 14  Hack2Infinity 2026       hackathon
Jan 08  Intro to Transformers    workshop
Jan 22  MLOps Deep Dive          workshop`;

        const defaultTestimonials = [
          { quote: "DMX gave me the confidence to submit my first ML research paper. The mentorship here is unreal.", name: "Aarav Patel", role: "3rd Year, Computer Engineering", initiative: "NLP Research Lead" },
          { quote: "Hack2Infinity was a turning point for me. 36 hours of pure building — I learned more there than in an entire semester.", name: "Sneha Iyer", role: "2nd Year, Data Science", initiative: "Hackathon Participant" },
          { quote: "The workshops don't just teach you theory. You walk out with a deployed model. That's the DMX difference.", name: "Rohan Mehta", role: "4th Year, AI & ML", initiative: "Workshop Instructor" },
          { quote: "Being part of the core committee taught me more about leadership and project management than any course ever could.", name: "Priya Sharma", role: "3rd Year, Computer Engineering", initiative: "Core Committee Member" }
        ];

        setData({
          stats: json.stats || { members: 0, projects: 0, events: 0, papers: 0 },
          about_text: json.about_text || "",
          terminal_code: json.terminal_code || defaultTerminal,
          testimonials: (json.testimonials && json.testimonials.length > 0) ? json.testimonials : defaultTestimonials
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/admin/content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to save content");
      setSuccess("Content updated successfully.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStatChange = (key: string, value: string) => {
    setData(prev => ({
      ...prev,
      stats: { ...prev.stats, [key]: Number(value) }
    }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">Site Content</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-bg-primary transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "var(--gradient-teal)" }}
        >
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">{error}</div>}
      {success && <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg">{success}</div>}

      <div className="space-y-8">
        <section className="p-6 bg-bg-secondary border border-border-default rounded-xl">
          <h2 className="text-xl font-bold mb-4">Impact Stats</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {["members", "projects", "events", "papers"].map(key => (
              <div key={key} className="space-y-2">
                <label className="text-sm text-text-secondary capitalize">{key}</label>
                <input
                  type="number"
                  value={(data.stats as any)[key]}
                  onChange={e => handleStatChange(key, e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal text-text-primary"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 bg-bg-secondary border border-border-default rounded-xl">
          <h2 className="text-xl font-bold mb-2">Terminal Mockup (Landing Page)</h2>
          <p className="text-text-secondary text-sm mb-4">
            Note: Lines starting with <code>dmx</code> or <code>$</code> will be treated as typed commands with a prompt. All other lines will appear as standard output text.
          </p>
          <textarea
            rows={8}
            value={data.terminal_code}
            onChange={e => setData(prev => ({ ...prev, terminal_code: e.target.value }))}
            className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal text-text-primary font-mono text-sm resize-none"
            placeholder="pip install antigravity..."
          />
        </section>

        <section className="p-6 bg-bg-secondary border border-border-default rounded-xl">
          <h2 className="text-xl font-bold mb-4">Testimonials (JSON Array)</h2>
          <textarea
            rows={10}
            value={typeof data.testimonials === "string" ? data.testimonials : JSON.stringify(data.testimonials, null, 2)}
            onChange={e => {
              try {
                setData(prev => ({ ...prev, testimonials: JSON.parse(e.target.value) }));
              } catch {
                setData(prev => ({ ...prev, testimonials: e.target.value as any }));
              }
            }}
            className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal text-text-primary font-mono text-sm resize-none"
            placeholder='[{"name": "...", "role": "...", "text": "..."}]'
          />
        </section>
      </div>
    </div>
  );
}
