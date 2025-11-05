import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: Request & { nextUrl: any; headers: any }) {
  const host = (req.headers.get("host") || "").toLowerCase();
  const url = req.nextUrl;

  // If visiting sosyal.<domain> root, rewrite to /feed (public)
  if (host.startsWith("sosyal.")) {
    if (url.pathname === "/" || url.pathname === "") {
      const rewriteUrl = new URL("/feed", url);
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  // Protect /admin with NextAuth token (require isAdmin)
  if (url.pathname.startsWith("/admin")) {
    const token: any = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.isAdmin !== true) {
      const signInUrl = new URL("/auth/login", url);
      signInUrl.searchParams.set("callbackUrl", url.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
