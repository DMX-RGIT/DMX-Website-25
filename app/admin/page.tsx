"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Module Nav Cards */}
        {[
          { title: "Manage Events", desc: "Add or update hackathons & workshops.", link: "/admin/events" },
          { title: "Manage Projects", desc: "Update student project repositories.", link: "/admin/projects" },
          { title: "Manage Gallery", desc: "Add event image assets.", link: "/admin/gallery" },
          { title: "Manage Team", desc: "Update core committee members.", link: "/admin/team" },
        ].map((module, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-white text-lg font-semibold mb-2">
                {module.title}
              </h3>
              <p className="text-gray-400 text-sm mb-6">{module.desc}</p>
            </div>
            <Link href={module.link} className="flex items-center gap-2 text-purple-400 font-medium hover:text-purple-300 transition-colors w-fit">
              Go to Module <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      {/* Info Block */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-8 max-w-4xl">
        <h2 className="text-xl font-medium mb-4">Welcome to the DMX CMS</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          This dashboard interfaces directly with the static filesystem for this repository.
          Edits made to Markdown (MDX) and JSON configurations on these modules are instantly written and reflected locally.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          <strong>Remember:</strong> In production deployments without persistent local volumes (like Vercel standard hosting), these filesystem changes require a fresh deployment. The local CMS is primarily designed for developers to orchestrate localized content edits pre-commit.
        </p>
      </div>
    </div>
  );
}
