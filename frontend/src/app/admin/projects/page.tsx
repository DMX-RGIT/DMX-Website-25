"use client";

import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { Info } from "lucide-react";

export default function AdminProjectsPage() {
  const fields = [
    { name: "title", label: "Title", type: "text" as const, required: true },
    { name: "description", label: "Short Description", type: "textarea" as const, required: true },
    { name: "long_description", label: "Full Documentation (Markdown, use ---PAGE_BREAK--- to split pages)", type: "textarea" as const },
    {
      name: "domain",
      label: "Domain",
      type: "text" as const,
      required: true,
      placeholder: "e.g., Computer Vision, NLP, etc."
    },
    { name: "tech_stack", label: "Tech Stack (comma separated)", type: "tags" as const },
    { name: "github_url", label: "GitHub URL", type: "url" as const },
    { name: "demo_url", label: "Demo URL", type: "url" as const },
    { name: "image_url", label: "Image URL", type: "url" as const },
    { name: "contributors", label: "Contributors (JSON array of {name, role})", type: "json" as const },
    { name: "is_featured", label: "Featured on Homepage?", type: "boolean" as const },
    { name: "level", label: "Level Badge (e.g., Beginner, Advanced, Research)", type: "text" as const, placeholder: "e.g., Intermediate" },
    { name: "level_emoji", label: "Level Emoji (single emoji)", type: "text" as const, placeholder: "e.g., \uD83D\uDE80", required: false },
    { name: "level_color", label: "Level Badge Color (hex)", type: "color" as const, placeholder: "#34D9A6" },
    { name: "show_sidebar", label: "Show docs sidebar? (for multi-page projects)", type: "boolean" as const },
  ];

  const columns = [
    { key: "title", label: "Title" },
    { key: "domain", label: "Domain" },
    {
      key: "level",
      label: "Level",
      render: (item: any) => item.level ? (
        <span 
          className="px-2 py-0.5 text-xs font-medium rounded-full border"
          style={{ 
            backgroundColor: `${item.level_color || '#34D9A6'}15`,
            borderColor: `${item.level_color || '#34D9A6'}40`,
            color: item.level_color || '#34D9A6'
          }}
        >
          {item.level_emoji && `${item.level_emoji} `}{item.level}
        </span>
      ) : "-",
    },
    {
      key: "is_featured",
      label: "Featured",
      render: (item: any) => (item.is_featured ? "Yes" : "No"),
    },
  ];

  return (
    <div>
      {/* Info Card */}
      <div className="mb-6 p-4 rounded-xl border border-brand-navy-light/30 bg-brand-navy/10">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
          <div className="text-sm text-text-secondary space-y-2">
            <p className="font-semibold text-text-primary">Tips for great project pages</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Short Description:</strong> Shown on the project card — keep it concise (1-2 lines).</li>
              <li><strong>Full Documentation:</strong> Supports rich Markdown with headings, code blocks, images, and lists.</li>
              <li>Use <code className="px-1.5 py-0.5 bg-bg-primary rounded text-brand-teal font-mono text-xs">---PAGE_BREAK---</code> on its own line to split the content into multiple pages with next/previous navigation.</li>
              <li>The first heading (<code className="px-1.5 py-0.5 bg-bg-primary rounded text-brand-teal font-mono text-xs"># Title</code>) on each page becomes the sidebar title automatically.</li>
              <li><strong>Images in docs:</strong> Paste Cloudinary/image URLs using Markdown: <code className="px-1.5 py-0.5 bg-bg-primary rounded text-brand-teal font-mono text-xs">![description](https://...)</code></li>
              <li><strong>Sidebar toggle:</strong> Enable &quot;Show docs sidebar&quot; for multi-page projects. Single-page projects ignore this.</li>
              <li><strong>Level Badge:</strong> Set a level (e.g., &quot;Beginner&quot;), an emoji, and a custom hex color for the badge.</li>
            </ul>

            <div className="mt-3 p-3 bg-bg-primary rounded-lg border border-border-subtle">
              <p className="text-xs font-semibold text-text-primary mb-1">Example multi-page structure:</p>
              <pre className="text-xs font-mono text-text-secondary whitespace-pre-wrap">{`# Getting Started
Introduction content here...

---PAGE_BREAK---

# Architecture
Technical details here...

---PAGE_BREAK---

# API Reference
Endpoints and usage...`}</pre>
            </div>
          </div>
        </div>
      </div>

      <AdminCrudPage
        title="Projects"
        endpoint="/projects"
        fields={fields}
        columns={columns}
      />
    </div>
  );
}
