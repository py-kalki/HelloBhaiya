import type { Timestamp } from "firebase/firestore"

export type NoteType = "HANDWRITTEN" | "TYPED"

export type Note = {
  note_id: string
  title: string
  subject: string
  chapter_id: string
  type: NoteType
  creator_name: string
  creator_handle: string
  source_url: string
  pdf_url: string
  thumbnail_url: string
  aggregate_rating: number
  rating_count: number
  view_count: number
  upload_date: Timestamp
}

export type NoteRating = {
  rating: number
  created_at: Timestamp
}
