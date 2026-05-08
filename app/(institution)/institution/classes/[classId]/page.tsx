import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase/admin"
import { ArrowLeft, Trophy, Zap, Target } from "lucide-react"
import Link from "next/link"
import type { StudentSummary } from "@/types/institution"

type Props = { params: Promise<{ classId: string }> }

async function getClassData(uid: string, classId: string) {
  const db = getFirestore(adminApp)

  // Verify institution admin
  const instSnap = await db
    .collection("institutions")
    .where("admin_uid", "==", uid)
    .limit(1)
    .get()

  if (instSnap.empty) return null

  const instId = instSnap.docs[0]!.id
  const classSnap = await db
    .collection("institutions")
    .doc(instId)
    .collection("classes")
    .doc(classId)
    .get()

  if (!classSnap.exists) return null

  const classData = classSnap.data()!
  const studentUids: string[] = classData.student_uids ?? []

  if (studentUids.length === 0) {
    return {
      className: classData.name as string,
      joinCode:  classData.join_code as string,
      students:  [] as StudentSummary[],
    }
  }

  // Fetch student profiles (limit 50)
  const sampleUids = studentUids.slice(0, 50)
  const studentSnaps = await Promise.all(
    sampleUids.map((id) => db.collection("users").doc(id).get())
  )

  const students: StudentSummary[] = studentSnaps
    .filter((s) => s.exists)
    .map((s) => {
      const d = s.data()!
      return {
        uid:              s.id,
        name:             d.name ?? "Unknown",
        photo_url:        d.photo_url ?? "",
        level:            d.level ?? 1,
        xp_total:         d.xp_total ?? 0,
        xp_this_week:     d.xp_this_week ?? 0,
        streak_current:   d.streak_current ?? 0,
        subject_accuracy: d.subject_accuracy ?? {},
      }
    })
    .sort((a, b) => b.xp_this_week - a.xp_this_week)

  return {
    className: classData.name as string,
    joinCode:  classData.join_code as string,
    students,
  }
}

export default async function ClassDetailPage({ params }: Props) {
  const { classId } = await params
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) redirect("/login")

  let uid: string
  try {
    const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, false)
    uid = decoded.uid
  } catch {
    redirect("/login")
  }

  const data = await getClassData(uid, classId)
  if (!data) notFound()

  const subjects = data.students.length > 0
    ? Object.keys(data.students[0]?.subject_accuracy ?? {})
    : []

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/institution/dashboard"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors rounded-lg"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">{data.className}</h1>
          <p className="text-xs text-text-secondary font-mono">
            Join code: <span className="text-accent tracking-widest">{data.joinCode}</span>
          </p>
        </div>
      </div>

      {data.students.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <p className="text-sm">No students in this class yet.</p>
          <p className="text-xs mt-1">Share the join code: <strong className="text-accent font-mono">{data.joinCode}</strong></p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-xs text-text-secondary font-medium">#</th>
                <th className="text-left px-4 py-3 text-xs text-text-secondary font-medium">Student</th>
                <th className="text-center px-4 py-3 text-xs text-text-secondary font-medium">
                  <Zap size={12} className="inline mr-1 text-warning" />XP/week
                </th>
                <th className="text-center px-4 py-3 text-xs text-text-secondary font-medium">
                  <Trophy size={12} className="inline mr-1 text-accent" />Level
                </th>
                {subjects.map((s) => (
                  <th key={s} className="text-center px-4 py-3 text-xs text-text-secondary font-medium">
                    <Target size={12} className="inline mr-1" />{s.slice(0, 4)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.students.map((student, i) => {
                return (
                  <tr key={student.uid} className="border-b border-border hover:bg-surface transition-colors">
                    <td className="px-4 py-3 text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {student.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={student.photo_url}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-xs text-text-secondary font-bold">
                            {student.name[0]?.toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-text-primary font-medium text-xs">{student.name}</p>
                          <p className="text-text-secondary text-[10px]">{student.streak_current}🔥 streak</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-warning font-bold text-xs">{student.xp_this_week}</td>
                    <td className="px-4 py-3 text-center text-xs text-text-primary">{student.level}</td>
                    {subjects.map((s) => {
                      const acc = student.subject_accuracy[s]
                      const color = acc === undefined ? "text-text-secondary" : acc >= 75 ? "text-success" : acc >= 50 ? "text-warning" : "text-danger"
                      return (
                        <td key={s} className={`px-4 py-3 text-center text-xs font-bold ${color}`}>
                          {acc !== undefined ? `${acc}%` : "—"}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
