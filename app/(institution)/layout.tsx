import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase/admin"
import Link from "next/link"
import { GraduationCap, LayoutDashboard, LogOut } from "lucide-react"

export default async function InstitutionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) redirect("/login")

  let uid: string
  try {
    const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, false)
    uid = decoded.uid
  } catch {
    redirect("/login")
  }

  // Verify user is an institution admin
  const instSnap = await getFirestore(adminApp)
    .collection("institutions")
    .where("admin_uid", "==", uid)
    .limit(1)
    .get()

  if (instSnap.empty) redirect("/dashboard")

  const institution = instSnap.docs[0]!.data()

  return (
    <div className="min-h-dvh bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-col bg-surface border-r border-border p-4 gap-2">
        <div className="flex items-center gap-2 px-2 py-3 mb-2">
          <GraduationCap size={20} className="text-accent" />
          <div>
            <p className="text-xs font-bold text-text-primary truncate">{institution.name as string}</p>
            <p className="text-[10px] text-text-secondary">{institution.plan as string} Plan</p>
          </div>
        </div>

        <Link
          href="/institution/dashboard"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
        >
          <LayoutDashboard size={16} />
          Dashboard
        </Link>

        <div className="mt-auto">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
