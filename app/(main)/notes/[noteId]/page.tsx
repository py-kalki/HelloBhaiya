import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { adminApp } from "@/lib/firebase/admin"
import type { Note } from "@/types/note"
import type { HighlightData } from "@/actions/saveHighlight"
import { CreatorBanner } from "@/components/notes/CreatorBanner"
import { PDFViewer } from "@/components/notes/PDFViewer"
import { RelatedNotes } from "@/components/notes/RelatedNotes"
import { RatingPrompt } from "@/components/notes/RatingPrompt"

async function getUser() {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) redirect("/login")
  try {
    return await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  } catch {
    redirect("/login")
  }
}

interface PageProps {
  params: Promise<{ noteId: string }>
}

export default async function NoteViewerPage({ params }: PageProps) {
  const { noteId } = await params
  const decoded = await getUser()
  const db = getFirestore(adminApp)

  const [noteDoc, relatedSnap, highlightDoc] = await Promise.all([
    db.collection("notes").doc(noteId).get(),
    db.collection("notes").limit(10).get(),
    db
      .collection("users")
      .doc(decoded.uid)
      .collection("notes_highlights")
      .doc(noteId)
      .get(),
  ])

  if (!noteDoc.exists) notFound()

  const note = { ...(noteDoc.data() as Note), note_id: noteId }
  const related = relatedSnap.docs.map((d) => ({
    ...(d.data() as Note),
    note_id: d.id,
  }))
  const highlights: HighlightData[] = highlightDoc.exists
    ? (highlightDoc.data()?.highlights ?? [])
    : []

  // Fire-and-forget: increment view_count
  db.collection("notes").doc(noteId).update({
    view_count: FieldValue.increment(1),
  }).catch(() => {})

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto">
        <CreatorBanner note={note} />

        <div className="px-4 pt-4 space-y-6">
          <div>
            <h1 className="text-lg font-bold text-text-primary">{note.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-text-secondary">{note.subject}</span>
              {note.rating_count > 0 && (
                <>
                  <span className="text-xs text-text-secondary">·</span>
                  <span className="text-xs text-text-secondary">
                    {note.aggregate_rating.toFixed(1)} ★ ({note.rating_count})
                  </span>
                </>
              )}
            </div>
          </div>

          <PDFViewer
            pdfUrl={note.pdf_url}
            noteId={noteId}
            initialHighlights={highlights}
          />

          <RelatedNotes notes={related} currentNoteId={noteId} />
        </div>
      </div>

      <RatingPrompt noteId={noteId} delayMs={30000} />
    </div>
  )
}
