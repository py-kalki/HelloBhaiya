import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value

  if (!session) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
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
