"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Image from "next/image"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import { scrollToSection } from "./SmoothScrollProvider"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

const NAV_LINKS = [
  { label: "Home",       href: "#",          scroll: true  },
  { label: "Features",   href: "#features",  scroll: true  },
  { label: "Roadmap",    href: "/coming-soon", scroll: false },
  { label: "About",      href: "#about",     scroll: true  },
  { label: "Contact Us", href: "#footer",    scroll: true  },
]

export default function HeroSection() {
  // Outer wrapper is GSAP scope — nav + hero text both live inside it
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef      = useRef<HTMLElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useGSAP(() => {
    // ── 0. Set initial states ──
    gsap.set([".hero-nav", ".hero-badge", ".hero-word", ".hero-sub", ".hero-cta"], {
      autoAlpha: 0,
    })
    gsap.set(".hero-word",  { y: 80, rotationX: 90, transformOrigin: "50% 100%" })
    gsap.set(".hero-badge", { y: -24, scale: 0.85 })
    gsap.set(".hero-nav",   { y: -40 })
    gsap.set(".hero-sub",   { y: 30 })
    gsap.set(".hero-cta",   { y: 30, scale: 0.9 })

    // ── 1. Entrance timeline ──────────────────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1 } })

    tl.to(".hero-nav",   { autoAlpha: 1, y: 0, duration: 0.9 })
      .to(".hero-badge", { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.5)" }, "-=0.5")
      .to(".hero-word",  {
          autoAlpha: 1, y: 0, rotationX: 0,
          stagger: 0.08, duration: 1.1, ease: "expo.out",
        }, "-=0.4"
      )
      .to(".hero-sub",   { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.6")
      .to(".hero-cta",   { autoAlpha: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.7, ease: "back.out(1.4)" }, "-=0.5")

    // ── 2. Parallax glow arc while scrolling ─────────────────────────────
    if (heroRef.current && gsap.utils.toArray(".hero-glow-arc", containerRef.current).length > 0) {
      gsap.to(".hero-glow-arc", {
        yPercent: 40,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      })
    }

  }, { scope: containerRef })

  // ── titleComponent: the hero text passed into ContainerScroll ──
  const titleComponent = (
    <div className="flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full [transform-style:preserve-3d]">
      {/* Badge */}
      <div className="hero-badge mb-8 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-pointer hover:bg-white/10 transition-colors">
        <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
        <span className="text-text-primary text-xs font-semibold uppercase tracking-[0.2em]">
          HelloBhaiya is Live
        </span>
      </div>

      {/* H1 */}
      <h1 className="font-sans font-bold text-5xl sm:text-6xl md:text-8xl lg:text-[100px] tracking-tighter leading-[1.1] sm:leading-[1] mb-6 sm:mb-8 pb-2 [perspective:600px]">
        <span className="hero-word inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/60">
          Dominate
        </span>{" "}
        <span className="hero-word inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/60">
          your
        </span>
        <br />
        <span className="hero-word inline-block bg-clip-text text-transparent bg-gradient-to-r from-accent via-[#e0ff8c] to-violet">
            NEET & JEE
        </span>{" "}
        <span className="hero-word inline-block bg-clip-text text-transparent bg-gradient-to-r from-accent via-[#e0ff8c] to-violet">
          prep.
        </span>
      </h1>

      <p className="hero-sub font-sans text-text-secondary text-lg md:text-xl max-w-2xl leading-relaxed mb-8 font-medium">
          The gamified platform for serious aspirants. Custom tests, live weakness
            radar, and XP progression — built for NEET, JEE, and every competitive exam that matters.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 w-full flex-wrap mb-10">
        <Link
          href="/login"
          className="hero-cta shrink-0 group relative font-sans font-bold uppercase flex items-center justify-center text-black bg-accent rounded-full px-10 h-14 text-sm tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(212,255,89,0.3)]"
        >
          <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center justify-center h-full leading-none mt-[1px]">Start for Free</span>
        </Link>

        <button className="hero-cta shrink-0 group font-sans font-bold uppercase flex items-center justify-center text-white bg-surface/50 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-surface transition-all rounded-full px-10 h-14 text-sm tracking-widest">
          <span className="mr-3 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">▶</span>
          <span className="flex items-center justify-center h-full leading-none mt-[1px]">Watch Demo</span>
        </button>
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className="relative">

      {/* ══ NAV ══════════════════════════════════════════════════════════════ */}
      <header className="hero-nav fixed top-4 sm:top-6 left-4 right-4 sm:left-6 sm:right-6 z-50 flex items-center justify-between md:justify-center bg-surface/40 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border border-white/10 md:border-transparent shadow-[0_8px_32px_rgba(0,0,0,0.5)] md:shadow-none rounded-full px-3 py-2 md:p-0 transition-all">
        <div className="md:absolute md:left-0 flex shrink-0">
          <Link href="/" className="group flex items-center relative">
            <Image 
              src="/hellobhaiya-logo.svg" 
              alt="HelloBhaiya Logo" 
              width={200} 
              height={48} 
              className="h-8 sm:h-10 w-auto group-hover:opacity-80 transition-opacity"
              style={{ width: "auto" }}
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-surface/40 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full p-1 transition-all duration-500 hover:bg-surface/60 hover:border-white/20">
          {NAV_LINKS.map((link) =>
            link.scroll ? (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(link.href.slice(1))
                }}
                className="font-sans flex items-center justify-center text-[11px] font-bold uppercase tracking-widest transition-all rounded-full px-4 h-7 leading-none text-text-secondary hover:text-white hover:bg-white/10"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="font-sans flex items-center justify-center text-[11px] font-bold uppercase tracking-widest transition-all rounded-full px-4 h-7 leading-none text-text-secondary hover:text-white hover:bg-white/10"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="md:absolute md:right-0 flex items-center gap-2 shrink-0">
          <Link
            href="/login"
            className="relative group font-sans font-bold uppercase flex items-center justify-center text-black bg-accent hover:bg-[#cbf745] active:scale-95 transition-all rounded-full h-[32px] sm:h-[34px] px-5 sm:px-6 text-[10px] sm:text-[11px] tracking-widest overflow-hidden shadow-[0_8px_32px_rgba(212,255,89,0.2)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center justify-center h-full leading-none mt-[1px]">Sign In</span>
          </Link>
          
          {/* Hamburger Menu Toggle (Mobile Only) */}
          <button 
            className="md:hidden flex items-center justify-center w-[32px] h-[32px] rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-2xl p-3 flex flex-col gap-1 md:hidden">
            {NAV_LINKS.map((link) =>
              link.scroll ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMobileMenuOpen(false)
                    scrollToSection(link.href.slice(1))
                  }}
                  className="font-sans flex items-center text-[11px] font-bold uppercase tracking-widest transition-all rounded-xl px-4 py-3.5 text-text-secondary hover:text-white hover:bg-white/10"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-sans flex items-center text-[11px] font-bold uppercase tracking-widest transition-all rounded-xl px-4 py-3.5 text-text-secondary hover:text-white hover:bg-white/10"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        )}
      </header>

      {/* ══ HERO ═════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative bg-background overflow-hidden pt-24"
      >
        {/* Background Gradients/Arcs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div
            className="hero-glow-arc absolute top-[15%] left-1/2 -translate-x-1/2 w-[140%] max-w-[1400px] h-[600px] rounded-[100%] border-t-[3px] border-accent/60 shadow-[0_-20px_80px_-20px_rgba(212,255,89,0.2)] opacity-90"
            style={{ background: "radial-gradient(ellipse at top, rgba(212,255,89,0.08) 0%, transparent 60%)" }}
          />
        </div>

        {/* ContainerScroll: title = hero text, children = dashboard */}
        <div className="relative z-10">
        <ContainerScroll titleComponent={titleComponent}>
            <Image
              src="/dashboard_mockup.jpeg"
              alt="HelloBhaiya Dashboard Preview"
              width={1400}
              height={720}
              className="w-full h-full object-cover object-top rounded-2xl"
              draggable={false}
              priority
            />
          </ContainerScroll>
        </div>
      </section>

    </div>
  )
}
