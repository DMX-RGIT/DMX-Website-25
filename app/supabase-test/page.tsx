import { createClient } from '@/utils/supabase/server';

export default async function SupabaseTestPage() {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from('events')
    .select('id, title')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      {error ? (
        <p className="text-red-600">Error: {error.message}</p>
      ) : (
        <ul className="list-disc pl-6 space-y-2">
          {events?.map((event) => (
            <li key={event.id}>{event.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
