"use client";

import { AdminCrudPage } from "@/components/admin/AdminCrudPage";

export default function JoinAdminPage() {
  return (
    <AdminCrudPage
      title="Join Applications"
      endpoint="/join"
      listEndpoint="/admin/join"
      fields={[
        { name: "first_name", label: "First Name", type: "text", required: true },
        { name: "last_name", label: "Last Name", type: "text", required: true },
        { name: "email", label: "Email", type: "text", required: true },
        { name: "role_interest", label: "Role Interest", type: "text", required: true },
        { name: "github_url", label: "GitHub URL", type: "url" },
        { name: "reason", label: "Reason", type: "textarea", required: true },
        { 
          name: "status", 
          label: "Status", 
          type: "select", 
          required: true,
          options: [
            { label: "Pending", value: "pending" },
            { label: "Reviewed", value: "reviewed" },
            { label: "Accepted", value: "accepted" },
            { label: "Rejected", value: "rejected" }
          ]
        },
      ]}
      columns={[
        { key: "first_name", label: "First Name" },
        { key: "last_name", label: "Last Name" },
        { key: "role_interest", label: "Role" },
        { 
          key: "status", 
          label: "Status",
          render: (item) => (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              item.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
              item.status === "reviewed" ? "bg-blue-500/10 text-blue-500" :
              item.status === "accepted" ? "bg-green-500/10 text-green-500" :
              "bg-red-500/10 text-red-500"
            }`}>
              {item.status.toUpperCase()}
            </span>
          )
        },
      ]}
    />
  );
}
