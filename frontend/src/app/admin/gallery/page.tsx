"use client";

import { AdminCrudPage } from "@/components/admin/AdminCrudPage";

export default function AdminGalleryPage() {
  const fields = [
    { name: "image_url", label: "Image URL", type: "url" as const, required: true },
    { name: "caption", label: "Caption", type: "text" as const },
    {
      name: "category",
      label: "Category",
      type: "select" as const,
      required: true,
      options: [
        { label: "Hackathon", value: "hackathon" },
        { label: "Workshop", value: "workshop" },
        { label: "Social", value: "social" },
      ],
    },
  ];

  const columns = [
    {
      key: "image",
      label: "Preview",
      render: (item: any) => (
        <div className="w-16 h-12 rounded bg-bg-surface border border-border-default overflow-hidden">
          <img src={item.image_url} alt={item.caption} className="w-full h-full object-cover" />
        </div>
      ),
    },
    { key: "caption", label: "Caption" },
    { key: "category", label: "Category" },
  ];

  return (
    <AdminCrudPage
      title="Gallery Images"
      endpoint="/gallery"
      fields={fields}
      columns={columns}
    />
  );
}
