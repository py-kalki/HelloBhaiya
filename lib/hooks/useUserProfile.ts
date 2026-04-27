"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { auth, db } from "@/lib/firebase/client"
import { userProfileConverter } from "@/lib/firebase/converter"
import type { UserProfile } from "@/types/student"

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubFirestore: (() => void) | undefined

    const unsubAuth = auth.onAuthStateChanged((user) => {
      unsubFirestore?.()
      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }
      const ref = doc(db, "users", user.uid).withConverter(userProfileConverter)
      unsubFirestore = onSnapshot(ref, (snap) => {
        setProfile(snap.exists() ? snap.data() : null)
        setLoading(false)
      })
    })

    return () => {
      unsubAuth()
      unsubFirestore?.()
    }
  }, [])

  return { profile, loading }
}
