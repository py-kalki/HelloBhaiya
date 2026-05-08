"use client"

import dynamic from "next/dynamic"

export const SubjectAccuracyChart = dynamic(
  () => import("./SubjectAccuracyChart").then((m) => ({ default: m.SubjectAccuracyChart })),
  { 
    ssr: false,
    loading: () => <div className="h-[220px] w-full animate-pulse bg-white/5 rounded-xl" />
  }
)
