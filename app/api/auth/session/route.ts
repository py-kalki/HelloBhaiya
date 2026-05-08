import { NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { adminApp } from "@/lib/firebase/admin"

export async function POST(request: Request) {
  try {
    const { idToken, rememberMe } = (await request.json()) as { idToken: string; rememberMe?: boolean }

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 })
    }

    // Firebase max is 14 days
    const expiresIn = 60 * 60 * 24 * 14 * 1000
    const sessionCookie = await getAuth(adminApp).createSessionCookie(idToken, {
      expiresIn,
    })

    const response = NextResponse.json({ status: "ok" })
    
    // If rememberMe is true, persist for 14 days. Otherwise, session-only (expires on browser close).
    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    }
    
    if (rememberMe) {
      cookieOptions.maxAge = expiresIn / 1000
    }

    response.cookies.set("session", sessionCookie, cookieOptions)

    return response
  } catch {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }
}
