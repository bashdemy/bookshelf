import { auth } from './auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sql } from './lib/db';

async function checkUserOnboarding(userId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT username, display_name
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    ` as Array<{
      username: string | null;
      display_name: string;
    }>;

    if (!result[0]) return false;
    return !!(result[0].username && result[0].display_name);
  } catch {
    return false;
  }
}

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  if (pathname.startsWith('/add') && !isAuthenticated) {
    const signInUrl = new URL('/api/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthenticated && req.auth?.user?.id && pathname !== '/onboarding' && !pathname.startsWith('/api')) {
    const isOnboarded = await checkUserOnboarding(req.auth.user.id);
    if (!isOnboarded) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};

