function Bone({ className }: { className?: string }) {
  return <div className={`rounded-xl bg-surface-2 animate-pulse ${className ?? ""}`} />
}

export function PageSkeleton({ variant = "generic" }: { variant?: "generic" | "list" | "form" | "reader" | "quiz" | "timer" }) {
  if (variant === "list") {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-4">
        <Bone className="h-8 w-48" />
        <div className="flex gap-2">
          <Bone className="h-8 w-20" />
          <Bone className="h-8 w-20" />
          <Bone className="h-8 w-20" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Bone key={i} className="h-20" />
        ))}
      </div>
    )
  }
  if (variant === "form") {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-4">
        <Bone className="h-8 w-40" />
        <Bone className="h-32" />
        <Bone className="h-12" />
        <Bone className="h-12" />
        <Bone className="h-12" />
        <Bone className="h-12 w-full" />
      </div>
    )
  }
  if (variant === "reader") {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-3">
        <Bone className="h-10 w-64" />
        <Bone className="h-8 w-full" />
        <Bone className="h-[60vh]" />
      </div>
    )
  }
  if (variant === "quiz") {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <Bone className="h-8 w-24" />
          <Bone className="h-8 w-16" />
        </div>
        <Bone className="h-40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-14" />
        ))}
      </div>
    )
  }
  if (variant === "timer") {
    return (
      <div className="max-w-sm mx-auto px-4 pt-10 space-y-6 flex flex-col items-center">
        <Bone className="h-48 w-48 rounded-full" />
        <Bone className="h-10 w-40" />
        <div className="flex gap-3">
          <Bone className="h-12 w-28" />
          <Bone className="h-12 w-28" />
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 space-y-4">
      <Bone className="h-8 w-48" />
      <Bone className="h-28" />
      <Bone className="h-40" />
      <div className="grid grid-cols-2 gap-3">
        <Bone className="h-20" />
        <Bone className="h-20" />
      </div>
    </div>
  )
}
