import { env } from '@/config/env';
import { paths } from '@/config/paths';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// const redirectToSignIn = (req: NextRequest) => {
//   return NextResponse.redirect(new URL(authRoutes.signIn, req.url));
// };

// const redirectToDashboard = (req: NextRequest) => {
//   return NextResponse.redirect(new URL(afterLoginUrl, req.url));
// };

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  //   const isProtectedRoute = protectedRoutes.includes(pathname);
  //   const isAuthRoute = Object.values(authRoutes).includes(pathname);
  const sessionCookie = req.cookies.get(env.SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    const signInUrl = new URL(paths.auth.signIn.getHref(pathname), req.url);
    return NextResponse.redirect(signInUrl);
  }

  //   if (isAuthRoute && sessionCookie) {
  //     const dashboardUrl = new URL(afterLoginUrl, req.url);
  //     return NextResponse.redirect(dashboardUrl);
  //   }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    // Add other protected routes
  ],
};
