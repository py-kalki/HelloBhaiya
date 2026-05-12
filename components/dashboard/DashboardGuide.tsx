"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, ChevronRight, ChevronLeft, 
  Map, BookOpen, Clock, Swords, Sparkles, HelpCircle, Target 
} from "lucide-react"

const SLIDES = [
  {
    id: "welcome",
    title: "Welcome to HelloBhaiya!",
    desc: "Your ultimate AI-powered study companion. Let's take a quick tour of what you can do to boost your prep.",
    icon: Sparkles,
    color: "#D4FF59"
  },
  {
    id: "roadmap",
    title: "Your Roadmap",
    desc: "Navigate through your entire syllabus chapter by chapter. Track your mastery and see exactly what to study next.",
    icon: Map,
    color: "#6EE7B7"
  },
  {
    id: "notes",
    title: "Smart Notes & Revision",
    desc: "Access curated study material and highlight key points. Use the Tonights Revision Banner to recap effectively.",
    icon: BookOpen,
    color: "#A78BFA"
  },
  {
    id: "tests",
    title: "Test Builder",
    desc: "Launch custom mock tests or fix your weak areas in the Danger Zone. Practice makes perfect.",
    icon: Target,
    color: "#60A5FA"
  },
  {
    id: "timetable",
    title: "Focus & Timetable",
    desc: "Plan your study sessions. Use the built-in Pomodoro widget and Daily Tasks to stay on top of your schedule.",
    icon: Clock,
    color: "#FCD34D"
  },
  {
    id: "battle",
    title: "Battle Mode",
    desc: "Coming in Phase 2: Challenge friends in live 1v1 quiz duels to test your speed and accuracy.",
    icon: Swords,
    color: "#F87171"
  }
]

export function DashboardGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const seen = localStorage.getItem("hb_dashboard_guide_seen")
    if (!seen) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        localStorage.setItem("hb_dashboard_guide_seen", "true")
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1)
    } else {
      setIsOpen(false)
      setCurrentSlide(0)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1)
    }
  }

  const current = SLIDES[currentSlide]!
  const Icon = current.icon

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => {
          setCurrentSlide(0)
          setIsOpen(true)
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-white/6 text-xs font-medium text-text-secondary hover:text-white hover:border-white/20 transition-colors shadow-sm"
      >
        <HelpCircle size={14} />
        Guide
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-surface border border-white/10 rounded-[32px] overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              {/* Top ambient glow based on current slide color */}
              <div 
                className="absolute top-0 left-0 right-0 h-32 opacity-20 blur-3xl transition-colors duration-500"
                style={{ backgroundColor: current.color }}
              />

              {/* Close btn */}
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-text-muted hover:text-white hover:bg-white/5 transition-colors z-20"
              >
                <X size={20} />
              </button>

              {/* Slide Content */}
              <div className="p-8 sm:p-10 pt-12 flex flex-col items-center text-center relative z-10 min-h-[320px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center"
                  >
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg border"
                      style={{ 
                        backgroundColor: `${current.color}15`, 
                        borderColor: `${current.color}30`,
                        boxShadow: `0 0 24px ${current.color}30`
                      }}
                    >
                      <Icon size={36} style={{ color: current.color }} />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
                      {current.title}
                    </h2>
                    
                    <p className="text-text-secondary leading-relaxed">
                      {current.desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls Footer */}
              <div className="p-6 bg-surface-2/50 border-t border-white/5 flex items-center justify-between relative z-10">
                {/* Progress Dots */}
                <div className="flex items-center gap-2">
                  {SLIDES.map((_, idx) => (
                    <div 
                      key={idx}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: idx === currentSlide ? "24px" : "6px",
                        backgroundColor: idx === currentSlide ? current.color : "rgba(255,255,255,0.2)"
                      }}
                    />
                  ))}
                </div>

                {/* Nav Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="p-2.5 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-black font-semibold shadow-md transition-transform active:scale-95"
                    style={{ backgroundColor: current.color }}
                  >
                    {currentSlide === SLIDES.length - 1 ? "Get Started" : "Next"}
                    {currentSlide < SLIDES.length - 1 && <ChevronRight size={18} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
