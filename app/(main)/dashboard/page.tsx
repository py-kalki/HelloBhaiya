import { cookies } from "next/headers"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase/admin"
import { ExamCountdown } from "@/components/dashboard/ExamCountdown"
import { MicroGoalCard } from "@/components/dashboard/MicroGoalCard"
import { WeaknessRadar } from "@/components/dashboard/WeaknessRadar"
import { ProgressSummaryCards } from "@/components/dashboard/ProgressSummaryCards"
import { TonightsRevisionBanner } from "@/components/dashboard/TonightsRevisionBanner"
import type { UserProfile } from "@/types/student"

export default async function DashboardPage() {
  const sessionCookie = (await cookies()).get("session")!.value
  const { uid } = await getAuth(adminApp).verifySessionCookie(sessionCookie, false)

  const userDoc = await getFirestore(adminApp).collection("users").doc(uid).get()
  const profile = userDoc.data() as UserProfile

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
      <ExamCountdown profile={profile} />
      <MicroGoalCard />
      <WeaknessRadar profile={profile} />
      <ProgressSummaryCards profile={profile} />
      <TonightsRevisionBanner />
    </div>
  )
}
