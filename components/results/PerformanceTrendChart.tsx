"use client"

import dynamic from "next/dynamic"

const PerformanceTrendChartInner = dynamic(
  () => import("./PerformanceTrendChartInner"),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 w-full rounded-xl bg-surface-2 animate-pulse" />
    ),
  },
)

type DataPoint = {
  label: string
  accuracy: number
}

type Props = {
  data: DataPoint[]
}

export function PerformanceTrendChart({ data }: Props) {
  if (data.length < 2) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider">
        Accuracy Trend (last {data.length} tests)
      </p>
      <div className="scroll-x w-full">
        <div className="min-w-[260px]">
          <PerformanceTrendChartInner data={data} />
        </div>
      </div>
    </div>
  )
}
