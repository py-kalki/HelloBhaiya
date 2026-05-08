"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { XCircle, CheckCircle2, ArrowRight } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

const COMPARISONS = [
  {
    problem:  "Aimless, random revision that wastes your time.",
    solution: "AI tracks exactly what you're forgetting and builds your daily revision queue.",
    label:    "Revision"
  },
  {
    problem:  "Solving 100s of generic mock tests without analysis.",
    solution: "Custom tests targeting your exact weak chapters with live radar analysis.",
    label:    "Testing"
  },
  {
    problem:  "Losing motivation midway through the preparation year.",
    solution: "Gamified XP, streaks, and level progression keep you addicted to studying.",
    label:    "Motivation"
  },
  {
    problem:  "Anxiety from a massive, unorganized syllabus.",
    solution: "Break it down with daily micro-goals and interactive chapter checklists.",
    label:    "Planning"
  },
]

export default function ProblemSolution() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Section header entrance
    gsap.fromTo(".ps-header",
      { autoAlpha: 0, y: 60 },
      {
        autoAlpha: 1, y: 0, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: ".ps-header", start: "top 85%" }
      }
    )

    // Column headers
    gsap.fromTo(".ps-col-header",
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".ps-col-header", start: "top 90%" }
      }
    )

    // Each row: problem slides from left, solution from right
    const rows = gsap.utils.toArray<HTMLElement>(".comparison-row")
    rows.forEach((row, i) => {
      const problem  = row.querySelector(".cmp-problem")
      const arrow    = row.querySelector(".cmp-arrow")
      const solution = row.querySelector(".cmp-solution")

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 88%",
          end:   "top 55%",
        }
      })

      tl.fromTo(row,
          { autoAlpha: 0, scaleY: 0.85, transformOrigin: "top center" },
          { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: "power3.out" }
        )
        .fromTo(problem,
          { x: -60, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out" },
          "-=0.2"
        )
        .fromTo(arrow,
          { scale: 0, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(2)" },
          "-=0.3"
        )
        .fromTo(solution,
          { x: 60, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out" },
          "-=0.4"
        )
    })

    // Parallax background glow
    gsap.to(".ps-glow", {
      yPercent: 25,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      }
    })

  }, { scope: container })

  return (
    <section ref={container} className="py-32 relative overflow-hidden bg-background">
      <div className="ps-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="ps-header text-center mb-24">
          <div className="inline-block px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-md mb-6">
            <span className="text-accent text-[10px] font-bold tracking-widest uppercase">
              ✦ The Transformation
            </span>
          </div>
          <h2 className="font-sans font-bold text-text-primary text-4xl md:text-6xl tracking-tighter mb-6">
            The Old Way vs <span className="text-accent">HelloBhaiya.</span>
          </h2>
          <p className="text-text-secondary text-lg font-medium max-w-2xl mx-auto">
            Traditional preparation is broken, boring, and inefficient. We rebuilt the entire process
            from the ground up to be data-driven and addictive.
          </p>
        </div>

        <div className="flex flex-col gap-6 relative">
          {/* Column Headers */}
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-8 items-center px-10 pb-4 border-b border-white/5">
            <h3 className="ps-col-header text-text-secondary font-bold uppercase tracking-widest text-sm text-center">The Old Way</h3>
            <div className="w-12" />
            <h3 className="ps-col-header text-accent font-bold uppercase tracking-widest text-sm text-center">The HelloBhaiya Way</h3>
          </div>

          {COMPARISONS.map((item, i) => (
            <div
              key={i}
              className="comparison-row flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center bg-surface/30 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 hover:bg-surface/50 hover:border-white/10 transition-colors group"
            >
              <div className="cmp-problem flex items-start gap-4 w-full md:w-auto">
                <XCircle className="w-6 h-6 text-red-500/80 shrink-0 mt-0.5" />
                <p className="text-text-secondary font-medium leading-relaxed">{item.problem}</p>
              </div>

              <div className="cmp-arrow hidden md:flex flex-col items-center justify-center shrink-0 w-12 opacity-30 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest mb-2">{item.label}</span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-accent" />
                </div>
              </div>

              <div className="cmp-solution flex items-start gap-4 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <p className="text-white font-bold leading-relaxed">{item.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
