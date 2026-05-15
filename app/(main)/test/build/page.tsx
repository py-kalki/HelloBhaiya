"use client"

import { useState, useTransition, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Zap, BookOpen, Save, ChevronDown, ChevronUp } from "lucide-react"
import { SubjectChapterSelector } from "@/components/test/builder/SubjectChapterSelector"
import { DifficultySliders } from "@/components/test/builder/DifficultySliders"
import { QuestionTypeSlider } from "@/components/test/builder/QuestionTypeSlider"
import { QuestionCountInput } from "@/components/test/builder/QuestionCountInput"
import { TimerConfig } from "@/components/test/builder/TimerConfig"
import { ModeSelector } from "@/components/test/builder/ModeSelector"
import { SaveTemplateModal } from "@/components/test/builder/SaveTemplateModal"
import { TemplatesList } from "@/components/test/builder/TemplatesList"
import { createTest } from "@/actions/createTest"
import { getSyllabus } from "@/lib/syllabusData"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import type { TestConfig, TestMode } from "@/types/question"
import { Suspense } from "react"

const CURRENT_YEAR = new Date().getFullYear()

function BuildPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { profile } = useUserProfile()
  const syllabus = getSyllabus(profile?.exam ?? "NEET")

  // Pre-select chapter from micro-goal ?chapter= param
  const preChapter = searchParams.get("chapter")
  const preMode = searchParams.get("mode") as TestMode | null

  const [mode, setMode] = useState<TestMode>(preMode ?? "CUSTOM")
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedChapters, setSelectedChapters] = useState<string[]>(
    preChapter ? [preChapter] : [],
  )
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState({ easy: 30, medium: 50, hard: 20 })
  const [numericalPct, setNumericalPct] = useState(0)
  const [questionCount, setQuestionCount] = useState(45)
  const [timerMinutes, setTimerMinutes] = useState<number | null>(68)
  const [pyqYearRange, setPyqYearRange] = useState<[number, number]>([2015, CURRENT_YEAR])

  const [showTemplates, setShowTemplates] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [warning, setWarning] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const isMistakeReplay = mode === "MISTAKE_REPLAY"
  const isRapidFire = mode === "RAPID_FIRE"

  // Rapid fire: lock timer to 30s × question_count
  const effectiveTimer = isRapidFire
    ? Math.ceil((questionCount * 30) / 60)
    : timerMinutes

  const examValue: "NEET" | "JEE_MAINS" | "JEE_ADV" =
    profile?.exam === "JEE_MAINS" || profile?.exam === "JEE_ADV"
      ? profile.exam
      : "NEET"

  const config: TestConfig = {
    exam: examValue,
    subjects: selectedSubjects,
    chapters: selectedChapters,
    topics: selectedTopics,
    difficulty,
    numerical_pct: numericalPct,
    question_count: questionCount,
    timer_minutes: effectiveTimer,
    mode,
    ...(mode === "PYQ" ? { pyq_year_range: pyqYearRange } : {}),
  }

  const canGenerate =
    mode === "MISTAKE_REPLAY" || selectedChapters.length > 0 || selectedSubjects.length > 0 || selectedTopics.length > 0

  function handleSubjectToggle(subject: string) {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject],
    )
  }

  function handleChapterToggle(id: string) {
    setSelectedChapters((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  function handleTopicToggle(topic: string) {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    )
  }

  function handleSelectAllChapters(subjectName: string, chapterIds: string[]) {
    const allSelected = chapterIds.every((id) => selectedChapters.includes(id))
    if (allSelected) {
      setSelectedChapters((prev) => prev.filter((id) => !chapterIds.includes(id)))
    } else {
      setSelectedChapters((prev) => [...new Set([...prev, ...chapterIds])])
      if (!selectedSubjects.includes(subjectName)) {
        setSelectedSubjects((prev) => [...prev, subjectName])
      }
    }
  }

  const applyTemplate = useCallback((tmplConfig: TestConfig) => {
    setMode(tmplConfig.mode)
    setSelectedSubjects(tmplConfig.subjects)
    setSelectedChapters(tmplConfig.chapters)
    setSelectedTopics(tmplConfig.topics || [])
    setDifficulty(tmplConfig.difficulty)
    setNumericalPct(tmplConfig.numerical_pct)
    setQuestionCount(tmplConfig.question_count)
    setTimerMinutes(tmplConfig.timer_minutes)
    if (tmplConfig.pyq_year_range) setPyqYearRange(tmplConfig.pyq_year_range)
    setShowTemplates(false)
  }, [])

  function handleGenerate() {
    setError("")
    setWarning("")
    startTransition(async () => {
      try {
        const result = await createTest(config)
        if (result.warning) setWarning(result.warning)
        router.push(`/test/${result.testId}/take`)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create test. Please try again.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-5 p-4 max-w-2xl mx-auto w-full pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-text-primary font-bold text-lg">Build a Test</h1>
        <button
          type="button"
          onClick={() => setShowTemplates((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-text-secondary border border-border rounded-lg px-3 py-2 min-h-[44px] hover:border-text-secondary transition-colors"
        >
          <BookOpen size={14} />
          Templates
          {showTemplates ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Templates list */}
      {showTemplates && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <TemplatesList onApply={applyTemplate} />
        </div>
      )}

      {/* Mode selector */}
      <section className="flex flex-col gap-3">
        <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
          Test Mode
        </h2>
        <ModeSelector
          value={mode}
          onChange={setMode}
          pyqYearRange={pyqYearRange}
          onPyqYearRangeChange={setPyqYearRange}
        />
      </section>

      {/* Subject & Chapter selector — hidden in Mistake Replay */}
      {!isMistakeReplay && (
        <section className="flex flex-col gap-3">
          <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
            Subjects & Chapters
          </h2>
          <SubjectChapterSelector
            syllabus={syllabus}
            selectedSubjects={selectedSubjects}
            selectedChapters={selectedChapters}
            selectedTopics={selectedTopics}
            onSubjectToggle={handleSubjectToggle}
            onChapterToggle={handleChapterToggle}
            onTopicToggle={handleTopicToggle}
            onSelectAllChapters={handleSelectAllChapters}
          />
        </section>
      )}

      {/* Difficulty sliders — disabled in Mistake Replay */}
      <section className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface">
        <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
          Difficulty Mix
        </h2>
        <DifficultySliders
          value={difficulty}
          onChange={setDifficulty}
          disabled={isMistakeReplay}
        />
      </section>

      {/* Question type slider */}
      <section className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface">
        <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
          Question Type
        </h2>
        <QuestionTypeSlider
          numericalPct={numericalPct}
          onChange={setNumericalPct}
          disabled={isMistakeReplay}
        />
      </section>

      {/* Question count */}
      <section className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface">
        <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
          Number of Questions
        </h2>
        <QuestionCountInput
          value={questionCount}
          onChange={setQuestionCount}
          config={config}
          disabled={isMistakeReplay}
        />
      </section>

      {/* Timer */}
      <section className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface">
        <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
          Timer
        </h2>
        <TimerConfig
          timerMinutes={effectiveTimer}
          questionCount={questionCount}
          onChange={isRapidFire ? () => {} : setTimerMinutes}
          disabled={isRapidFire}
        />
      </section>

      {/* Warnings & Errors */}
      {warning && (
        <p className="text-xs text-warning bg-warning/10 border border-warning/30 rounded-xl px-4 py-3">
          {warning}
        </p>
      )}
      {error && (
        <p className="text-xs text-danger bg-danger/10 border border-danger/30 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Actions — fixed at bottom on mobile */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border flex gap-3 md:static md:bg-transparent md:border-0 md:p-0 md:backdrop-blur-0">
        <button
          type="button"
          onClick={() => setShowSaveModal(true)}
          disabled={!canGenerate || isPending}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-text-secondary text-sm font-semibold transition-colors hover:border-text-secondary disabled:opacity-40 min-h-[44px]"
        >
          <Save size={16} />
          Save
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate || isPending}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-background font-bold text-sm transition-opacity disabled:opacity-40 min-h-[44px]"
        >
          <Zap size={16} />
          {isPending ? "Generating..." : "Generate Test"}
        </button>
      </div>

      {/* Save template modal */}
      {showSaveModal && (
        <SaveTemplateModal
          config={config}
          onClose={() => setShowSaveModal(false)}
          onSaved={() => {}}
        />
      )}
    </div>
  )
}

export default function TestBuildPage() {
  return (
    <Suspense>
      <BuildPageInner />
    </Suspense>
  )
}
