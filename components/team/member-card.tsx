"use client";

type Member = {
  name: string;
  position: string;
  quote?: string;
};

export function MemberCard({ member }: { member: Member }) {
  return (
    <div className="group relative bg-white/90 backdrop-blur-lg rounded-xl overflow-hidden border-2 border-purple-200 hover:border-orange-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-100 hover:-translate-y-2">
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
          {member.name}
        </h3>
        <p className="text-purple-600 text-sm mb-2 font-semibold uppercase tracking-wide">
          {member.position}
        </p>
        {member.quote && (
          <p className="text-gray-600 text-sm italic">
            &quot;{member.quote}&quot;
          </p>
        )}
      </div>
    </div>
  );
}
