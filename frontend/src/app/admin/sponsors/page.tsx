"use client";

import Image from "next/image";
import { AdminCrudPage } from "@/components/admin/AdminCrudPage";

export default function AdminSponsorsPage() {
  const fields = [
    { name: "name", label: "Sponsor Name", type: "text" as const, required: true },
    {
      name: "tier",
      label: "Tier",
      type: "select" as const,
      required: true,
      options: [
        { label: "Title Sponsor", value: "title" },
        { label: "Gold", value: "gold" },
        { label: "Silver", value: "silver" },
        { label: "Community", value: "community" },
      ],
    },
    { name: "logo_url", label: "Logo URL", type: "url" as const, required: true },
    { name: "website_url", label: "Website URL", type: "url" as const },
    { name: "display_order", label: "Display Order (lower is first)", type: "number" as const },
    {
      name: "is_active",
      label: "Active (show in global marquee on Home page)",
      type: "boolean" as const,
    },
  ];

  const columns = [
    {
      key: "logo",
      label: "Logo",
      render: (item: any) => (
        <div className="h-10 px-2 py-1 rounded bg-white flex items-center justify-center w-fit border border-border-default">
          {item.logo_url ? (
            <Image src={item.logo_url} alt={item.name} width={80} height={40} className="h-full object-contain" unoptimized />
          ) : (
            <div className="h-full w-20 bg-bg-surface rounded" />
          )}
        </div>
      ),
    },
    { key: "name", label: "Name" },
    { key: "tier", label: "Tier" },
    {
      key: "is_active",
      label: "Global",
      render: (item: any) => (
        <span className={item.is_active ? "text-brand-teal text-xs font-semibold" : "text-text-muted text-xs"}>
          {item.is_active ? "Active" : "Hidden"}
        </span>
      ),
    },
  ];

  return (
    <AdminCrudPage
      title="Sponsors"
      endpoint="/sponsors"
      fields={fields}
      columns={columns}
    />
  );
}
