"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createUserProfile } from "@/actions/createUserProfile"
import type { Exam } from "@/types/student"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import Image from "next/image"

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP)
}

type Step = 1 | 2 | 3 | "done"

const STEP_LABELS = ["Profile", "Goal", "Weak Areas"]

const CLASSES = ["Class 11", "Class 12", "Dropper"]
const EXAMS: Exam[] = ["NEET", "JEE Main", "JEE Advanced", "BITSAT"]
const SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology", "Botany", "Zoology"]

export default function OnboardingPage() {
  const router = useRouter()
  const container = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState<Step>(1)
  
  // Form State
  const [name, setName] = useState("")
  const [studentClass, setStudentClass] = useState("")
  const [exam, setExam] = useState<Exam | null>(null)
  const [targetYear, setTargetYear] = useState("2025")
  const [weakSubjects, setWeakSubjects] = useState<string[]>([])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useGSAP(() => {
    // Entrance animations for the container
    gsap.fromTo(".anim-card", 
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.2)" }
    )
    
    gsap.fromTo(".login-glow", {
      yPercent: 10,
      xPercent: -5,
      repeat: -1,
      yoyo: true,
      duration: 6,
      ease: "sine.inOut",
    }, {
      yPercent: -10,
      xPercent: 5,
      repeat: -1,
      yoyo: true,
      duration: 6,
      ease: "sine.inOut",
    })
  }, { scope: container })

  // Animate content on step change
  useGSAP(() => {
    if (step !== "done") {
      gsap.fromTo(".step-content > *",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: "power2.out", clearProps: "all" }
      )
    }
  }, { dependencies: [step], scope: container })

  function toggleSubject(subject: string) {
    setWeakSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject],
    )
  }

  async function handleFinish() {
    if (!exam || !name || !studentClass) return
    setLoading(true)
    setError(null)
    try {
      // Create an ISO target date based on selected year (defaulting to May 1st typical exam season)
      const targetDate = `${targetYear}-05-01`
      await createUserProfile({ name, studentClass, exam, targetDate, weakSubjects })
      setStep("done")
      
      // Artificial delay for success animation
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch {
      setError("Something went wrong saving your profile. Please try again.")
      setLoading(false)
    }
  }

  const handleNextStep1 = () => {
    if (!name.trim()) return setError("Please enter your name.")
    if (!studentClass) return setError("Please select your class.")
    setError(null)
    setStep(2)
  }

  const handleNextStep2 = () => {
    if (!exam) return setError("Please select a targeted exam.")
    setError(null)
    setStep(3)
  }

  const stepNumber = step === "done" ? 4 : step

  return (
    <div ref={container} className="min-h-dvh bg-background text-text-primary font-sans selection:bg-accent selection:text-black relative flex flex-col items-center justify-center overflow-hidden py-12 px-4 sm:px-6">
      {/* Ambient glows */}
      <div className="login-glow absolute top-[15%] left-[15%] w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="login-glow absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-violet/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 anim-card">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/hellobhaiya-logo.svg" alt="HelloBhaiya" width={200} height={48} className="h-8 sm:h-10 w-auto" />
        </div>

        {/* Card */}
        <div className="relative rounded-[32px] border border-white/10 bg-surface/50 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {step !== "done" ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Build Your Profile</h2>
                <p className="text-text-secondary text-sm">Let's customize your experience to fit your goals.</p>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-10 relative">
                <div className="absolute inset-y-1/2 left-0 right-0 h-px bg-white/10 -z-10" />
                {STEP_LABELS.map((label, i) => {
                  const n = i + 1
                  const done = n < stepNumber
                  const active = n === stepNumber
                  return (
                    <div key={label} className="flex flex-col items-center gap-2 bg-surface/50 px-2 rounded-full">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                        done   ? "bg-accent border-accent text-background"
                        : active ? "bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(212,255,89,0.3)]"
                        : "bg-background border-white/10 text-text-muted"
                      }`}>
                        {done ? "✓" : n}
                      </div>
                      <span className={`text-[9px] uppercase tracking-widest font-bold absolute -bottom-6 ${active ? "text-accent" : "text-text-muted"}`}>
                        {active && label}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="step-content flex flex-col gap-6">
                {/* Error Box */}
                {error && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    </div>
                    {error}
                  </div>
                )}

                {/* STEP 1: Name & Class */}
                {step === 1 && (
                  <>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-2 block">Full Name</label>
                      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors focus-within:border-accent/50 focus-within:bg-accent/5">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahul Verma" className="w-full bg-transparent text-sm text-white placeholder:text-text-muted p-4 rounded-2xl focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-2 block">Current Class</label>
                      <div className="grid grid-cols-3 gap-2">
                        {CLASSES.map((cls) => (
                          <button
                            key={cls}
                            onClick={() => setStudentClass(cls)}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                              studentClass === cls ? "bg-accent/10 border-accent text-accent" : "bg-white/5 border-white/10 text-text-muted hover:border-white/20 hover:text-white"
                            }`}
                          >
                            {cls}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button onClick={handleNextStep1} className="w-full rounded-2xl bg-white text-black font-bold py-4 text-sm hover:bg-white/90 transition-colors uppercase tracking-widest mt-4">
                      Continue
                    </button>
                  </>
                )}

                {/* STEP 2: Exam & Year */}
                {step === 2 && (
                  <>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-2 block">Targeted Exam</label>
                      <div className="grid grid-cols-2 gap-2">
                        {EXAMS.map((ex) => (
                          <button
                            key={ex}
                            onClick={() => setExam(ex)}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                              exam === ex ? "bg-accent/10 border-accent text-accent" : "bg-white/5 border-white/10 text-text-muted hover:border-white/20 hover:text-white"
                            }`}
                          >
                            {ex}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-2 block">Target Year</label>
                      <select 
                        value={targetYear} 
                        onChange={(e) => setTargetYear(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-sm text-white p-4 rounded-2xl focus:outline-none focus:border-accent/50 appearance-none"
                      >
                        <option value="2024" className="bg-background text-white">2024</option>
                        <option value="2025" className="bg-background text-white">2025</option>
                        <option value="2026" className="bg-background text-white">2026</option>
                        <option value="2027" className="bg-background text-white">2027</option>
                      </select>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => setStep(1)} className="w-1/3 rounded-2xl border border-white/10 bg-white/5 text-white font-bold py-4 text-sm hover:bg-white/10 transition-colors uppercase tracking-widest">
                        Back
                      </button>
                      <button onClick={handleNextStep2} className="w-2/3 rounded-2xl bg-white text-black font-bold py-4 text-sm hover:bg-white/90 transition-colors uppercase tracking-widest">
                        Continue
                      </button>
                    </div>
                  </>
                )}

                {/* STEP 3: Weak Subjects */}
                {step === 3 && (
                  <>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-2 block">Select Weak Subjects (Optional)</label>
                      <div className="flex flex-wrap gap-2">
                        {SUBJECTS.map((subject) => {
                          const isSelected = weakSubjects.includes(subject)
                          return (
                            <button
                              key={subject}
                              onClick={() => toggleSubject(subject)}
                              className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                                isSelected ? "bg-red-500/10 border-red-500/50 text-red-400" : "bg-white/5 border-white/10 text-text-muted hover:border-white/20 hover:text-white"
                              }`}
                            >
                              {subject}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button disabled={loading} onClick={() => setStep(2)} className="w-1/3 rounded-2xl border border-white/10 bg-white/5 text-white font-bold py-4 text-sm hover:bg-white/10 transition-colors uppercase tracking-widest disabled:opacity-50">
                        Back
                      </button>
                      <button disabled={loading} onClick={handleFinish} className="w-2/3 rounded-2xl bg-accent text-black font-bold py-4 text-sm hover:bg-[#cbf745] transition-colors uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" /> : "Finish Setup"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-20 h-20 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,255,89,0.3)]">
                <span className="text-4xl text-accent">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Profile Created!</h2>
              <p className="text-text-secondary text-sm">Redirecting to your dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
