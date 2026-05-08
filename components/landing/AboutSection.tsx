"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Flame, BookOpen, Users, BarChart3, Heart, Lightbulb } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}


const VALUES = [
  {
    icon: <Flame className="w-6 h-6" />,
    title: "Relentless Focus",
    desc: "We cut every feature that doesn't directly improve your score. No bloat. No distractions.",
    color: "from-orange-500/20 to-transparent",
    border: "hover:border-orange-500/30",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Data Over Gut Feel",
    desc: "Every recommendation is backed by your personal test data — not generic study plans.",
    color: "from-accent/20 to-transparent",
    border: "hover:border-accent/30",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Student-First",
    desc: "Free forever. No paywalls on core features. We earn when you earn — after you crack NEET, JEE, or whatever's next.",
    color: "from-red-500/20 to-transparent",
    border: "hover:border-red-500/30",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Gamified Learning",
    desc: "Studying should feel like leveling up a character, not grinding a chore list.",
    color: "from-yellow-500/20 to-transparent",
    border: "hover:border-yellow-500/30",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Quality Content",
    desc: "Every question is hand-verified by NEET & JEE toppers and academic experts. No recycled garbage.",
    color: "from-violet/20 to-transparent",
    border: "hover:border-violet/30",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community Driven",
    desc: "Built with, and for, the aspirant community. Our roadmap is shaped by real student feedback across NEET, JEE & beyond.",
    color: "from-pink-500/20 to-transparent",
    border: "hover:border-pink-500/30",
  },
]

export default function AboutSection() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // ── Mission block entrance ──────────────────────────────────────────
    gsap.fromTo(".about-mission",
      { autoAlpha: 0, y: 60 },
      {
        autoAlpha: 1, y: 0, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: ".about-mission", start: "top 85%" }
      }
    )

    // ── Big quote word-by-word reveal ──────────────────────────────────
    gsap.fromTo(".about-quote-word",
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1, y: 0,
        stagger: 0.04,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-quote", start: "top 80%" }
      }
    )

    // ── Values grid stagger + Stacking Depth ──────────────────────────
    const values = gsap.utils.toArray<HTMLElement>(".value-card")
    values.forEach((card, i) => {
      // 1. Entrance
      gsap.fromTo(card,
        { autoAlpha: 0, y: 40, scale: 0.94 },
        {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 0.7,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: card, start: "top 92%" }
        }
      )

      // 2. Stacking Depth (Mobile)
      const nextCard = values[i + 1]
      if (nextCard) {
        gsap.to(card, {
          scale: 0.94,
          autoAlpha: 0.5,
          scrollTrigger: {
            trigger: nextCard,
            start: "top 35%",
            end: "top 15%",
            scrub: true,
          }
        })
      }
    })

    // ── Parallax glows ─────────────────────────────────────────────────
    gsap.to(".about-glow", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      }
    })

  }, { scope: container })

  const quoteWords = "We built the study platform we wished existed when we were preparing.".split(" ")

  return (
    <section ref={container} id="about" className="py-32 pb-64 relative overflow-visible bg-background border-t border-white/5">

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="about-glow absolute top-0 left-1/4 w-[700px] h-[700px] bg-accent/5 blur-[150px] rounded-full" />
        <div className="about-glow absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">

        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="about-mission text-center mb-16 md:mb-24">
          <div className="inline-block px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-md mb-6">
            <span className="text-accent text-[10px] font-bold tracking-widest uppercase">
              ✦ Our Story
            </span>
          </div>
          <h2 className="font-sans font-bold text-text-primary text-4xl md:text-6xl tracking-tighter mb-6">
            Built by aspirants,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#e0ff8c] to-violet">
              for aspirants.
            </span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            HelloBhaiya started as a frustration project. Three ex-NEET & JEE aspirants, tired of juggling
            10 apps, spreadsheets, and random YouTube playlists — decided to build the one tool
            they actually needed.
          </p>
        </div>

        {/* ── Big Pull Quote ─────────────────────────────────────────────── */}
        <div className="about-quote hidden md:block max-w-4xl mx-auto mb-32 relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-violet to-transparent rounded-full" />
          <div className="pl-8">
            <p className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-snug">
              {quoteWords.map((word, i) => (
                <span key={i} className="about-quote-word inline-block mr-[0.35em]">
                  {word}
                </span>
              ))}
            </p>
            <p className="mt-6 text-text-secondary text-sm font-medium">— Arjun Sharma, Co-Founder</p>
          </div>
        </div>

        {/* ── Two-Column Mission + Image ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 md:mb-32 items-center">
          <div className="about-mission">
            <h3 className="text-3xl font-bold text-white tracking-tight mb-6">
              The problem with competitive exam prep<br />
              <span className="text-accent">is not effort — it's direction.</span>
            </h3>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Most aspirants spend 12+ hours studying but never know which chapters are actually
                killing their score. They do generic mock tests, get a number, and move on — with
                no real understanding of what to fix.
              </p>
              <p className="hidden md:block">
                HelloBhaiya changes that. Every test you take feeds a live Weakness Radar. Every
                chapter you complete is verified by your scores — not self-reported. Every revision
                session is scheduled by spaced repetition, not habit.
              </p>
              <p className="text-white font-semibold">
                The result? Students who use HelloBhaiya for 90+ days report a 40-point average
                improvement in their mock test scores.
              </p>
            </div>
          </div>

          {/* Stats Visual Block */}
          <div className="about-mission grid grid-cols-2 gap-4">
            {[
              { val: "90+", label: "Days to see results", color: "text-accent" },
              { val: "40pts", label: "Avg score improvement", color: "text-violet" },
              { val: "4,600+", label: "Expert-verified questions", color: "text-blue-400" },
              { val: "108+", label: "Chapters covered (NEET & JEE)", color: "text-pink-400" },
            ].map((s, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-surface/40 border border-white/5 hover:border-white/15 transition-colors group"
              >
                <div className={`text-3xl font-bold ${s.color} mb-2 group-hover:scale-105 transition-transform inline-block`}>
                  {s.val}
                </div>
                <div className="text-text-muted text-xs font-medium uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Core Values Grid ───────────────────────────────────────────── */}
        <div className="mb-20 md:mb-32">
          <div className="text-center mb-12 md:mb-16 about-mission">
            <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4">
              <span className="text-text-secondary text-[10px] font-bold tracking-widest uppercase">
                What we stand for
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Our Core Values
            </h3>
          </div>

          <div className="values-grid flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {VALUES.map((v, i) => (
              <div 
                key={i} 
                className="sticky top-[var(--mob-top)] sm:relative sm:top-auto block"
                style={{ "--mob-top": `calc(10vh + ${i * 2}rem)` } as React.CSSProperties}
              >
                <div
                  className={`value-card relative p-7 rounded-2xl bg-[#0a0a0a] border border-white/10 ${v.border} transition-all duration-300 group overflow-hidden shadow-2xl`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${v.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-background border border-white/10 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300">
                      {v.icon}
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2 tracking-tight">{v.title}</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
