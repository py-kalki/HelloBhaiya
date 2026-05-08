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
      <div className="min-h-dvh flex flex-col bg-background relative overflow-hidden font-sans">
        {/* ══ Futuristic Glowing Arc Background ══ */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] max-w-[1200px] h-[600px] pointer-events-none z-0">
          {/* Outer diffuse glow */}
          <div className="absolute inset-0 rounded-[100%] bg-[radial-gradient(ellipse_at_top,rgba(212,255,89,0.12),transparent_70%)] blur-[80px] -translate-y-1/2" />
          
          {/* Sharp inner arc */}
          <div className="absolute inset-0 rounded-[100%] border-t border-accent/20 bg-gradient-to-b from-accent/[0.03] to-transparent blur-sm -translate-y-[45%]" />
          
          {/* Core highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 shadow-[0_0_40px_rgba(212,255,89,0.8)]" />
        </div>

        {/* ══ Main Content ══ */}
        <div className="relative z-10 flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 pb-16 md:pb-0 relative">
            {/* Optional subtle glass container wrapper for the whole dashboard could go here, 
                but we'll let individual pages handle their max-widths */}
            {children}
          </main>
        </div>
        
        {/* Bottom Nav on mobile */}
        <div className="relative z-20">
          <BottomNav />
        </div>
      </div>
    </PostHogProvider>
  )
}
