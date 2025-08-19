'use client';


type Member = {
  name: string;
  position: string;
  quote?: string;
};

export function MemberCard({ member }: { member: Member }) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 card-hover">
      <div className="p-4">
        <h3 className="text-lg font-bold text-white">{member.name}</h3>
        <p className="text-dmx-primary text-sm mb-2">{member.position}</p>
        {member.quote && (
          <p className="text-gray-300 text-sm">“{member.quote}”</p>
        )}
      </div>
    </div>
  );
}
