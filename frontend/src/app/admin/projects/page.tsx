"use client";

import { AdminCrudPage } from "@/components/admin/AdminCrudPage";

export default function AdminProjectsPage() {
  const fields = [
    { name: "title", label: "Title", type: "text" as const, required: true },
    { name: "description", label: "Short Description", type: "textarea" as const, required: true },
    { name: "long_description", label: "Long Description", type: "textarea" as const },
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
  ];

  const columns = [
    { key: "title", label: "Title" },
    { key: "domain", label: "Domain" },
    {
      key: "is_featured",
      label: "Featured",
      render: (item: any) => (item.is_featured ? "Yes" : "No"),
    },
  ];

  return (
    <AdminCrudPage
      title="Projects"
      endpoint="/projects"
      fields={fields}
      columns={columns}
    />
  );
}
