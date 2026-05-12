import { cookies } from "next/headers"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase/admin"
import { ExamCountdown } from "@/components/dashboard/ExamCountdown"
import { MicroGoalCard } from "@/components/dashboard/MicroGoalCard"
import { WeaknessRadar } from "@/components/dashboard/WeaknessRadar"
import { ProgressSummaryCards } from "@/components/dashboard/ProgressSummaryCards"
import { TonightsRevisionBanner } from "@/components/dashboard/TonightsRevisionBanner"
import { LevelXPBar } from "@/components/dashboard/LevelXPBar"
import { DangerZoneCard } from "@/components/dashboard/DangerZoneCard"
import { QuickTestLaunch } from "@/components/dashboard/QuickTestLaunch"
import { QuickNavGrid } from "@/components/dashboard/QuickNavGrid"
import { StreakBadges } from "@/components/dashboard/StreakBadges"
import { PomodoroWidget } from "@/components/dashboard/PomodoroWidget"
import { DailyTasks } from "@/components/dashboard/DailyTasks"
import { SubjectProgress } from "@/components/dashboard/SubjectProgress"
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed"
import { ResumeLearningCard } from "@/components/dashboard/ResumeLearningCard"
import { DashboardGuide } from "@/components/dashboard/DashboardGuide"
import { getActivityLog } from "@/actions/getActivityLog"
import type { UserProfile } from "@/types/student"
import { serializeProfile } from "@/lib/serializeProfile"
import { predictNEETScore } from "@/lib/predictedScore"

export default async function DashboardPage() {
  const sessionCookie = (await cookies()).get("session")!.value
  const { uid } = await getAuth(adminApp).verifySessionCookie(sessionCookie, false)

  const userDoc = await getFirestore(adminApp).collection("users").doc(uid).get()
  const profile = serializeProfile(userDoc.data() as UserProfile)
  
  const activities = await getActivityLog(5)

  const firstName = profile.name?.split(" ")[0] ?? "there"
  const [low, high] = predictNEETScore(profile.subject_accuracy)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 space-y-6">
      
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <p className="text-text-muted text-sm tracking-wide">{greeting} 👋</p>
            <DashboardGuide />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary tracking-tight leading-none">
            {firstName}
            <span className="text-accent">.</span>
          </h1>
          <p className="text-text-secondary text-sm mt-2 hidden md:block">
            Here&apos;s where you left off — let&apos;s keep pushing.
          </p>
        </div>
        <div className="w-full md:w-auto md:min-w-[340px]">
          <LevelXPBar profile={profile} />
        </div>
      </div>

      {/* ── Progress Summary Cards — full width ── */}
      <ProgressSummaryCards profile={profile} predictedScore={[low, high]} />

      {/* ── streak + resume learning side by side ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <ResumeLearningCard lastFocusModule={profile.last_focus_module} />
        <StreakBadges currentStreak={profile.streak_current} maxStreak={profile.streak_max} />
      </div>

      {/* ── Row 1: Core three cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ExamCountdown targetDateMs={profile.target_date} exam={profile.exam} />
        <WeaknessRadar profile={profile} />
        <MicroGoalCard />
      </div>

      {/* ── Row 2: Tracking ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SubjectProgress profile={profile} />
        <PomodoroWidget />
        <DailyTasks />
      </div>

      {/* ── Row 3: Test tools ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickTestLaunch />
        <DangerZoneCard chapterHealth={profile.chapter_health} exam={profile.exam} />
      </div>

      {/* ── Navigation grid ── */}
      <QuickNavGrid exam={profile.exam} />

      {/* ── Activity feed + revision banner ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
        <RecentActivityFeed activities={activities} />
        <div className="lg:w-80">
          <TonightsRevisionBanner />
        </div>
      </div>
    </div>
  )
}
