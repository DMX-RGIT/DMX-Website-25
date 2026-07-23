"use client";

import { AdminCrudPage } from "@/components/admin/AdminCrudPage";

export default function AdminTeamPage() {
  const fields = [
    { name: "name", label: "Name", type: "text" as const, required: true },
    { name: "role", label: "Role (e.g., President, Tech Lead)", type: "text" as const, required: true },
    {
      name: "tier",
      label: "Tier",
      type: "select" as const,
      required: true,
      options: [
        { label: "Core Committee", value: "core" },
        { label: "Domain Lead", value: "lead" },
        { label: "Member", value: "member" },
      ],
    },
    {
      name: "year",
      label: "Year (e.g., TE, SE, BE, FE)",
      type: "text" as const,
      required: false,
    },
    { name: "department", label: "Department (e.g., AIDS, COMP)", type: "text" as const },
    { name: "photo_url", label: "Photo URL", type: "url" as const },
    { name: "fun_fact", label: "Fun Fact", type: "text" as const, required: false },
    { name: "social_links", label: "Social Links (JSON object)", type: "json" as const, required: false },
    { name: "display_order", label: "Display Order (lower is first)", type: "number" as const },
  ];

  const columns = [
    {
      key: "photo_url",
      label: "Photo",
      render: (item: any) => (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-bg-surface border border-border-default">
          {item.photo_url ? (
            <img src={item.photo_url} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-brand-navy/20" />
          )}
        </div>
      ),
    },
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "tier", label: "Tier" },
    { key: "year", label: "Year" },
  ];

  return (
    <AdminCrudPage
      title="Team Members"
      endpoint="/team"
      fields={fields}
      columns={columns}
    />
  );
}
