import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase/admin"

const WINDOW_MS = 60_000

export async function checkRateLimit(
  uid: string,
  actionKey: string,
  maxPerMinute: number
): Promise<{ allowed: boolean; remaining: number }> {
  const db = getFirestore(adminApp)
  const windowStart = Math.floor(Date.now() / WINDOW_MS)
  const docId = `${uid}:${actionKey}:${windowStart}`
  const ref = db.collection("_rate_limits").doc(docId)

  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    const count: number = snap.exists ? (snap.data()?.count ?? 0) : 0
    if (count >= maxPerMinute) return count
    tx.set(ref, { count: FieldValue.increment(1), expires: Date.now() + WINDOW_MS * 2 }, { merge: true })
    return count + 1
  })

  const allowed = result <= maxPerMinute
  return { allowed, remaining: Math.max(0, maxPerMinute - result) }
}
