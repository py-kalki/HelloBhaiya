import type { Timestamp } from "firebase/firestore"

export type InstitutionPlan = "FREE" | "PRO"

export type Institution = {
  institution_id: string
  name:           string
  admin_uid:      string
  plan:           InstitutionPlan
  stripe_subscription_id: string | null
  created_at:     Timestamp
}

export type ClassRoom = {
  class_id:    string
  name:        string
  join_code:   string
  student_uids: string[]
  created_at:  Timestamp
}

export type ClassStats = {
  classId:       string
  className:     string
  joinCode:      string
  studentCount:  number
  avgAccuracy:   number | null
  avgXpThisWeek: number | null
}

export type StudentSummary = {
  uid:          string
  name:         string
  photo_url:    string
  level:        number
  xp_total:     number
  xp_this_week: number
  streak_current: number
  subject_accuracy: Record<string, number>
}
