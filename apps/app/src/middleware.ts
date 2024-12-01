import { authRoutes, protectedRoutes, afterLoginUrl } from '@/config';
import { deleteSessionTokenCookie, validateSessionToken } from '@/lib/auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { session as sessionConfig } from '@repo/config/auth';

const redirectToSignIn = (req: NextRequest) => {
  return NextResponse.redirect(new URL(authRoutes.signIn, req.url));
};

const redirectToDashboard = (req: NextRequest) => {
  return NextResponse.redirect(new URL(afterLoginUrl, req.url));
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log('middleware', pathname);

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isAuthRoute = Object.values(authRoutes).includes(pathname);

  const sessionCookie = req.cookies.get(sessionConfig.name);

  // If user is logged in and trying to access auth routes, redirect to dashboard
  if (isAuthRoute && sessionCookie) {
    try {
      const session = await validateSessionToken(sessionCookie.value);
      if (session) {
        return redirectToDashboard(req);
      }
    } catch (error) {
      // If session validation fails, continue with normal flow
      console.error('Error verifying session:', error);
    }
  }

  // If not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Handle protected routes
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
    await deleteSessionTokenCookie();
    return redirectToSignIn(req);
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
