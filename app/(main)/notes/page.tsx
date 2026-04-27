import { getFirestore } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase/admin"
import type { Note } from "@/types/note"
import { NotesLibrary } from "@/components/notes/NotesLibrary"

type NoteDoc = Note & { note_id: string }

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ chapter?: string; subject?: string }>
}) {
  const { chapter, subject } = await searchParams
  const db = getFirestore(adminApp)

  const snap = await db.collection("notes").orderBy("view_count", "desc").limit(50).get()

  const notes: NoteDoc[] = snap.docs.map((doc) => ({
    ...(doc.data() as Note),
    note_id: doc.id,
  }))

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Notes Library</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {notes.length} curated notes from top creators
          </p>
        </div>
        <NotesLibrary
          notes={notes}
          initialChapter={chapter}
          initialSubject={subject}
        />
      </div>
    </div>
  )
}
