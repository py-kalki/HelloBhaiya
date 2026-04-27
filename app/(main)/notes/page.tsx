import { BookOpen } from "lucide-react"

export default function NotesPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 px-4">
      <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center">
        <BookOpen size={24} className="text-text-secondary" />
      </div>
      <div className="text-center">
        <h1 className="text-text-primary font-bold text-lg">Notes</h1>
        <p className="text-text-secondary text-sm mt-1">Coming soon in Phase 2.</p>
      </div>
    </div>
  )
}
