import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { adminApp } from "@/lib/firebase/admin"
import { toISTDateString } from "@/lib/dateUtils"
import { QuestionInput } from "@/components/doubt/QuestionInput"

const FREE_QUOTA = 10

async function getUser() {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) redirect("/login")
  try {
    return await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  } catch {
    redirect("/login")
  }
}

export default async function DoubtPage() {
  const decoded = await getUser()
  const db = getFirestore(adminApp)

  const today    = toISTDateString()
  const usageDoc = await db
    .collection("users")
    .doc(decoded.uid)
    .collection("doubt_usage")
    .doc(today)
    .get()

  const usedToday: number = usageDoc.exists ? (usageDoc.data()?.count ?? 0) : 0

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-text-primary">AI Doubt Solver</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Get step-by-step solutions powered by Claude AI
          </p>
        </div>

        <QuestionInput initialUsed={usedToday} quota={FREE_QUOTA} />
      </div>
    </div>
  )
}
