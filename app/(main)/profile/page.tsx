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
import { Settings, BarChart2, ChevronRight } from "lucide-react"
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
    <div className="flex flex-col gap-8 p-5 md:p-10 max-w-5xl mx-auto w-full pb-24">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary font-bold text-4xl tracking-tight leading-none">
            Profile<span className="text-accent">.</span>
          </h1>
          <p className="text-text-muted text-sm mt-1.5">Your learning identity & progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/analytics"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-white/6 text-text-secondary hover:text-text-primary hover:border-white/12 transition-all text-sm font-medium"
          >
            <BarChart2 size={16} />
            <span className="hidden sm:inline">Analytics</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-white/6 text-text-secondary hover:text-text-primary hover:border-white/12 transition-all text-sm font-medium"
          >
            <Settings size={16} />
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </div>
      </div>

      {/* ── Identity card (full width hero) ── */}
      <IdentityCard profile={profile} />

      {/* ── Stats + XP side by side ── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-6">
          <StatsGrid profile={profile} testsCompleted={testsCompleted} />
          <BadgeGrid streakMax={profile.streak_max ?? 0} />
        </div>
        <XPStats profile={profile} />
      </div>

      {/* ── Activity + Backpack ── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
        <ActivityHeatmap activities={activities} />
        <InventoryWidget currentLevel={profile.level ?? 1} />
      </div>
    </div>
  )
}
