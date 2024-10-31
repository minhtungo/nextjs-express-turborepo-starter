import { authRoutes } from '@/config';
import { getAccessToken, getSession } from '@/features/auth/actions/session';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const session = await getSession();
  const accessToken = await getAccessToken();

  if (!session || !accessToken) {
    return NextResponse.redirect(new URL(authRoutes.signIn, req.nextUrl));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
};
