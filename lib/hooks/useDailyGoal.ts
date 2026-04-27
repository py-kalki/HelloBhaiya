"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { auth, db } from "@/lib/firebase/client"
import { dailyGoalConverter } from "@/lib/firebase/converter"
import type { DailyGoal } from "@/types/student"

export function useDailyGoal() {
  const [goal, setGoal] = useState<DailyGoal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubFirestore: (() => void) | undefined

    const unsubAuth = auth.onAuthStateChanged((user) => {
      unsubFirestore?.()
      if (!user) {
        setGoal(null)
        setLoading(false)
        return
      }
      const ref = doc(db, "users", user.uid, "dailyGoal", "current").withConverter(
        dailyGoalConverter,
      )
      unsubFirestore = onSnapshot(ref, (snap) => {
        setGoal(snap.exists() ? snap.data() : null)
        setLoading(false)
      })
    })

    return () => {
      unsubAuth()
      unsubFirestore?.()
    }
  }, [])

  return { goal, loading }
}
