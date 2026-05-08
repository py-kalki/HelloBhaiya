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
import { serializeProfile } from "@/lib/serializeProfile"

export default async function DashboardPage() {
  const sessionCookie = (await cookies()).get("session")!.value
  const { uid } = await getAuth(adminApp).verifySessionCookie(sessionCookie, false)

  const userDoc = await getFirestore(adminApp).collection("users").doc(uid).get()
  const profile = serializeProfile(userDoc.data() as UserProfile)

  const firstName = profile.name?.split(" ")[0] ?? "there"
  const lastName = profile.name?.split(" ").slice(1).join(" ") ?? ""

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      <div className="relative flex flex-col gap-8 bg-surface/30 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-6 md:p-10 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
        {/* ── Top row: Greeting + Stats ── */}
      <div className="flex flex-col xl:flex-row gap-8 items-end">
        <div className="flex-1 pb-2 w-full xl:w-auto">
          <p className="text-text-secondary text-sm md:text-base mb-2">Welcome back,</p>
          <h1 className="text-4xl md:text-[56px] leading-[1.1] font-medium text-text-primary tracking-tight">
            {firstName} <br className="hidden xl:block" /> {lastName}
          </h1>
        </div>
        <div className="w-full xl:w-[70%]">
          <ProgressSummaryCards profile={profile} />
        </div>
      </div>

      {/* ── Filter / Tabs mock (from the image) ── */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scroll-x hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        <button className="px-6 py-2.5 rounded-full bg-accent text-black font-semibold text-sm shrink-0 transition-transform active:scale-95">
          All
        </button>
        <button className="px-6 py-2.5 rounded-full bg-surface text-text-secondary hover:text-white font-medium text-sm shrink-0 transition-colors active:scale-95">
          Engagement
        </button>
        <button className="px-6 py-2.5 rounded-full bg-surface text-text-secondary hover:text-white font-medium text-sm shrink-0 transition-colors active:scale-95">
          Visit
        </button>
        <button className="px-6 py-2.5 rounded-full bg-surface text-text-secondary hover:text-white font-medium text-sm shrink-0 transition-colors active:scale-95">
          Post
        </button>
      </div>

      {/* ── Middle row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6">
          <ExamCountdown targetDateMs={profile.target_date} exam={profile.exam} />
        </div>
        <div className="flex flex-col gap-6">
           <WeaknessRadar profile={profile} />
        </div>
        <div className="flex flex-col gap-6">
          <MicroGoalCard />
        </div>
      </div>

      {/* ── Revision banner ── */}
      <div className="mt-4">
        <TonightsRevisionBanner />
      </div>
      </div>
    </div>
  )
}
