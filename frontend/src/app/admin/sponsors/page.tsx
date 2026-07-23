"use client";

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
  ];

  const columns = [
    {
      key: "logo",
      label: "Logo",
      render: (item: any) => (
        <div className="h-10 px-2 py-1 rounded bg-white flex items-center justify-center w-fit border border-border-default">
          <img src={item.logo_url} alt={item.name} className="h-full object-contain" />
        </div>
      ),
    },
    { key: "name", label: "Name" },
    { key: "tier", label: "Tier" },
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
