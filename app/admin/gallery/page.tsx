"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Image as ImageIcon, X } from "lucide-react";

type GalleryCategory = {
  id: string;
  label: string;
  images: string[];
};

export default function GalleryAdmin() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/gallery");
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categories),
    });
    setSaving(false);
    if (res.ok) {
      alert("Gallery saved successfully!");
    } else {
      alert("Failed to save gallery");
    }
  };

  const addCategory = () => {
    const id = prompt("Enter category ID (e.g. hack2infinity):");
    if (!id) return;
    const label = prompt("Enter Display Label (e.g. Hack2Infinity 2025):");
    if (!label) return;
    setCategories([...categories, { id, label, images: [] }]);
  };

  const removeCategory = (index: number) => {
    if (!confirm("Remove this category entirely?")) return;
    const newCats = [...categories];
    newCats.splice(index, 1);
    setCategories(newCats);
  };

  const addImage = (catIndex: number) => {
    const url = prompt("Enter image path (e.g. /images/event-files/...jpg)");
    if (!url) return;
    const newCats = [...categories];
    newCats[catIndex].images.push(url);
    setCategories(newCats);
  };

  const removeImage = (catIndex: number, imgIndex: number) => {
    const newCats = [...categories];
    newCats[catIndex].images.splice(imgIndex, 1);
    setCategories(newCats);
  };

  if (loading) return <div className="text-gray-400">Loading gallery data...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Manage Gallery</h1>
        <div className="flex gap-3">
          <button onClick={addCategory} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
            <Plus size={18} /> New Category
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors">
            <Save size={18} /> {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((cat, catIdx) => (
          <div key={cat.id} className="bg-[#111] border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold">{cat.label}</h2>
                <p className="text-sm text-gray-400 font-mono mt-1">ID: {cat.id}</p>
              </div>
              <button onClick={() => removeCategory(catIdx)} className="text-red-400 hover:text-red-300 flex items-center gap-2 text-sm bg-red-400/10 px-3 py-1.5 rounded-md">
                <Trash2 size={16} /> Delete Category
              </button>
            </div>

            <div className="space-y-3">
              {cat.images.map((img, imgIdx) => (
                <div key={imgIdx} className="flex items-center gap-4 bg-[#222] p-3 border border-white/5 rounded-lg group">
                  <div className="h-10 w-10 bg-black rounded flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                    <ImageIcon size={16} className="text-gray-500 absolute" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="preview" className="object-cover w-full h-full relative z-10" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => {
                      const newCats = [...categories];
                      newCats[catIdx].images[imgIdx] = e.target.value;
                      setCategories(newCats);
                    }}
                    className="flex-1 bg-transparent border-none text-sm text-gray-300 focus:outline-none focus:text-white"
                  />
                  <button onClick={() => removeImage(catIdx, imgIdx)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                    <X size={18} />
                  </button>
                </div>
              ))}
              <button onClick={() => addImage(catIdx)} className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white hover:border-white/40 transition-colors text-sm">
                <Plus size={16} /> Add Image to {cat.label}
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center p-12 border border-dashed border-white/20 rounded-xl text-gray-500">
            No gallery categories configured yet.
          </div>
        )}
      </div>
    </div>
  );
}
