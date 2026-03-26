import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase';
import { requireAdminSession } from '@/lib/admin-auth';

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '');
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const slug = String(formData.get('slug') || 'event');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image uploads are allowed' }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Image must be 10MB or less' }, { status: 400 });
    }

    const bucket = process.env.SUPABASE_EVENTS_BUCKET || 'events';
    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
    const safeSlug = sanitizeFileName(slug) || 'event';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const storagePath = `${safeSlug}/${sanitizeFileName(uniqueName)}`;

    const supabase = createSupabaseAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);

    return NextResponse.json({
      url: publicUrlData.publicUrl,
      path: storagePath,
      bucket,
    });
  } catch (error) {
    console.error('Failed to upload event image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
