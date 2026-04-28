import { SkeletonDashboard } from "@/components/dashboard/SkeletonDashboard"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <SkeletonDashboard />
    </div>
  )
}
