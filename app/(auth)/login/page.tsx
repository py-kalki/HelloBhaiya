"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase/client"
import { Button } from "@/components/ui/button"

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const redirect = searchParams.get("redirect")
    if (redirect) sessionStorage.setItem("auth_redirect", redirect)
  }, [searchParams])

  async function handleGoogleSignIn() {
    setLoading(true)
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })
      if (!res.ok) throw new Error("Session creation failed")

      const userDoc = await getDoc(doc(db, "users", result.user.uid))
      const redirectTo = sessionStorage.getItem("auth_redirect") ?? "/dashboard"
      sessionStorage.removeItem("auth_redirect")

      if (userDoc.exists() && userDoc.data().onboarding_complete === true) {
        router.push(redirectTo)
      } else {
        router.push("/onboarding")
      }
    } catch {
      setError("Sign-in failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-8">
      {/* Logo + wordmark */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-3xl select-none">
          📚
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            HelloBhaiya
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Study harder. Level up.
          </p>
        </div>
      </div>

      {/* Sign-in card */}
      <div className="w-full bg-surface border border-border rounded-xl p-6 flex flex-col gap-4">
        <p className="text-center text-text-secondary text-sm">
          Sign in to track your progress, earn XP, and crush your exam.
        </p>

        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          variant="outline"
          className="w-full h-12 gap-3 text-text-primary border-border hover:bg-surface-2"
        >
          <GoogleIcon />
          {loading ? "Signing in…" : "Continue with Google"}
        </Button>

        {error && (
          <p className="text-center text-danger text-xs">{error}</p>
        )}
      </div>

      <p className="text-center text-text-secondary text-xs px-4">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}
