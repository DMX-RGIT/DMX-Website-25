"use client";

import Image from "next/image";
import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { Info } from "lucide-react";

// Generate batch years dynamically from 2022 to current year
function getBatchYears(): { label: string; value: string }[] {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 2022; y--) {
    years.push({ label: String(y), value: String(y) });
  }
  return years;
}

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
      label: "Academic Year (e.g., TE, SE, BE, FE)",
      type: "text" as const,
      required: false,
    },
    { name: "department", label: "Department (e.g., AIDS, COMP)", type: "text" as const },
    { name: "photo_url", label: "Photo URL", type: "url" as const },
    { name: "fun_fact", label: "Fun Fact", type: "text" as const, required: false },
    { name: "social_links", label: "Social Links", type: "social_links" as const, required: false },
    { name: "display_order", label: "Display Order (lower is first)", type: "number" as const },
    { name: "is_alumni", label: "Is Alumni / Passed Out?", type: "boolean" as const },
    {
      name: "batch_year",
      label: "Batch Year (for alumni)",
      type: "select" as const,
      options: getBatchYears(),
    },
  ];

  const columns = [
    {
      key: "photo_url",
      label: "Photo",
      render: (item: any) => (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-bg-surface border border-border-default">
          {item.photo_url ? (
            <Image src={item.photo_url} alt={item.name} width={40} height={40} className="w-full h-full object-cover" unoptimized />
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
    {
      key: "is_alumni",
      label: "Status",
      render: (item: any) => (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
          item.is_alumni 
            ? "bg-yellow-500/10 text-yellow-500" 
            : "bg-green-500/10 text-green-500"
        }`}>
          {item.is_alumni ? `Alumni${item.batch_year ? ` '${item.batch_year}` : ''}` : "Active"}
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Info Card */}
      <div className="mb-6 p-4 rounded-xl border border-brand-navy-light/30 bg-brand-navy/10">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
          <div className="text-sm text-text-secondary space-y-1">
            <p className="font-semibold text-text-primary">Tips for managing team members</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Tier:</strong> Core Committee (President, VP, etc.) → Domain Lead → Member</li>
              <li><strong>Display Order:</strong> Lower numbers appear first. Use 1 for President, 2 for VP, etc.</li>
              <li><strong>Alumni:</strong> Toggle &quot;Is Alumni&quot; and select the batch year for passed-out members.</li>
              <li>Alumni appear under a separate tab on the Team page, grouped by batch year.</li>
              <li><strong>Social Links:</strong> Add platform name (github, linkedin, twitter) and URL.</li>
              <li>The club was established in <strong>2022</strong>. Batch years go from 2022 onwards.</li>
            </ul>
          </div>
        </div>
      </div>

      <AdminCrudPage
        title="Team Members"
        endpoint="/team"
        fields={fields}
        columns={columns}
      />
    </div>
  );
}
