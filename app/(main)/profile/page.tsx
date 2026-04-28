import { cookies } from "next/headers"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase/admin"
import { redirect } from "next/navigation"
import { IdentityCard } from "@/components/profile/IdentityCard"
import { XPStats } from "@/components/profile/XPStats"
import { StatsGrid } from "@/components/profile/StatsGrid"
import { BadgeGrid } from "@/components/gamification/BadgeGrid"
import type { UserProfile } from "@/types/student"
import { serializeProfile } from "@/lib/serializeProfile"
import Link from "next/link"
import { Settings, BarChart2 } from "lucide-react"

export default async function ProfilePage() {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) redirect("/login")

  const { uid } = await getAuth(adminApp).verifySessionCookie(sessionCookie, false)
  const db = getFirestore(adminApp)

  const userSnap = await db.collection("users").doc(uid).get()
  const profile = serializeProfile(userSnap.data() as UserProfile)

  const testsSnap = await db
    .collection("users")
    .doc(uid)
    .collection("tests")
    .where("status", "==", "COMPLETED")
    .count()
    .get()
  const testsCompleted = testsSnap.data().count

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto w-full pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-text-primary font-bold text-lg">Profile</h1>
        <div className="flex items-center gap-1">
          <Link
            href="/analytics"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors rounded-lg"
          >
            <BarChart2 size={18} />
          </Link>
          <Link
            href="/settings"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors rounded-lg"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>

      <IdentityCard profile={profile} />
      <XPStats profile={profile} />
      <StatsGrid profile={profile} testsCompleted={testsCompleted} />
      <BadgeGrid streakMax={profile.streak_max ?? 0} />
    </div>
  )
}
