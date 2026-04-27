export type ChapterStatus = "SOLID" | "NEEDS_WORK" | "DANGER_ZONE" | "NOT_STARTED"
export type FilterMode = "ALL" | "DANGER_ZONE" | "NEEDS_REVISION" | "NOT_STARTED"

export type SyllabusChapter = {
  chapter_id: string
  name: string
  subject: string
  unit: string
  topic_count: number
  topics: string[]
}

export type ChapterWithProgress = SyllabusChapter & {
  health: number
  status: ChapterStatus
  lastPracticed: number | null
  needsRevision: boolean
}

export function getChapterStatus(health: number | undefined): ChapterStatus {
  if (health === undefined) return "NOT_STARTED"
  if (health >= 75) return "SOLID"
  if (health >= 50) return "NEEDS_WORK"
  return "DANGER_ZONE"
}
