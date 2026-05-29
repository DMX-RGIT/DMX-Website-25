import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase';

export interface TeamMember {
  id?: string;
  name: string;
  position: string;
  image?: string;
  linkedin?: string;
  github?: string;
  year?: string;
}

export async function ensureTeamDirectory(): Promise<void> {
  // Deprecated: kept for backwards compatibility if needed, but not used since we moved to DB
  return Promise.resolve();
}

export async function getAllTeamData() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('year', { ascending: false })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching team members:', error);
    return {};
  }

  const grouped: Record<string, TeamMember[]> = {};
  data.forEach((row) => {
    if (!grouped[row.year]) {
      grouped[row.year] = [];
    }
    grouped[row.year].push({
      id: row.id,
      name: row.name,
      position: row.position,
      image: row.image,
      linkedin: row.linkedin,
      github: row.github,
    });
  });

  return grouped;
}

export async function saveTeamData(year: string, teamData: TeamMember[]) {
  const supabase = await createSupabaseAdminClient();
  
  // First, delete all existing for this year
  const { error: deleteError } = await supabase
    .from('team_members')
    .delete()
    .eq('year', year);

  if (deleteError) {
    throw deleteError;
  }

  if (teamData.length > 0) {
    const insertData = teamData.map((member, index) => ({
      year,
      name: member.name,
      position: member.position,
      image: member.image || null,
      linkedin: member.linkedin || null,
      github: member.github || null,
      sort_order: index,
    }));

    const { error: insertError } = await supabase
      .from('team_members')
      .insert(insertData);

    if (insertError) {
      throw insertError;
    }
  }
}

export async function deleteTeamData(year: string) {
  const supabase = await createSupabaseAdminClient();
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('year', year);

  if (error) {
    throw error;
  }
}
