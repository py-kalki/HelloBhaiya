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

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8 space-y-6">
      
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-text-secondary text-sm md:text-base mb-1">Welcome back,</p>
          <h1 className="text-3xl md:text-5xl font-medium text-text-primary tracking-tight">
            {firstName}
          </h1>
        </div>
        <div className="w-full md:w-auto min-w-[300px]">
          <LevelXPBar profile={profile} />
        </div>
      </div>

      {/* ── Main Dashboard Container ── */}
      <div className="relative flex flex-col gap-6 bg-surface/30 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-6 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
        
        {/* ── Progress Cards ── */}
        <ProgressSummaryCards profile={profile} predictedScore={[low, high]} />

        {/* ── Streak Badges ── */}
        <StreakBadges currentStreak={profile.streak_current} maxStreak={profile.streak_max} />

        {/* ── Top Highlight ── */}
        <div className="w-full">
          <ResumeLearningCard lastFocusModule={profile.last_focus_module} />
        </div>

        {/* ── Row 1: Core Features ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ExamCountdown targetDateMs={profile.target_date} exam={profile.exam} />
          <WeaknessRadar profile={profile} />
          <MicroGoalCard />
        </div>

        {/* ── Row 2: Tracking & Management ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SubjectProgress profile={profile} />
          <PomodoroWidget />
          <DailyTasks />
        </div>

        {/* ── Row 3: Test Builder Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickTestLaunch />
          <DangerZoneCard chapterHealth={profile.chapter_health} exam={profile.exam} />
        </div>

        {/* ── Row 4: Platform Navigation ── */}
        <QuickNavGrid exam={profile.exam} />

        {/* ── Row 5: Recent Activity ── */}
        <RecentActivityFeed activities={activities} />

        {/* ── Revision Banner ── */}
        <TonightsRevisionBanner />
      </div>
    </div>
  )
}
