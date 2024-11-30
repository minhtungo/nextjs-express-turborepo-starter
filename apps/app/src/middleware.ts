import { authRoutes, protectedRoutes } from '@/config';
import { validateSessionToken } from '@/lib/auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { session as sessionConfig } from '@repo/config/auth';

const redirectToSignIn = (req: NextRequest) => {
  return NextResponse.redirect(new URL(authRoutes.signIn, req.url));
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtectedRoute = protectedRoutes.includes(pathname);

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get(sessionConfig.name);

  if (!sessionCookie) {
    return redirectToSignIn(req);
  }

  let res = NextResponse.next();

  try {
    const session = await validateSessionToken(sessionCookie.value);

    if (!session) {
      throw new Error('Invalid session');
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    res.cookies.delete(sessionConfig.name);
    return redirectToSignIn(req);
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
