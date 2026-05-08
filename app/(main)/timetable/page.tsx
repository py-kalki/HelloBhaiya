import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { adminApp } from "@/lib/firebase/admin"
import type { TimetableTask } from "@/actions/saveTimetable"
import { DailyView } from "@/components/timetable/DailyView"
import { WeeklyBar } from "@/components/timetable/WeeklyBar"
import { TemplateList } from "@/components/timetable/TemplateList"
import { CustomBuilder } from "@/components/timetable/CustomBuilder"
import Link from "next/link"

async function getUser() {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) redirect("/login")
  try {
    return await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  } catch {
    redirect("/login")
  }
}

interface PageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function TimetablePage({ searchParams }: PageProps) {
  const { tab = "my" } = await searchParams
  const decoded = await getUser()
  const db = getFirestore(adminApp)

  const timetableDoc = await db
    .collection("users")
    .doc(decoded.uid)
    .collection("timetable")
    .doc("current")
    .get()

  const tasks: TimetableTask[] = timetableDoc.exists
    ? (timetableDoc.data()?.tasks ?? [])
    : []

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Timetable</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Plan your study schedule and track daily progress
          </p>
        </div>

        <div className="flex gap-2 border-b border-border">
          {[
            { id: "my",        label: "My Timetable" },
            { id: "templates", label: "Templates" },
            { id: "build",     label: "Custom Build" },
          ].map(({ id, label }) => (
            <Link
              key={id}
              href={`/timetable?tab=${id}`}
              className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                tab === id
                  ? "border-accent text-text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {tab === "my" && (
          <div className="space-y-6">
            {tasks.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="text-text-secondary text-sm">No timetable yet</p>
                <Link
                  href="/timetable?tab=templates"
                  className="inline-block text-xs text-accent hover:text-text-primary transition-colors"
                >
                  Apply a template to get started →
                </Link>
              </div>
            ) : (
              <>
                <WeeklyBar tasks={tasks} />
                <DailyView tasks={tasks} />
              </>
            )}
          </div>
        )}

        {tab === "templates" && <TemplateList />}

        {tab === "build" && <CustomBuilder />}
      </div>
    </div>
  )
}
