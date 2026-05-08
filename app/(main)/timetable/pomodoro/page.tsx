import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PomodoroTimer } from "@/components/timetable/PomodoroTimer"

interface PageProps {
  searchParams: Promise<{ task?: string; label?: string }>
}

export default async function PomodoroPage({ searchParams }: PageProps) {
  const { task, label } = await searchParams

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-6">
        <Link
          href="/timetable"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors min-h-[44px]"
        >
          <ArrowLeft size={16} />
          Back to Timetable
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
        <PomodoroTimer
          taskId={task ?? null}
          taskLabel={label ? decodeURIComponent(label) : "Focus Session"}
        />
      </div>
    </div>
  )
}
