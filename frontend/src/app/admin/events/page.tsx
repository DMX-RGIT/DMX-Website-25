"use client";

import { AdminCrudPage } from "@/components/admin/AdminCrudPage";

export default function AdminEventsPage() {
  const fields = [
    { name: "title", label: "Title", type: "text" as const, required: true },
    { name: "description", label: "Description", type: "textarea" as const, required: true },
    {
      name: "category",
      label: "Category",
      type: "select" as const,
      required: true,
      options: [
        { label: "Hackathon", value: "hackathon" },
        { label: "Workshop", value: "workshop" },
        { label: "Speaker Session", value: "speaker_session" },
      ],
    },
    { name: "date", label: "Date", type: "datetime" as const, required: true },
    { name: "end_date", label: "End Date", type: "datetime" as const },
    { name: "venue", label: "Venue", type: "text" as const, required: true },
    { name: "registration_url", label: "Registration URL", type: "url" as const },
    { name: "image_url", label: "Image URL", type: "url" as const },
    { name: "is_flagship", label: "Is Flagship?", type: "boolean" as const },
    { name: "is_upcoming", label: "Is Upcoming?", type: "boolean" as const },
  ];

  const columns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    {
      key: "date",
      label: "Date",
      render: (item: any) => new Date(item.date).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (item: any) => (
        <span className={item.is_upcoming ? "text-brand-teal" : "text-text-secondary"}>
          {item.is_upcoming ? "Upcoming" : "Past"}
        </span>
      ),
    },
  ];

  return (
    <AdminCrudPage
      title="Events"
      endpoint="/events"
      fields={fields}
      columns={columns}
    />
  );
}
