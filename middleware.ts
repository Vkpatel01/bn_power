import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that require authentication
const protectedRoutes = ["/admin/dashboard"]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the route requires authentication
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Get the auth token from the request cookie (for future server-side auth)
    // For now, we're using sessionStorage on client-side, so we allow the request
    // In a real app, you'd verify a JWT or session token here
    // Example: if (!request.cookies.get("adminToken")) {
    //   return NextResponse.redirect(new URL("/admin/login", request.url))
    // }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
