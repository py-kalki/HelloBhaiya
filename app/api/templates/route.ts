import { NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get("session")?.value
    if (!sessionCookie) {
      return NextResponse.json([], { status: 401 })
    }
    const { uid } = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)

    const db = getFirestore(adminApp)
    const snap = await db
      .collection("users")
      .doc(uid)
      .collection("templates")
      .orderBy("last_used_at", "desc")
      .limit(10)
      .get()

    const templates = snap.docs.map((d) => d.data())
    return NextResponse.json(templates)
  } catch {
    return NextResponse.json([])
  }
}
