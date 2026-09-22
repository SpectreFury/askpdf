import { NextRequest, NextResponse } from "next/server";
import { urls } from "./utils/env";

export async function proxy(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const response = await fetch(urls.REFRESH, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader,
    },
  });

  if (!response.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|$|login$|signup$).*)",
  ],
};
