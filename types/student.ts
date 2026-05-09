import type { Timestamp } from "firebase/firestore"

export type Exam = "NEET" | "JEE_MAINS" | "JEE_ADV" | "OTHER"
export type PrepLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"

export type Highlight = {
  page: number
  range: { start: number; end: number }
  colour: "yellow" | "green" | "pink"
  created_at: Timestamp
}

export type MarkingScheme = {
  correct: number
  wrong: number
  unattempted: number
}

export type UserProfile = {
  uid: string
  email: string
  name: string
  photo_url: string
  exam: Exam
  target_date: Timestamp
  prep_level: PrepLevel
  level: number
  xp_total: number
  xp_this_week: number
  streak_current: number
  streak_max: number
  streak_freezes: number
  last_active: Timestamp
  chapter_health: Record<string, number>
  subject_accuracy: Record<string, number>
  wrong_questions: string[]
  notes_highlights: Record<string, Highlight[]>
  weak_subjects: string[]
  onboarding_complete: boolean
  goal_refreshes_today: number
  goal_refresh_date: Timestamp
  city: string
  invite_code: string
  friend_codes: string[]
  created_at: Timestamp
  last_focus_module?: {
    subject: string
    topic: string
    type: string
    progress: number
    link: string
    updated_at: Timestamp
  }
}

/** Serializable version of UserProfile — use when passing from Server to Client components. */
export type PlainUserProfile = Omit<
  UserProfile,
  "target_date" | "last_active" | "goal_refresh_date" | "created_at" | "notes_highlights"
> & {
  target_date: number      // ms since epoch
  last_active: number
  goal_refresh_date: number
  created_at: number
  last_focus_module?: {
    subject: string
    topic: string
    type: string
    progress: number
    link: string
    updated_at: number
  }
}

export type DailyGoal = {
  date: string
  text: string
  subject: string
  chapter_id: string
  target: number
  done: number
  complete: boolean
  refreshes_used: number
}

export type ActivityLog = {
  id: string
  user_id: string
  title: string
  desc: string
  type: "test" | "study" | "achievement" | "goal"
  created_at: Timestamp
}

export type StudySession = {
  id: string
  user_id: string
  duration_seconds: number
  mode: "focus" | "break"
  created_at: Timestamp
}
