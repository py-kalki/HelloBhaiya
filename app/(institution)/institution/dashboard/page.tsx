import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase/admin"
import Link from "next/link"
import { Users, Plus, BarChart2 } from "lucide-react"
import { CreateClassForm } from "@/components/institution/CreateClassForm"
import type { ClassStats } from "@/types/institution"

async function getInstitutionData(uid: string) {
  const db = getFirestore(adminApp)

  const instSnap = await db
    .collection("institutions")
    .where("admin_uid", "==", uid)
    .limit(1)
    .get()

  if (instSnap.empty) return null

  const instDoc = instSnap.docs[0]!
  const instId = instDoc.id

  const classesSnap = await db
    .collection("institutions")
    .doc(instId)
    .collection("classes")
    .orderBy("created_at", "desc")
    .limit(20)
    .get()

  const classStats: ClassStats[] = await Promise.all(
    classesSnap.docs.map(async (doc) => {
      const data = doc.data()
      const studentUids: string[] = data.student_uids ?? []

      if (studentUids.length === 0) {
        return {
          classId:       doc.id,
          className:     data.name as string,
          joinCode:      data.join_code as string,
          studentCount:  0,
          avgAccuracy:   null,
          avgXpThisWeek: null,
        }
      }

      // Fetch a sample of student profiles (limit 10 to avoid excessive reads)
      const sampleUids = studentUids.slice(0, 10)
      const studentSnaps = await Promise.all(
        sampleUids.map((uid) => db.collection("users").doc(uid).get())
      )

      const validStudents = studentSnaps.filter((s) => s.exists).map((s) => s.data()!)

      const avgAccuracy =
        validStudents.length > 0
          ? Math.round(
              validStudents.reduce((sum, s) => {
                const acc = Object.values(s.subject_accuracy ?? {}) as number[]
                return sum + (acc.length > 0 ? acc.reduce((a, b) => a + b, 0) / acc.length : 0)
              }, 0) / validStudents.length
            )
          : null

      const avgXpThisWeek =
        validStudents.length > 0
          ? Math.round(
              validStudents.reduce((sum, s) => sum + (s.xp_this_week ?? 0), 0) /
                validStudents.length
            )
          : null

      return {
        classId:       doc.id,
        className:     data.name as string,
        joinCode:      data.join_code as string,
        studentCount:  studentUids.length,
        avgAccuracy,
        avgXpThisWeek,
      }
    })
  )

  return {
    institutionId: instId,
    institutionName: instDoc.data().name as string,
    plan: instDoc.data().plan as string,
    classes: classStats,
  }
}

export default async function InstitutionDashboard() {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) redirect("/login")

  let uid: string
  try {
    const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, false)
    uid = decoded.uid
  } catch {
    redirect("/login")
  }

  const data = await getInstitutionData(uid)
  if (!data) redirect("/dashboard")

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">{data.institutionName}</h1>
          <p className="text-xs text-text-secondary">{data.plan} Plan · {data.classes.length} classes</p>
        </div>
        <CreateClassForm institutionId={data.institutionId} />
      </div>

      {/* Classes grid */}
      {data.classes.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <Users size={40} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm">No classes yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.classes.map((cls) => (
            <div key={cls.classId} className="bg-surface border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-bold text-text-primary">{cls.className}</h2>
                  <p className="text-xs text-text-secondary">{cls.studentCount} student{cls.studentCount !== 1 ? "s" : ""}</p>
                </div>
                <Link
                  href={`/institution/classes/${cls.classId}`}
                  className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl bg-surface-2 border border-border text-text-secondary hover:text-text-primary transition-colors"
                >
                  <BarChart2 size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-surface-2 rounded-xl p-3 text-center">
                  <p className="text-sm font-bold text-text-primary">
                    {cls.avgAccuracy !== null ? `${cls.avgAccuracy}%` : "—"}
                  </p>
                  <p className="text-[10px] text-text-secondary">Avg Accuracy</p>
                </div>
                <div className="bg-surface-2 rounded-xl p-3 text-center">
                  <p className="text-sm font-bold text-warning">
                    {cls.avgXpThisWeek !== null ? cls.avgXpThisWeek : "—"}
                  </p>
                  <p className="text-[10px] text-text-secondary">Avg XP/week</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-surface-2 rounded-xl px-3 py-2">
                <span className="text-xs text-text-secondary">Join code:</span>
                <span className="text-sm font-mono font-bold text-accent tracking-widest flex-1">{cls.joinCode}</span>
                <Plus size={14} className="text-text-secondary" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
