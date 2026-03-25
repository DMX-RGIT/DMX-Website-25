// Legacy compatibility module.
// The project has migrated from Firebase to Supabase.
// Import from '@/lib/supabase' directly in new code.

export { createSupabaseServerClient as db, createSupabaseAdminClient as auth } from '@/lib/supabase';
