'use client';

import { useMemo, useState } from 'react';
import { MemberCard } from '@/components/team/member-card';

type Member = {
  name: string;
  position: string;
  quote?: string;
};

type Props = {
  yearToMembers: Record<number, Member[]>;
  defaultYear: number;
};

export function YearSelector({ yearToMembers, defaultYear }: Props) {
  const years = useMemo(
    () => Object.keys(yearToMembers).map(Number).sort((a, b) => b - a),
    [yearToMembers]
  );

  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);

  const members = yearToMembers[selectedYear] ?? [];

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 10 }}>
      <div className="flex items-center justify-between">
        <label htmlFor="team-year" className="text-sm text-purple-700 font-semibold">Select year</label>
        <select
          id="team-year"
          className="bg-white border-2 border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 font-medium shadow-sm hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={{ position: 'relative', zIndex: 20 }}
        >
          {years.map((year) => (
            <option key={year} value={year} className="text-purple-900">
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member) => (
          <MemberCard key={`${selectedYear}-${member.name}`} member={member} />
        ))}
      </div>
    </div>
  );
}


