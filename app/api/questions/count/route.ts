import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import type { TestMode } from "@/types/question"

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = (await cookies()).get("session")?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
    }
    await getAuth(adminApp).verifySessionCookie(sessionCookie, true)

    const body = (await request.json()) as {
      subjects: string[]
      chapters: string[]
      mode: TestMode
      pyq_year_range?: [number, number]
    }

    const db = getFirestore(adminApp)
    let q = db.collection("questions") as FirebaseFirestore.Query

    if (body.chapters.length > 0) {
      q = q.where("chapter_id", "in", body.chapters.slice(0, 10))
    } else if (body.subjects.length > 0) {
      q = q.where("subject", "in", body.subjects)
    }

    if (body.mode === "PYQ") {
      q = q.where("is_pyq", "==", true)
      if (body.pyq_year_range) {
        q = q
          .where("pyq_year", ">=", body.pyq_year_range[0])
          .where("pyq_year", "<=", body.pyq_year_range[1])
      }
    }

    const snap = await q.count().get()
    return NextResponse.json({ count: snap.data().count })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}
