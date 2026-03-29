import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { updateSupabaseSession } from '@/utils/supabase/middleware';

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isAdmin(email?: string | null) {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/events',
  '/gallery',
  '/login',
  '/projects',
  '/team',
];

export async function middleware(req: NextRequest) {
  const supabaseResponse = await updateSupabaseSession(req);

  const { pathname } = req.nextUrl;
  
  // Always allow Next.js internals, API auth callbacks, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  ) {
    return supabaseResponse;
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`) && route !== '/'
  );

  const isAdminApi = pathname.startsWith('/api/admin');
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const email = (token?.email as string | undefined) || null;
  const tokenIsAdmin = Boolean(token?.isAdmin);

  // Default-Deny logic: If it's NOT a public route, demand admin rights.
  if (!isPublicRoute) {
    if (!token || (!tokenIsAdmin && !isAdmin(email))) {
      // If unauthorized on an API route, obscure it by rewriting/redirecting to the 404 Not Found page
      if (isAdminApi || pathname.startsWith('/api/')) {
        return NextResponse.rewrite(new URL('/404', req.url));
      }

      // If unauthorized on a page navigation, redirect to login
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If public route OR successfully authenticated admin, proceed.
  return supabaseResponse;
}

export const config = {
  // Capture ALL paths so the default-deny logic accurately intercepts undocumented routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
