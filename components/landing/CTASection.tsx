"use client"

import { useRef } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export default function CTASection() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Card entrance: scale + fade
    gsap.fromTo(".cta-card",
      { autoAlpha: 0, scale: 0.88, y: 60 },
      {
        autoAlpha: 1, scale: 1, y: 0,
        duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: ".cta-card", start: "top 85%" }
      }
    )

    // Text stagger
    gsap.fromTo(".cta-text",
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1, y: 0,
        stagger: 0.12, duration: 0.9, ease: "expo.out",
        scrollTrigger: { trigger: ".cta-card", start: "top 80%" }
      }
    )

    // Button pulse glow loop
    gsap.to(".cta-btn", {
      boxShadow: "0 0 80px 20px rgba(212,255,89,0.5)",
      repeat: -1,
      yoyo: true,
      duration: 1.8,
      ease: "sine.inOut",
      delay: 1,
    })

    // Parallax background grid
    gsap.to(".cta-grid", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      }
    })
  }, { scope: container })

  return (
    <section ref={container} className="relative py-32 px-6 sm:px-8 bg-background overflow-hidden border-t border-white/5">
      <div className="cta-grid absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />


      <div className="cta-card relative max-w-5xl mx-auto rounded-[40px] border border-white/10 bg-surface/30 backdrop-blur-3xl p-10 md:p-24 text-center shadow-[0_0_80px_rgba(212,255,89,0.05)] overflow-hidden">
        {/* Static inner glow — no rotation, no clipping issue */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] max-w-[500px] h-[60%] bg-accent/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="cta-text inline-block px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <span className="text-white text-[10px] font-bold tracking-widest uppercase">
              ✦ Ready to level up?
            </span>
          </div>

          <h2 className="cta-text font-sans font-bold text-text-primary text-5xl md:text-7xl tracking-tighter leading-[1.1] mb-10">
            Your NEET & JEE prep <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#e0ff8c] to-white">starts today.</span>
          </h2>

          <Link
            href="/login"
            className="cta-btn cta-text group relative font-sans font-bold uppercase flex items-center justify-center bg-accent text-black hover:bg-[#cbf745] active:scale-95 transition-all rounded-full px-12 h-16 text-sm tracking-widest shadow-[0_0_60px_rgba(212,255,89,0.4)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center justify-center h-full leading-none mt-[1px]">Claim Your Account</span>
          </Link>

          <p className="cta-text font-sans text-text-secondary mt-8 text-sm font-medium flex items-center gap-2 justify-center">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            No credit card. No install. Google login in 2 seconds.
          </p>
        </div>
      </div>
    </section>
  )
}
