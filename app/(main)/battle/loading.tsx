import { PageSkeleton } from "@/components/ui/PageSkeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PageSkeleton variant="quiz" />
    </div>
  )
}
