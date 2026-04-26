import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value

  if (!session) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Protect all routes inside (main) layout
  matcher: [
    "/dashboard/:path*",
    "/test/:path*",
    "/roadmap/:path*",
    "/notes/:path*",
    "/timetable/:path*",
    "/revision/:path*",
    "/leaderboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/doubt/:path*",
    "/battle/:path*",
  ],
}
