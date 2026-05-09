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
import { ActivityHeatmap } from "@/components/profile/ActivityHeatmap"
import { InventoryWidget } from "@/components/profile/InventoryWidget"
import { getActivityLog } from "@/actions/getActivityLog"

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

  const activities = await getActivityLog(500)

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-4xl mx-auto w-full pb-20">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-text-primary font-medium text-4xl tracking-tight">Profile</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/analytics"
            className="w-12 h-12 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors rounded-full"
          >
            <BarChart2 size={22} />
          </Link>
          <Link
            href="/settings"
            className="w-12 h-12 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors rounded-full"
          >
            <Settings size={22} />
          </Link>
        </div>
      </div>

      <IdentityCard profile={profile} />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col gap-6">
          <StatsGrid profile={profile} testsCompleted={testsCompleted} />
          <BadgeGrid streakMax={profile.streak_max ?? 0} />
        </div>
        <div>
          <XPStats profile={profile} />
        </div>
      </div>
      
      {/* Activity Tracker Section & Backpack */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 w-full">
        <ActivityHeatmap activities={activities} />
        <InventoryWidget currentLevel={profile.level ?? 1} />
      </div>
    </div>
  )
}
