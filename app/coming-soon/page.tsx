"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ArrowLeft, Rocket, Bell, CheckCircle2, Lightbulb, X, Send } from "lucide-react"

// ── Feature Request Modal ─────────────────────────────────────────────────────
function FeatureModal({ onClose }: { onClose: () => void }) {
  const [name,  setName]  = useState("")
  const [email, setEmail] = useState("")
  const [idea,  setIdea]  = useState("")
  const [done,  setDone]  = useState(false)
  const overlay = useRef<HTMLDivElement>(null)
  const panel   = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
    gsap.fromTo(panel.current,
      { opacity: 0, y: 48, scale: 0.94 },
      { opacity: 1, y: 0,  scale: 1,    duration: 0.5, ease: "expo.out" }
    )
  }, {})

  const close = () => {
    gsap.to(panel.current,   { opacity: 0, y: 24, scale: 0.96, duration: 0.25, ease: "expo.in" })
    gsap.to(overlay.current, { opacity: 0, duration: 0.3, onComplete: onClose })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && idea) setDone(true)
  }

  return (
    <div
      ref={overlay}
      onClick={(e) => { if (e.target === overlay.current) close() }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <div
        ref={panel}
        className="relative w-full max-w-lg bg-surface border border-white/10 rounded-[28px] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
      >
        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent rounded-t-[28px]" />

        {/* Close */}
        <button
          onClick={close}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {!done ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-white font-bold text-xl tracking-tight">Suggest a Feature</h2>
                <p className="text-text-muted text-xs">We read every single one. Promise.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-2">Your Name</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma" required
                  className="w-full h-11 px-4 rounded-xl bg-background border border-white/10 text-white placeholder:text-text-muted text-sm focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-2">Email Address</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@gmail.com" required
                  className="w-full h-11 px-4 rounded-xl bg-background border border-white/10 text-white placeholder:text-text-muted text-sm focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-2">Your Feature Idea</label>
                <textarea
                  value={idea} onChange={(e) => setIdea(e.target.value)}
                  placeholder="I'd love a feature that lets me practice only wrong questions from past tests..."
                  required rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-white placeholder:text-text-muted text-sm focus:outline-none focus:border-accent/50 transition-colors resize-none leading-relaxed"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 rounded-full bg-accent text-black font-bold uppercase tracking-widest text-sm hover:bg-[#cbf745] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Idea
              </button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-white font-bold text-2xl tracking-tight mb-2">Got it, {name.split(" ")[0]}!</h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
              Your idea has been recorded. We&apos;ll reach out at{" "}
              <span className="text-white font-medium">{email}</span>{" "}
              if we build it.
            </p>
            <button
              onClick={close}
              className="mt-6 h-10 px-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP)
}

const ROADMAP_ITEMS = [
  {
    quarter: "Q2 2025",
    status: "live",
    label: "Live Now",
    items: [
      "Custom Paper Builder (topic-wise)",
      "AI Performance Analysis",
      "AI Answer Suggestions",
      "Open-Source Handwritten Notes",
      "Gamified Daily Tracker & Streaks",
      "Chapter Roadmap & Checklist",
      "XP & Level Progression System",
    ],
  },
  {
    quarter: "Q3 2025",
    status: "building",
    label: "Building",
    items: [
      "1v1 Battle Mode (live tests)",
      "Rank Predictor (NEET & JEE)",
      "Previous Year Papers + AI Walkthrough",
      "Doubt Forum & Community Q&A",
      "Timetable Planner",
    ],
  },
  {
    quarter: "Q4 2025",
    status: "planned",
    label: "Planned",
    items: [
      "Mentor Connect Program",
      "Mobile App (iOS & Android)",
      "Institutional Dashboard",
      "Multi-language Support",
      "Offline Mode",
    ],
  },
  {
    quarter: "2026 & Beyond",
    status: "vision",
    label: "Vision",
    items: [
      "Expand to UPSC, CAT, GATE & more exams",
      "AI-powered personalised video explanations",
      "Live classroom sessions",
      "Peer study groups",
      "National leaderboard & rewards",
    ],
  },
]

const STATUS_CONFIG: Record<string, { color: string; dot: string; border: string; bg: string }> = {
  live:     { color: "text-accent",   dot: "bg-accent",   border: "border-accent/30",   bg: "bg-accent/5"   },
  building: { color: "text-violet",   dot: "bg-violet",   border: "border-violet/30",   bg: "bg-violet/5"   },
  planned:  { color: "text-blue-400", dot: "bg-blue-400", border: "border-blue-400/30", bg: "bg-blue-400/5" },
  vision:   { color: "text-pink-400", dot: "bg-pink-400", border: "border-pink-400/30", bg: "bg-pink-400/5" },
}

export default function ComingSoonPage() {
  const container = useRef<HTMLDivElement>(null)
  const [email, setEmail]         = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useGSAP(() => {
    gsap.set([".cs-badge", ".cs-title", ".cs-sub", ".cs-cta", ".cs-card"], { autoAlpha: 0 })
    gsap.set(".cs-title", { y: 60 })
    gsap.set(".cs-badge", { y: -20, scale: 0.85 })
    gsap.set(".cs-sub",   { y: 30 })
    gsap.set(".cs-cta",   { y: 20, scale: 0.95 })
    gsap.set(".cs-card",  { y: 60, scale: 0.94 })

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } })
    tl.to(".cs-badge", { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 })
      .to(".cs-title",  { autoAlpha: 1, y: 0, duration: 1.1 }, "-=0.4")
      .to(".cs-sub",    { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.6")
      .to(".cs-cta",    { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 }, "-=0.5")
      .to(".cs-card",   { autoAlpha: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.7, ease: "back.out(1.2)" }, "-=0.3")

    gsap.to(".cs-glow", { yPercent: 20, repeat: -1, yoyo: true, duration: 4, ease: "sine.inOut" })
  }, { scope: container })

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <>
      {showModal && <FeatureModal onClose={() => setShowModal(false)} />}
      <div
        ref={container}
      className="min-h-dvh bg-background text-text-primary font-sans selection:bg-accent selection:text-black relative overflow-hidden"
    >
      <div className="cs-glow absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-accent/6 blur-[180px] rounded-full pointer-events-none" />
      <div className="cs-glow absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-white text-sm font-medium transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 pt-16 pb-20 text-center">
        <div className="cs-badge inline-flex items-center gap-2 px-5 py-2 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-md mb-8">
          <Rocket className="w-3.5 h-3.5 text-accent" />
          <span className="text-accent text-[11px] font-bold tracking-widest uppercase">Public Roadmap</span>
        </div>

        <h1 className="cs-title font-bold text-5xl md:text-7xl tracking-tighter leading-[1.05] mb-6">
          We&apos;re building this
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#e0ff8c] to-violet">
            in public.
          </span>
        </h1>

        <p className="cs-sub text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          HelloBhaiya is growing fast. Here&apos;s exactly what we&apos;ve shipped, what we&apos;re building right now, and what&apos;s coming next — no vague promises.
        </p>

        <div className="cs-cta max-w-md mx-auto">
          {!submitted ? (
            <form onSubmit={handleNotify} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 h-12 px-5 rounded-full bg-surface/50 border border-white/10 text-white placeholder:text-text-muted text-sm font-medium focus:outline-none focus:border-accent/50 transition-colors"
              />
              <button
                type="submit"
                className="shrink-0 h-12 px-6 rounded-full bg-accent text-black font-bold text-sm uppercase tracking-widest hover:bg-[#cbf745] transition-colors flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Notify Me
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 h-12 text-accent font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              You&apos;re on the list! We&apos;ll ping you on every major update.
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 pb-32">
        <div className="absolute left-1/2 -translate-x-[1px] top-0 bottom-32 w-[2px] bg-gradient-to-b from-accent/30 via-white/5 to-transparent hidden lg:block" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ROADMAP_ITEMS.map((phase, i) => {
            const s = STATUS_CONFIG[phase.status]
            return (
              <div
                key={i}
                className={`cs-card relative p-8 rounded-[28px] border ${s.border} ${s.bg} backdrop-blur-xl ${i % 2 === 1 ? "lg:mt-24" : ""}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className={`text-[10px] font-bold tracking-widest uppercase ${s.color} mb-1 flex items-center gap-2`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${phase.status === "live" ? "animate-pulse shadow-[0_0_8px_rgba(212,255,89,0.8)]" : ""}`} />
                      {phase.label}
                    </div>
                    <h2 className="text-white font-bold text-2xl tracking-tight">{phase.quarter}</h2>
                  </div>
                  <span className={`text-3xl font-black ${s.color} opacity-20`}>{String(i + 1).padStart(2, "0")}</span>
                </div>

                <ul className="space-y-3">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div className={`mt-[5px] w-1.5 h-1.5 rounded-full shrink-0 ${phase.status === "live" ? s.dot : "bg-white/20"}`} />
                      <span className={`text-sm leading-relaxed ${phase.status === "live" ? "text-white font-medium" : "text-text-secondary"}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {phase.status === "live" && (
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent/60 to-transparent rounded-t-[28px]" />
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-24 text-center">
          <p className="text-text-secondary text-sm mb-6">Have a feature request? We read every suggestion.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-8 h-12 rounded-full bg-accent text-black font-bold text-sm uppercase tracking-widest hover:bg-[#cbf745] transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              Suggest a Feature
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 h-12 rounded-full bg-surface border border-white/10 hover:border-white/25 text-white font-bold text-sm uppercase tracking-widest transition-all hover:bg-surface/80"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
