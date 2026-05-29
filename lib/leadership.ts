import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase';

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadershipInput {
  name: string;
  role: string;
  imageUrl: string;
  sortOrder?: number;
  isActive?: boolean;
}

function mapRow(row: LeadershipMember) {
  return {
    id: row.id,
    name: row.name,
    title: row.role,
    image: row.image_url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPublicLeadershipMembers() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('leadership_team')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch leadership members: ${error.message}`);
  }

  return (data as LeadershipMember[]).map(mapRow);
}

export async function getAdminLeadershipMembers() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('leadership_team')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch leadership members: ${error.message}`);
  }

  return (data as LeadershipMember[]).map(mapRow);
}

export async function createLeadershipMember(input: LeadershipInput) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('leadership_team')
    .insert({
      name: input.name,
      role: input.role,
      image_url: input.imageUrl,
      sort_order: input.sortOrder ?? 0,
      is_active: input.isActive ?? true,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to create leadership member: ${error.message}`);
  }

  return mapRow(data as LeadershipMember);
}

export async function updateLeadershipMember(
  id: string,
  input: Partial<LeadershipInput>,
) {
  const updates: {
    name?: string;
    role?: string;
    image_url?: string;
    sort_order?: number;
    is_active?: boolean;
    updated_at: string;
  } = {
    updated_at: new Date().toISOString(),
  };

  if (typeof input.name === 'string') updates.name = input.name;
  if (typeof input.role === 'string') updates.role = input.role;
  if (typeof input.imageUrl === 'string') updates.image_url = input.imageUrl;
  if (typeof input.sortOrder === 'number') updates.sort_order = input.sortOrder;
  if (typeof input.isActive === 'boolean') updates.is_active = input.isActive;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('leadership_team')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update leadership member: ${error.message}`);
  }

  return mapRow(data as LeadershipMember);
}

export async function deleteLeadershipMember(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('leadership_team').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete leadership member: ${error.message}`);
  }
}
