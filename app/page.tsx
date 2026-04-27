import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

// ─────────────────────────────────────────────────────────────────
// DATA & CONTENT
// ─────────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  "NEET 2026",
  "JEE MAINS",
  "SPACED REPETITION",
  "XP PROGRESSION",
  "CUSTOM MOCK TESTS",
  "LIVE RADAR",
  "AI DOUBT SOLVER",
]

const STATS = [
  { value: "2.4M+", label: "Aspirants" },
  { value: "50K+", label: "Questions" },
  { value: "180+", label: "Chapters" },
  { value: "Free", label: "Forever" },
]

// ─────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
      {/* Dynamic noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      {/* Moving glass orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white/[0.015] blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/[0.02] blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-white/[0.01] blur-[100px] animate-float" />
      
      {/* Fine grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
    </div>
  )
}

function GlassHeader() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <header className="relative flex items-center justify-between px-6 py-3 rounded-full border border-white/[0.08] bg-[#050505]/40 backdrop-blur-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
        
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/0 border border-white/10 flex items-center justify-center shadow-inner backdrop-blur-md">
            <span className="text-sm drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">📚</span>
          </div>
          <span className="font-hv text-[10px] font-bold uppercase tracking-[0.25em] text-white">
            HelloBhaiya
          </span>
        </div>

        <nav className="relative z-10 hidden md:flex items-center gap-8">
          {["Features", "Methodology", "Stats"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="font-hv text-[9px] uppercase tracking-[0.2em] text-[#888888] hover:text-white transition-all duration-300">
              {item}
            </a>
          ))}
        </nav>

        <div className="relative z-10">
          <Link 
            href="/login" 
            className="group relative inline-flex items-center justify-center px-5 py-2 overflow-hidden rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <span className="font-hv text-[9px] font-bold uppercase tracking-[0.2em] relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.2)]">
              Sign In
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
          </Link>
        </div>

      </header>
    </div>
  )
}

function HeroMockup() {
  return (
    <div className="relative w-full max-w-[500px] mx-auto perspective-[1200px]">
      <div className="absolute inset-0 bg-white/[0.02] blur-[100px] rounded-full" />
      
      <div className="relative rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-1 shadow-2xl backdrop-blur-3xl transform rotate-y-[-12deg] rotate-x-[8deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-1000 ease-out">
        <div className="rounded-[1.8rem] border border-white/[0.03] bg-[#0A0A0A]/80 overflow-hidden flex flex-col gap-4 p-6 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
            <div>
              <p className="font-hv text-[8px] uppercase tracking-[0.3em] text-[#666666] mb-1">Target</p>
              <p className="font-display text-lg text-white">NEET 2026</p>
            </div>
            <div className="px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-hv text-[8px] uppercase tracking-[0.2em] text-white">Live Sync</span>
            </div>
          </div>

          {/* Radar Preview */}
          <div className="relative h-48 w-full border border-white/[0.05] rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
             
             {/* Abstract Radar SVG */}
             <svg viewBox="0 0 100 100" className="w-32 h-32 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
               <polygon points="50,10 90,40 75,85 25,85 10,40" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
               <polygon points="50,25 75,45 65,75 35,75 25,45" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
               <circle cx="50" cy="50" r="3" fill="#fff" className="animate-glow-pulse" />
             </svg>

             {/* Subject Labels */}
             <span className="absolute top-2 left-1/2 -translate-x-1/2 font-hv text-[8px] tracking-[0.2em] text-[#888]">Physics</span>
             <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-hv text-[8px] tracking-[0.2em] text-[#888]">Biology</span>
          </div>

          {/* XP Bar */}
          <div className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.01]">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="font-hv text-[8px] uppercase tracking-[0.2em] text-[#666] mb-1">Current Level</p>
                <p className="font-display text-sm text-white">Scholar</p>
              </div>
              <p className="font-mono text-xs text-[#888]">42,500 XP</p>
            </div>
            <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-white/20 to-white w-[60%] relative">
                <div className="absolute inset-0 bg-white/20 blur-[2px] animate-pulse" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function BentoFeature({ 
  number, 
  title, 
  desc, 
  className = "", 
  children 
}: { 
  number: string, title: string, desc: string, className?: string, children: React.ReactNode 
}) {
  return (
    <div className={`group relative rounded-[2rem] border border-white/[0.08] bg-[#080808]/50 backdrop-blur-md overflow-hidden p-8 hover:border-white/[0.15] transition-all duration-500 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <span className="font-display italic text-2xl text-[#444] group-hover:text-white transition-colors duration-500">{number}</span>
        </div>
        
        <h3 className="font-display text-3xl font-bold text-white mb-3" style={{ fontVariationSettings: '"SOFT" 30' }}>
          {title}
        </h3>
        <p className="text-[#888] text-sm leading-relaxed mb-8 max-w-[90%]">
          {desc}
        </p>

        <div className="mt-auto flex-1 relative min-h-[160px] rounded-xl border border-white/[0.05] bg-[#0A0A0A] overflow-hidden group-hover:border-white/[0.1] transition-colors duration-500">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const session = (await cookies()).get("session")?.value
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-dvh flex flex-col bg-[#050505] text-white selection:bg-white selection:text-black font-sans relative">
      <AnimatedBackground />
      <GlassHeader />

      <main className="relative z-10 flex-1 flex flex-col">
        
        {/* ══ HERO SECTION ══ */}
        <section className="relative min-h-dvh flex items-center pt-24 pb-16 px-6 lg:px-12 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="flex flex-col items-start gap-8 z-10">
              <div className="animate-slide-down flex items-center gap-3 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                <span className="font-hv text-[9px] font-bold uppercase tracking-[0.25em] text-[#888]">
                  The New Standard in Prep
                </span>
              </div>

              <h1 className="animate-slide-up delay-75 font-display font-black leading-[0.9] tracking-tight text-[clamp(4.5rem,8vw,8.5rem)]" style={{ fontVariationSettings: '"SOFT" 40, "WONK" 1' }}>
                <span className="block text-[#444] hover:text-white transition-colors duration-700 cursor-default">Stop</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#aaa] to-[#555] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  Grinding
                </span>
                <span className="block text-white">Blindly.</span>
              </h1>

              <p className="animate-slide-up delay-150 font-sans text-[#888] text-lg max-w-[40ch] leading-relaxed border-l-2 border-white/10 pl-6">
                HelloBhaiya tracks your precise weaknesses, builds hyper-targeted mock tests, and turns every hour of study into gamified XP.
              </p>

              <div className="animate-slide-up delay-225 flex flex-wrap items-center gap-5 pt-4">
                <Link 
                  href="/login" 
                  className="group relative h-14 px-10 rounded-full bg-white text-black flex items-center justify-center overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                  <span className="font-hv text-[11px] font-bold uppercase tracking-[0.2em] relative z-10">
                    Start Free Mission
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </Link>
                <a 
                  href="#features" 
                  className="h-14 px-8 rounded-full border border-white/10 flex items-center justify-center font-hv text-[11px] uppercase tracking-[0.2em] text-[#888] hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                >
                  Explore Arsenal
                </a>
              </div>
            </div>

            <div className="animate-slide-up delay-300 w-full relative">
              <HeroMockup />
            </div>

          </div>
        </section>

        {/* ══ INFINITE TICKER ══ */}
        <section className="border-y border-white/[0.05] bg-white/[0.01] backdrop-blur-sm py-4 overflow-hidden">
          <div className="flex animate-marquee marquee-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <div key={i} className="flex items-center whitespace-nowrap">
                <span className="font-hv text-[11px] font-bold uppercase tracking-[0.3em] text-[#666] px-8">
                  {item}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            ))}
          </div>
        </section>

        {/* ══ BENTO GRID FEATURES ══ */}
        <section id="features" className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-32">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <p className="font-hv text-[10px] font-bold uppercase tracking-[0.3em] text-[#666] mb-4">
                The Architecture
              </p>
              <h2 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-[0.95]" style={{ fontVariationSettings: '"SOFT" 30' }}>
                Engineered for <br/>
                <span className="text-[#555]">Dominance.</span>
              </h2>
            </div>
            <p className="text-[#888] max-w-sm text-sm leading-relaxed md:text-right">
              Every system is designed around the exact psychology of top rankers. We removed the friction and gamified the grind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[450px]">
            
            {/* Feature 1 */}
            <BentoFeature 
              number="01"
              title="Custom Test Engine"
              desc="Generate precise chapter-wise or full-syllabus mock tests in seconds. Control difficulty, timer, and question types."
              className="lg:col-span-2"
            >
              <div className="absolute inset-0 p-6 flex flex-col gap-4">
                <div className="w-full h-12 rounded-xl border border-white/[0.05] bg-white/[0.02] flex items-center justify-between px-4">
                  <span className="font-hv text-[9px] uppercase tracking-[0.2em] text-[#888]">Syllabus Select</span>
                  <span className="font-mono text-[10px] text-white">3 Chapters Selected</span>
                </div>
                <div className="flex-1 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 flex gap-4">
                  <div className="w-1/2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-full h-2 rounded bg-white/10" />
                      <div className="w-3/4 h-2 rounded bg-white/5" />
                    </div>
                    <div className="w-20 h-8 rounded-lg bg-white text-black flex items-center justify-center font-hv text-[8px] uppercase tracking-widest font-bold">
                      Generate
                    </div>
                  </div>
                  <div className="w-1/2 h-full rounded-lg border border-white/[0.05] bg-gradient-to-br from-white/[0.02] to-transparent flex items-center justify-center">
                    <span className="text-3xl opacity-20">⚙️</span>
                  </div>
                </div>
              </div>
            </BentoFeature>

            {/* Feature 2 */}
            <BentoFeature 
              number="02"
              title="Weakness Radar"
              desc="A live, multi-axis tracking system that exposes exactly where you lose marks."
              className="lg:col-span-1"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-32 h-32 rounded-full border border-white/[0.05] flex items-center justify-center relative">
                   <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center">
                     <div className="w-12 h-12 rounded-full border border-white/20 bg-white/[0.02] flex items-center justify-center relative">
                       <div className="absolute inset-0 rounded-full border-t border-white animate-spin-slow" />
                       <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_#fff]" />
                     </div>
                   </div>
                 </div>
              </div>
            </BentoFeature>

            {/* Feature 3 */}
            <BentoFeature 
              number="03"
              title="XP & Streaks"
              desc="Dopamine-driven progression. Maintain streaks, earn XP, and climb the leaderboard from Rookie to NEET Legend."
              className="lg:col-span-1"
            >
              <div className="absolute inset-0 p-6 flex flex-col justify-center gap-4">
                 <div className="flex items-center gap-4 border border-white/[0.05] bg-white/[0.02] p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">🔥</div>
                    <div>
                      <p className="font-hv text-[8px] uppercase tracking-[0.2em] text-[#888]">Current Streak</p>
                      <p className="font-display text-xl text-white">14 Days</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 border border-white/[0.05] bg-white/[0.02] p-3 rounded-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent animate-shimmer" />
                    <div className="w-10 h-10 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center text-xl">⚡</div>
                    <div>
                      <p className="font-hv text-[8px] uppercase tracking-[0.2em] text-[#888]">XP Earned</p>
                      <p className="font-display text-xl text-white">8,450</p>
                    </div>
                 </div>
              </div>
            </BentoFeature>

            {/* Feature 4 */}
            <BentoFeature 
              number="04"
              title="SM-2 Revision"
              desc="Spaced repetition algorithms automatically surface your weakest concepts right before you forget them."
              className="lg:col-span-2"
            >
              <div className="absolute inset-0 p-6 flex items-end gap-2">
                 {[40, 20, 60, 30, 80, 50, 100].map((height, i) => (
                   <div 
                     key={i} 
                     className="flex-1 rounded-t-lg bg-gradient-to-t from-white/10 to-white/5 border-t border-white/20 relative group-hover:from-white/20 transition-colors duration-500"
                     style={{ height: `${height}%` }}
                   >
                     {i === 6 && (
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[8px] font-bold rounded">
                         REVIEW
                       </div>
                     )}
                   </div>
                 ))}
              </div>
            </BentoFeature>

          </div>
        </section>

        {/* ══ STATS & TRUST ══ */}
        <section className="border-y border-white/[0.05] bg-gradient-to-b from-white/[0.02] to-transparent py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/[0.05]">
            {STATS.map((stat, i) => (
              <div key={i} className={`flex flex-col items-center justify-center ${i === 0 ? 'pl-0' : ''}`}>
                <span className="font-display font-black text-4xl md:text-5xl text-white mb-2" style={{ fontVariationSettings: '"SOFT" 30' }}>
                  {stat.value}
                </span>
                <span className="font-hv text-[10px] uppercase tracking-[0.3em] text-[#666]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CTA SECTION ══ */}
        <section className="relative w-full max-w-5xl mx-auto px-6 lg:px-12 py-32">
          <div className="relative rounded-[3rem] border border-white/10 bg-[#080808]/80 backdrop-blur-2xl p-12 md:p-24 text-center overflow-hidden">
            
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-white/[0.02] blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-hv text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-6">
                Zero Paywalls. Zero Ads.
              </span>
              
              <h2 className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-8" style={{ fontVariationSettings: '"SOFT" 30, "WONK" 1' }}>
                Your Rank is <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#666]">
                  Waiting.
                </span>
              </h2>
              
              <p className="text-[#888] max-w-md mx-auto mb-10 text-base md:text-lg">
                Stop planning to study. Step into the arena and start levelling up your preparation today.
              </p>
              
              <Link 
                href="/login" 
                className="group relative h-16 px-12 rounded-full bg-white text-black flex items-center justify-center overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_50px_rgba(255,255,255,0.15)]"
              >
                <span className="font-hv text-[12px] font-bold uppercase tracking-[0.2em] relative z-10">
                  Begin Free Access
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </Link>
            </div>

          </div>
        </section>

      </main>

      {/* ══ FOOTER ══ */}
      <div className="pb-10 px-6 lg:px-12">
        <footer className="relative z-10 max-w-7xl mx-auto rounded-[2rem] border border-white/[0.08] bg-[#080808]/50 backdrop-blur-2xl p-8 md:p-12 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-xl opacity-80">📚</span>
              </div>
              <div>
                <span className="font-hv text-[11px] font-bold uppercase tracking-[0.2em] text-white block">
                  HelloBhaiya
                </span>
                <span className="font-hv text-[8px] uppercase tracking-[0.2em] text-[#666] mt-1 block">
                  The New Standard
                </span>
              </div>
            </div>

            <p className="font-hv text-[9px] uppercase tracking-[0.2em] text-[#666] text-center md:text-right leading-loose">
              Engineered with Precision for India's 2.4M Aspirants <br/>
              <span className="text-white/30">© 2026 All Rights Reserved</span>
            </p>
          </div>
        </footer>
      </div>

    </div>
  )
}
