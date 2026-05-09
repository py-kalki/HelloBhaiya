"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth"
import { auth } from "@/lib/firebase/client"
import { SignInPage, Testimonial } from "@/components/ui/sign-in"

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    name: "Priya Sharma",
    handle: "NEET ASPIRANT",
    text: "HelloBhaiya completely changed my revision strategy. The weakness radar is scarily accurate."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    name: "Rahul Verma",
    handle: "JEE ADVANCED",
    text: "The custom paper builder saves me hours of searching. Leveling up makes studying actually fun."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    name: "Ananya Gupta",
    handle: "AIIMS DELHI 2024",
    text: "I used this for my last 90 days. The spaced repetition algorithm is the best I've ever seen."
  },
];

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset' | 'verify'>('signin')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const redirect = searchParams.get("redirect")
    if (redirect) sessionStorage.setItem("auth_redirect", redirect)
  }, [searchParams])

  const createSessionAndRedirect = async (idToken: string, forceOnboarding = false, rememberMe = false) => {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, rememberMe }),
    })
    if (!res.ok) throw new Error("Session creation failed")

    let redirectTo = sessionStorage.getItem("auth_redirect") ?? "/dashboard"
    if (forceOnboarding) redirectTo = "/onboarding"

    sessionStorage.removeItem("auth_redirect")
    router.push(redirectTo)
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const rememberMe = formData.get("rememberMe") === "on"

    try {
      if (mode === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await sendEmailVerification(result.user)
        setMode('verify')
      } else if (mode === 'verify') {
        // Force refresh the user object from Firebase
        await auth.currentUser?.reload()
        const user = auth.currentUser
        
        if (user && user.emailVerified) {
          const idToken = await user.getIdToken()
          await createSessionAndRedirect(idToken, true) // force to onboarding
        } else {
          throw new Error("Email not verified yet. Please click the link in your inbox.")
        }
      } else if (mode === 'signin') {
        const result = await signInWithEmailAndPassword(auth, email, password)
        const idToken = await result.user.getIdToken()
        await createSessionAndRedirect(idToken, false, rememberMe)
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email)
        alert("Password reset email sent! Please check your inbox.")
        setMode('signin')
      }
    } catch (err: any) {
      let errorMessage = err.message || "An error occurred. Please try again."
      if (err.code === 'auth/email-already-in-use') errorMessage = "This email is already registered. Please sign in."
      else if (err.code === 'auth/invalid-credential') errorMessage = "Invalid email or password."
      else if (err.code === 'auth/user-not-found') errorMessage = "No account found with this email."
      else if (err.code === 'auth/weak-password') errorMessage = "Password should be at least 6 characters."
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: "select_account" })
      const result = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()
      await createSessionAndRedirect(idToken)
    } catch (err: any) {
      // Log the real error so we can see exactly what Firebase is rejecting
      console.error("[Google Sign-In Error]", err?.code, err?.message)

      const code = err?.code ?? ""
      let msg = "Google sign-in failed. Please try again."

      if (code === "auth/popup-blocked")
        msg = "Popup was blocked by your browser. Please allow popups for this site and try again."
      else if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request")
        msg = "Sign-in was cancelled. Please try again."
      else if (code === "auth/network-request-failed")
        msg = "Network error. Check your internet connection and try again."
      else if (code === "auth/unauthorized-domain")
        msg = "This domain is not authorised in Firebase. Add localhost to Firebase → Authentication → Settings → Authorized Domains."
      else if (code === "auth/internal-error" || code === "auth/operation-not-allowed")
        msg = "Google sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in methods."
      else if (err?.message)
        msg = err.message

      setError(msg)
      setLoading(false)
    }
  }

  const handleSwitchMode = (newMode: 'signin' | 'signup' | 'reset' | 'verify') => {
    setMode(newMode)
    setError(null)
  }

  // Dynamic titles based on mode
  const titles = {
    signin: <span className="font-bold text-white tracking-tighter">Welcome back</span>,
    signup: <span className="font-bold text-white tracking-tighter">Join the Elite</span>,
    reset: <span className="font-bold text-white tracking-tighter">Reset Password</span>,
    verify: <span className="font-bold text-white tracking-tighter">Verify Email</span>,
  }

  const descriptions = {
    signin: "Access your dashboard and continue your journey to the top rank.",
    signup: "Create an account to unlock custom tests and weakness radar.",
    reset: "Enter your email and we'll send you a link to reset your password.",
    verify: "A secure verification link has been sent to your inbox.",
  }

  return (
    <SignInPage
      title={titles[mode]}
      description={descriptions[mode]}
      heroImageSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
      testimonials={sampleTestimonials}
      onSignIn={handleFormSubmit}
      onGoogleSignIn={handleGoogleSignIn}
      onSwitchMode={handleSwitchMode}
      mode={mode}
      isLoading={loading}
      error={error}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
