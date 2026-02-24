import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const publicPaths = ["/", "/login", "/signup"];
const publicPrefixes = [
  "/features",
  "/pricing",
  "/use-cases",
  "/enterprise",
  "/developers",
  "/help",
  "/blog",
  "/contact",
  "/legal",
  "/api/auth",
  "/api/chat",
  "/api/ai",
  "/_next",
  "/logo",
  "/favicon",
];

function isPublic(pathname: string): boolean {
  if (publicPaths.includes(pathname)) return true;
  return publicPrefixes.some((p) => pathname.startsWith(p));
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) {
    // Redirect logged-in users away from login/signup to dashboard
    if (req.auth && (pathname === "/login" || pathname === "/signup")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!req.auth) {
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
