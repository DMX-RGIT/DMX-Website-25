import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';

export async function requireAdminResponse() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
