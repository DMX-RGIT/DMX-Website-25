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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label htmlFor="team-year" className="text-sm text-gray-300">Select year</label>
        <select
          id="team-year"
          className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year} className="text-black">
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


