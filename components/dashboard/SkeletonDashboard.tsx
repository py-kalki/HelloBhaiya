function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={`rounded-xl bg-surface-2 animate-pulse ${className ?? ""}`} />
  )
}

export function SkeletonDashboard() {
  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
      <SkeletonBox className="h-24" />
      <SkeletonBox className="h-28" />
      <SkeletonBox className="h-56" />
      <div className="grid grid-cols-2 gap-3">
        <SkeletonBox className="h-20" />
        <SkeletonBox className="h-20" />
        <SkeletonBox className="h-20" />
        <SkeletonBox className="h-20" />
      </div>
    </div>
  )
}
