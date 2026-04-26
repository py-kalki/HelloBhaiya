import { NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { adminApp } from "@/lib/firebase/admin"

export async function POST(request: Request) {
  try {
    const { idToken } = (await request.json()) as { idToken: string }

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 })
    }

    // 5-day session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000
    const sessionCookie = await getAuth(adminApp).createSessionCookie(idToken, {
      expiresIn,
    })

    const response = NextResponse.json({ status: "ok" })
    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresIn / 1000,
      path: "/",
    })

    return response
  } catch {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }
}
