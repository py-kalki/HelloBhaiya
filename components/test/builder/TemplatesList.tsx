"use client"

import { useEffect, useState } from "react"
import { BookTemplate, Clock } from "lucide-react"
import type { SavedTemplate } from "@/actions/saveTemplate"
import type { TestConfig } from "@/types/question"

type Props = {
  onApply: (config: TestConfig) => void
}

export function TemplatesList({ onApply }: Props) {
  const [templates, setTemplates] = useState<SavedTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data: SavedTemplate[]) => setTemplates(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-surface-2 animate-pulse" />
        ))}
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <p className="text-xs text-text-secondary text-center py-4">
        No saved templates yet. Configure a test and tap &quot;Save Template&quot;.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {templates.map((tmpl) => (
        <button
          key={tmpl.template_id}
          type="button"
          onClick={() => onApply(tmpl.config)}
          className="flex items-center gap-3 w-full p-3 rounded-xl border border-border bg-surface hover:bg-surface-2 transition-colors text-left min-h-[44px]"
        >
          <BookTemplate size={16} className="text-text-secondary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-primary truncate">{tmpl.name}</p>
            <p className="text-xs text-text-secondary">
              {tmpl.config.question_count}q · {tmpl.config.mode}
              {tmpl.config.subjects.length > 0 && ` · ${tmpl.config.subjects.join(", ")}`}
            </p>
          </div>
          <Clock size={12} className="text-text-secondary shrink-0" />
        </button>
      ))}
    </div>
  )
}
