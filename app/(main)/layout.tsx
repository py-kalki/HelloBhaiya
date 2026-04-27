import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase/admin"
import { PostHogProvider } from "@/components/layout/PostHogProvider"
import { TopBar } from "@/components/layout/TopBar"
import { BottomNav } from "@/components/layout/BottomNav"

export default async function MainLayout({
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

  const userDoc = await getFirestore(adminApp).collection("users").doc(uid).get()
  if (!userDoc.exists || userDoc.data()?.onboarding_complete !== true) {
    redirect("/onboarding")
  }

  return (
    <PostHogProvider>
      <div className="min-h-dvh flex flex-col bg-background">
        <TopBar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <BottomNav />
      </div>
    </PostHogProvider>
  )
}
