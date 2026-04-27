"use client"

import { useEffect, useState } from "react"
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore"
import { auth, db } from "@/lib/firebase/client"
import type { TestSession } from "@/types/question"

export function useRecentTests() {
  const [tests, setTests] = useState<TestSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubFirestore: (() => void) | undefined

    const unsubAuth = auth.onAuthStateChanged((user) => {
      unsubFirestore?.()
      if (!user) {
        setTests([])
        setLoading(false)
        return
      }
      const q = query(
        collection(db, "users", user.uid, "tests"),
        where("status", "==", "COMPLETED"),
        orderBy("completed_at", "desc"),
        limit(3),
      )
      unsubFirestore = onSnapshot(q, (snap) => {
        setTests(snap.docs.map((d) => d.data() as TestSession))
        setLoading(false)
      })
    })

    return () => {
      unsubAuth()
      unsubFirestore?.()
    }
  }, [])

  return { tests, loading }
}
