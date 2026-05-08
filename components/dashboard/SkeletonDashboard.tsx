function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-surface border border-border animate-pulse ${className ?? ""}`} />
  )
}

export function SkeletonDashboard() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
      {/* Greeting */}
      <div className="flex flex-col gap-2">
        <div className="h-7 w-56 rounded-lg bg-surface-2 animate-pulse" />
        <div className="h-4 w-72 rounded-lg bg-surface-2 animate-pulse" />
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <SkeletonBox className="lg:col-span-2 h-[280px]" />
        <SkeletonBox className="lg:col-span-3 h-[280px]" />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <SkeletonBox className="lg:col-span-2 h-[320px]" />
        <div className="lg:col-span-3 grid grid-cols-2 gap-3">
          <SkeletonBox className="h-[100px]" />
          <SkeletonBox className="h-[100px]" />
          <SkeletonBox className="h-[100px]" />
          <SkeletonBox className="h-[100px]" />
        </div>
      </div>
    </div>
  )
}
