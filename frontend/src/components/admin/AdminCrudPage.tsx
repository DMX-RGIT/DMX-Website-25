"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getToken(): string {
  return localStorage.getItem("dmx_admin_token") || "";
}

async function adminFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ detail: "Request failed" }));
    let msg = data.detail;
    if (Array.isArray(msg)) {
      msg = msg.map((m: any) => `${m.loc?.[m.loc.length-1] || 'Field'}: ${m.msg}`).join(", ");
    }
    throw new Error(msg || `Error ${res.status}`);
  }
  return res.json();
}

interface Field {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "url" | "datetime" | "number" | "boolean" | "tags" | "json";
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface AdminCrudPageProps {
  title: string;
  endpoint: string; // e.g., "/events"
  listEndpoint?: string; // e.g., "/admin/join" if different from endpoint
  fields: Field[];
  columns: { key: string; label: string; render?: (item: any) => React.ReactNode }[];
}

export function AdminCrudPage({ title, endpoint, listEndpoint, fields, columns }: AdminCrudPageProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch(listEndpoint || endpoint);
      setItems(data);
    } catch (err: any) {
      let msg = err.message;
      try {
        if (msg.includes("[object Object]")) {
          // Fallback if stringified incorrectly earlier, though adminFetch should handle it
        }
      } catch {}
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [endpoint, listEndpoint]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    setEditing(null);
    const defaults: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === "boolean") defaults[f.name] = false;
      else if (f.type === "number") defaults[f.name] = 0;
      else if (f.type === "tags") defaults[f.name] = [];
      else if (f.type === "json") defaults[f.name] = [];
      else defaults[f.name] = "";
    });
    setFormData(defaults);
    setShowForm(true);
    setError("");
  };

  const openEdit = (item: any) => {
    setEditing(item);
    const data: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === "tags" || f.type === "json") {
        data[f.name] = item[f.name] || [];
      } else if (f.type === "datetime") {
        data[f.name] = item[f.name] ? new Date(item[f.name]).toISOString().slice(0, 16) : "";
      } else {
        data[f.name] = item[f.name] ?? "";
      }
    });
    setFormData(data);
    setShowForm(true);
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = { ...formData };

      // Convert tags from string to array if needed
      fields.forEach((f) => {
        if (f.type === "tags" && typeof payload[f.name] === "string") {
          payload[f.name] = payload[f.name].split(",").map((s: string) => s.trim()).filter(Boolean);
        }
        if (f.type === "json" && typeof payload[f.name] === "string") {
          try { payload[f.name] = JSON.parse(payload[f.name]); } catch { /* keep as-is */ }
        }
        if (f.type === "datetime" && payload[f.name]) {
          payload[f.name] = new Date(payload[f.name]).toISOString();
        }
      });

      if (editing) {
        await adminFetch(`/admin${endpoint}/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch(`/admin${endpoint}`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setShowForm(false);
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await adminFetch(`/admin${endpoint}/${id}`, { method: "DELETE" });
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleImageUpload = async (field: string, file: File) => {
    const token = getToken();
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API_BASE}/auth/upload?folder=dmx`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    if (!res.ok) throw new Error("Upload failed");
    const { url } = await res.json();
    setFormData((prev) => ({ ...prev, [field]: url }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">{title}</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-bg-primary transition-all hover:opacity-90"
          style={{ background: "var(--gradient-teal)" }}
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {error && !showForm && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-bg-surface animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="border border-border-default rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-bg-surface border-b border-border-default">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">{col.label}</th>
                ))}
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border-subtle hover:bg-bg-surface/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-text-primary">
                      {col.render ? col.render(item) : String(item[col.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-md text-text-secondary hover:text-brand-teal hover:bg-brand-teal/10 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-md text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="text-center py-12 text-text-secondary text-sm">No items yet. Click &ldquo;Add New&rdquo; to create one.</div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-bg-secondary border border-border-default rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">{editing ? "Edit" : "Create"} {title.replace(/s$/, "")}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary">{field.label}</label>

                  {field.type === "textarea" ? (
                    <textarea
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      rows={3}
                      required={field.required}
                      className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal transition-colors text-text-primary text-sm resize-none"
                      placeholder={field.placeholder}
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      required={field.required}
                      className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal transition-colors text-text-primary text-sm appearance-none"
                    >
                      <option value="">Select...</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : field.type === "boolean" ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!formData[field.name]}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                        className="w-4 h-4 accent-brand-teal"
                      />
                      <span className="text-sm text-text-primary">Enabled</span>
                    </label>
                  ) : field.type === "url" ? (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={formData[field.name] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal transition-colors text-text-primary text-sm"
                        placeholder={field.placeholder || "https://..."}
                      />
                      { (field.name.includes("image") || field.name.includes("photo")) && (
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-border-default rounded-lg cursor-pointer hover:border-brand-teal transition-colors text-text-secondary text-xs">
                            <Upload className="w-4 h-4" />
                            Or upload an image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(field.name, file);
                              }}
                            />
                          </label>
                          {formData[field.name] && (
                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-border-default bg-bg-surface">
                              <img src={formData[field.name]} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : field.type === "tags" ? (
                    <input
                      type="text"
                      value={Array.isArray(formData[field.name]) ? formData[field.name].join(", ") : formData[field.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal transition-colors text-text-primary text-sm"
                      placeholder="Comma separated values"
                    />
                  ) : field.type === "json" ? (
                    <textarea
                      value={typeof formData[field.name] === "string" ? formData[field.name] : JSON.stringify(formData[field.name], null, 2)}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal transition-colors text-text-primary text-sm font-mono resize-none"
                      placeholder='[{"name": "...", "github": "..."}]'
                    />
                  ) : (
                    <input
                      type={field.type === "datetime" ? "datetime-local" : field.type}
                      value={formData[field.name] ?? ""}
                      onChange={(e) => setFormData({ ...formData, [field.name]: field.type === "number" ? Number(e.target.value) : e.target.value })}
                      required={field.required}
                      className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal transition-colors text-text-primary text-sm"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-text-secondary border border-border-default hover:text-text-primary hover:border-brand-navy-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-bg-primary transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--gradient-teal)" }}
              >
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
