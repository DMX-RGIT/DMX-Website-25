"use client";

import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminEventsPage() {
  const [isEventsAdmin, setIsEventsAdmin] = useState(false);

  useEffect(() => {
    setIsEventsAdmin(localStorage.getItem("dmx_admin_role") === "events");
  }, []);
  const fields = [
    { name: "title", label: "Title", type: "text" as const, required: true },
    { name: "description", label: "Description (supports Markdown)", type: "textarea" as const, required: true },
    {
      name: "category",
      label: "Category",
      type: "text" as const,
      required: true,
      placeholder: "e.g., Hackathon, Workshop, etc."
    },
    { name: "date", label: "Date", type: "datetime" as const, required: true },
    { name: "end_date", label: "End Date", type: "datetime" as const },
    { name: "venue", label: "Venue", type: "text" as const, required: true },
    { name: "registration_url", label: "Registration URL", type: "url" as const },
    { name: "image_url", label: "Banner Image (landscape)", type: "url" as const },
    { name: "poster_url", label: "Poster Image (portrait)", type: "url" as const },
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
    <div>
      {/* Info Card */}
      <div className="mb-6 p-4 rounded-xl border border-brand-navy-light/30 bg-brand-navy/10">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
          <div className="text-sm text-text-secondary space-y-1">
            <p className="font-semibold text-text-primary">Tips for great event pages</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Banner Image:</strong> Use a landscape (16:9) image — it spans the full width at the top of the event page.</li>
              <li><strong>Poster Image:</strong> Use a portrait image — it appears alongside the banner. Great for event flyers.</li>
              <li>If only one image is provided, it will expand to fill the entire space automatically.</li>
              <li><strong>Description</strong> supports full Markdown — use headings, lists, code blocks, and bold text.</li>
              <li>Mark an event as <strong>Flagship</strong> to feature it on the homepage with a countdown timer.</li>
            </ul>
          </div>
        </div>
      </div>

      <AdminCrudPage
        title="Events"
        endpoint="/events"
        fields={fields}
        columns={columns}
        disableDelete={isEventsAdmin}
      />
    </div>
  );
}
