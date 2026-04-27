import { NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"

export async function POST() {
  const sessionCookie = (await cookies()).get("session")?.value

  if (sessionCookie) {
    try {
      const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie)
      await getAuth(adminApp).revokeRefreshTokens(decoded.uid)
    } catch {
      // Cookie invalid — clear it anyway
    }
  }

  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"))
  response.cookies.set("session", "", { maxAge: 0, path: "/" })
  return response
}
