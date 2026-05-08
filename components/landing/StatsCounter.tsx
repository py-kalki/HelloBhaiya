"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

const STATS = [
  { value: 4600, display: "4,600+", label: "QUESTIONS",    suffix: "" },
  { value: 108,  display: "108+",   label: "NEET & JEE CHAPTERS", suffix: "" },
  { value: null, display: "XP",     label: "SYSTEM",        suffix: "" },
  { value: null, display: "FREE",   label: "FOREVER",       suffix: "" },
]

export default function StatsCounter() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Slide-up entrance for each stat block
    gsap.fromTo(".stat-item",
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",
        }
      }
    )

    // Number counter for numeric stats
    const counters = [
      { el: ".stat-val-0", end: 4600, formattedEnd: "4,600+" },
      { el: ".stat-val-1", end: 108,  formattedEnd: "108"    },
    ]

    counters.forEach(({ el, end, formattedEnd }) => {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: end,
        duration: 2.5,
        ease: "power4.out",
        onUpdate() {
          const node = container.current?.querySelector(el)
          if (node) {
            node.textContent = obj.val >= end ? formattedEnd : Math.round(obj.val).toLocaleString("en-IN")
            // Flash color during count
            if (obj.val < end) {
              gsap.set(node, { color: "#D4FF59" })
            } else {
              gsap.to(node, { color: "#FFFFFF", duration: 0.5 })
            }
          }
        },
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",
          once: true,
        }
      })
    })

  }, { scope: container })

  return (
    <div ref={container} className="relative flex flex-row w-full divide-x divide-white/5 border-y sm:border-y-0 border-white/5">
      {STATS.map((stat, i) => (
        <div
          key={i}
          className="stat-item flex-1 flex flex-col items-center justify-start pt-5 pb-2 sm:py-8 px-1 sm:px-4 text-center"
        >
          <span className={`font-sans font-extrabold text-white leading-none tracking-tight text-[18px] sm:text-3xl lg:text-4xl stat-val-${i}`}>
            {stat.display}
          </span>
          <span className="font-sans font-bold uppercase mt-1 sm:mt-2 text-[#9e9689] text-[6.5px] sm:text-[9px] tracking-wider sm:tracking-[0.25em]">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  )
}
