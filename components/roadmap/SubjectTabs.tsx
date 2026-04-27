"use client"

import { useRouter } from "next/navigation"

const SUBJECTS = ["All", "Biology", "Physics", "Chemistry"] as const
type Subject = (typeof SUBJECTS)[number]

interface Props {
  active: Subject | string
}

export function SubjectTabs({ active }: Props) {
  const router = useRouter()

  function handleSelect(subject: Subject) {
    if (subject === "All") {
      router.push("/roadmap")
    } else {
      router.push(`/roadmap/${subject.toLowerCase()}`)
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {SUBJECTS.map((subject) => {
        const isActive =
          subject === "All"
            ? active === "All" || active === ""
            : active.toLowerCase() === subject.toLowerCase()

        return (
          <button
            key={subject}
            onClick={() => handleSelect(subject)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
              isActive
                ? "bg-accent text-background"
                : "bg-surface-2 text-text-secondary border border-border hover:text-text-primary"
            }`}
          >
            {subject}
          </button>
        )
      })}
    </div>
  )
}
