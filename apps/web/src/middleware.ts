import { afterLoginUrl, authRoutes, protectedRoutes } from "@/config";
import { env } from "@/lib/env";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const redirectToSignIn = (req: NextRequest) => {
  return NextResponse.redirect(new URL(authRoutes.signIn, req.url));
};

const redirectToDashboard = (req: NextRequest) => {
  return NextResponse.redirect(new URL(afterLoginUrl, req.url));
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isAuthRoute = Object.values(authRoutes).includes(pathname);
  const sessionCookie = req.cookies.get(env.SESSION_COOKIE_NAME);

  if (isAuthRoute) {
    if (sessionCookie) {
      return redirectToDashboard(req);
    }
    return NextResponse.next();
  }

  if (!isProtectedRoute) {
    console.log("not protected or auth route");
    return NextResponse.next();
  }

  if (!sessionCookie) {
    return redirectToSignIn(req);
  }

  // const session = await verifySessionToken(sessionCookie.value);

  // if (!session) {
  //   await deleteSessionTokenCookie();
  //   return redirectToSignIn(req);
  // }

  // const requestHeaders = new Headers(req.headers);
  // requestHeaders.set('Cookie', `${sessionCookie.name}=${sessionCookie.value}`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
