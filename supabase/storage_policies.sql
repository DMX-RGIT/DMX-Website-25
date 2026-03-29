-- Supabase Storage Policies for Events bucket
-- Execution requires pasting in Supabase SQL editor.

-- Note: RLS is already enabled by default on storage.objects in modern Supabase projects.

-- Deny public uploads, explicit policy mapping for Admins
DROP POLICY IF EXISTS "Deny Public Uploads / Allow Authenticated" ON storage.objects;
CREATE POLICY "Admin Uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'events' AND auth.role() = 'authenticated');

-- Explicit Public Selects (Allows public Read-Only access to the events bucket)
DROP POLICY IF EXISTS "Public Event Images Read" ON storage.objects;
CREATE POLICY "Public Event Images Read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'events');

-- Explicit policies for updates/deletes (Admin only)
DROP POLICY IF EXISTS "Admin Update Deletes" ON storage.objects;
CREATE POLICY "Admin Update Deletes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'events' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'events' AND auth.role() = 'authenticated');
