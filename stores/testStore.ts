import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Question } from "@/types/question"

type TestStore = {
  testId: string | null
  questions: Question[]
  answers: Record<string, string | number>
  flagged: string[]
  currentIndex: number
  timeRemainingSeconds: number | null
  pausesUsed: number
  isPaused: boolean
  status: "idle" | "active" | "paused" | "submitted"

  // Actions
  initTest: (testId: string, questions: Question[], timerSeconds: number | null) => void
  setAnswer: (questionId: string, answer: string | number) => void
  toggleFlag: (questionId: string) => void
  navigate: (index: number) => void
  pause: () => void
  resume: () => void
  tick: () => void
  reset: () => void
}

export const useTestStore = create<TestStore>()(
  persist(
    (set, _get) => ({
      testId:               null,
      questions:            [],
      answers:              {},
      flagged:              [],
      currentIndex:         0,
      timeRemainingSeconds: null,
      pausesUsed:           0,
      isPaused:             false,
      status:               "idle",

      initTest: (testId, questions, timerSeconds) =>
        set({
          testId,
          questions,
          answers:              {},
          flagged:              [],
          currentIndex:         0,
          timeRemainingSeconds: timerSeconds,
          pausesUsed:           0,
          isPaused:             false,
          status:               "active",
        }),

      setAnswer: (questionId, answer) =>
        set((s) => ({ answers: { ...s.answers, [questionId]: answer } })),

      toggleFlag: (questionId) =>
        set((s) => ({
          flagged: s.flagged.includes(questionId)
            ? s.flagged.filter((id) => id !== questionId)
            : [...s.flagged, questionId],
        })),

      navigate: (index) => set({ currentIndex: index }),

      pause: () =>
        set((s) => {
          if (s.pausesUsed >= 2 || s.isPaused) return s
          return { isPaused: true, pausesUsed: s.pausesUsed + 1, status: "paused" }
        }),

      resume: () => set({ isPaused: false, status: "active" }),

      tick: () =>
        set((s) => {
          if (s.timeRemainingSeconds === null || s.isPaused) return s
          const next = s.timeRemainingSeconds - 1
          return { timeRemainingSeconds: next >= 0 ? next : 0 }
        }),

      reset: () =>
        set({
          testId:               null,
          questions:            [],
          answers:              {},
          flagged:              [],
          currentIndex:         0,
          timeRemainingSeconds: null,
          pausesUsed:           0,
          isPaused:             false,
          status:               "idle",
        }),
    }),
    {
      name: "hellobhaiya-active-test",
      // Only persist fields needed to restore mid-test state
      partialize: (s) => ({
        testId:               s.testId,
        answers:              s.answers,
        flagged:              s.flagged,
        currentIndex:         s.currentIndex,
        timeRemainingSeconds: s.timeRemainingSeconds,
        pausesUsed:           s.pausesUsed,
        status:               s.status,
      }),
    }
  )
)
