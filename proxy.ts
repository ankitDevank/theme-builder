import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { PATH } from "./lib/path";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const isPublicPath =
    pathname === PATH.LOGIN || pathname.startsWith("/api/auth");

  if (!token && !isPublicPath) {
    const loginUrl = new URL(PATH.LOGIN, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && pathname === PATH.LOGIN) {
    return NextResponse.redirect(new URL(PATH.ROOT, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
