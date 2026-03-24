"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";

// The underlying JSON mapping schema
type TeamMember = {
  name: string;
  position: string;
  image?: string;
  linkedin?: string;
  github?: string;
};

export default function TeamAdmin() {
  const [yearsData, setYearsData] = useState<Record<string, TeamMember[]>>({});
  const [activeYear, setActiveYear] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editor mode state
  const [editingMember, setEditingMember] = useState<{ index: number, data: TeamMember } | null>(null);

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/team");
    if (res.ok) {
      const data = await res.json();
      setYearsData(data);
      if (!activeYear && Object.keys(data).length > 0) {
        // Sort keys descending to get most recent
        const years = Object.keys(data).sort((a, b) => Number(b) - Number(a));
        setActiveYear(years[0]);
      }
    }
    setLoading(false);
  }, [activeYear]);

  useEffect(() => { fetchTeam(); }, [fetchTeam]);

  const handleSaveYear = async () => {
    if (!activeYear || !yearsData[activeYear]) return;
    setSaving(true);
    const res = await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year: activeYear, teamData: yearsData[activeYear] }),
    });
    setSaving(false);
    if (res.ok) alert(`Saved changes to ${activeYear} cohort!`);
    else alert("Failed to save changes.");
  };

  const addYear = () => {
    const year = prompt("Enter new cohort year (e.g. 2026):");
    if (!year) return;
    if (yearsData[year]) return alert("Year already exists!");
    setYearsData({ ...yearsData, [year]: [] });
    setActiveYear(year);
  };

  const deleteYear = async () => {
    if (!confirm(`Are you sure you want to permanently delete the entire ${activeYear} cohort file?`)) return;
    const res = await fetch(`/api/admin/team?year=${activeYear}`, { method: "DELETE" });
    if (res.ok) {
      const newData = { ...yearsData };
      delete newData[activeYear];
      setYearsData(newData);
      setActiveYear(Object.keys(newData)[0] || "");
    }
  };

  const saveMemberForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeYear || !editingMember) return;
    
    const currList = [...(yearsData[activeYear] || [])];
    if (editingMember.index === -1) {
      currList.push(editingMember.data);
    } else {
      currList[editingMember.index] = editingMember.data;
    }
    setYearsData({ ...yearsData, [activeYear]: currList });
    setEditingMember(null);
  };

  const deleteMember = (index: number) => {
    if (!activeYear || !confirm("Remove member?")) return;
    const currList = [...yearsData[activeYear]];
    currList.splice(index, 1);
    setYearsData({ ...yearsData, [activeYear]: currList });
  };

  if (loading) return <div className="text-gray-400">Loading team rosters...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">Manage Team</h1>
        <button onClick={addYear} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm">
          <Plus size={16} /> Add Cohort Year
        </button>
      </div>

      {Object.keys(yearsData).length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Year Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {Object.keys(yearsData).sort((a, b) => Number(b) - Number(a)).map(year => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
                  activeYear === year ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-[#111] hover:bg-white/5 text-gray-400 border border-transparent'
                }`}
              >
                {year} Committee ({yearsData[year].length})
              </button>
            ))}
          </div>

          {/* Roster View */}
          <div className="lg:col-span-3">
            {!editingMember ? (
              <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                  <h2 className="text-xl font-bold">{activeYear} Cohort Roster</h2>
                  <div className="flex gap-3">
                    <button onClick={deleteYear} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2 mr-4">
                      <Trash2 size={16} /> Delete Year
                    </button>
                    <button onClick={handleSaveYear} disabled={saving} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                      <Save size={16} /> Save to {activeYear}.json
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(yearsData[activeYear] || []).map((member, index) => (
                    <div key={index} className="bg-[#222] p-4 rounded-lg flex justify-between items-center border border-white/5 hover:border-white/10 transition-colors">
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-orange-400 text-sm">{member.position}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingMember({ index, data: member })} className="text-gray-400 hover:text-white p-2">Edit</button>
                        <button onClick={() => deleteMember(index)} className="text-gray-400 hover:text-red-400 p-2"><X size={18} /></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setEditingMember({ index: -1, data: { name: "", position: "" } })} className="bg-transparent border border-dashed border-white/20 p-4 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-white/40 transition-colors h-full min-h-[80px]">
                    <Plus size={20} className="mb-2" />
                    <span className="text-sm">Add Member</span>
                  </button>
                </div>
              </div>
            ) : (
              // Inline Editor Modal
              <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">{editingMember.index === -1 ? 'Add Member' : 'Edit Member'}</h2>
                  <button onClick={() => setEditingMember(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                
                <form onSubmit={saveMemberForm} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                      <input required type="text" value={editingMember.data.name} onChange={e => setEditingMember({...editingMember, data: {...editingMember.data, name: e.target.value}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Position / Role</label>
                      <input required type="text" value={editingMember.data.position} onChange={e => setEditingMember({...editingMember, data: {...editingMember.data, position: e.target.value}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none" placeholder="e.g. Secretary" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Profile Image Path</label>
                      <input type="text" value={editingMember.data.image || ''} onChange={e => setEditingMember({...editingMember, data: {...editingMember.data, image: e.target.value}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none" placeholder="/images/team/..." />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">LinkedIn URL</label>
                      <input type="text" value={editingMember.data.linkedin || ''} onChange={e => setEditingMember({...editingMember, data: {...editingMember.data, linkedin: e.target.value}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Github URL</label>
                      <input type="text" value={editingMember.data.github || ''} onChange={e => setEditingMember({...editingMember, data: {...editingMember.data, github: e.target.value}})} className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                    <button type="button" onClick={() => setEditingMember(null)} className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium transition-colors">Save Details</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-12 border border-dashed border-white/20 rounded-xl text-gray-500">
          No team data found. Create a cohort year to get started!
        </div>
      )}
    </div>
  );
}
