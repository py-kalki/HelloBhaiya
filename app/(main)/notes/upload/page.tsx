import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { adminApp } from "@/lib/firebase/admin"
import { UploadForm } from "@/components/notes/UploadForm"

async function getUser() {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) redirect("/login")
  try {
    return await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  } catch {
    redirect("/login")
  }
}

export default async function UploadNotePage() {
  const decoded = await getUser()
  const db = getFirestore(adminApp)

  const userDoc  = await db.collection("users").doc(decoded.uid).get()
  const userData = userDoc.data()
  const level: number     = userData?.level ?? 1
  const creatorName: string  = userData?.name ?? ""
  const creatorHandle: string = userData?.email?.split("@")[0] ?? ""

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/notes" className="p-2 rounded-lg hover:bg-surface-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={18} className="text-text-secondary" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Upload Note</h1>
            <p className="text-sm text-text-secondary mt-0.5">Share your notes with the community</p>
          </div>
        </div>

        <UploadForm
          userLevel={level}
          creatorName={creatorName}
          creatorHandle={creatorHandle}
        />
      </div>
    </div>
  )
}
