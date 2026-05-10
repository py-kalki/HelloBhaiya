"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { auth, db } from "@/lib/firebase/client"
import { userProfileConverter } from "@/lib/firebase/converter"
import type { UserProfile } from "@/types/student"

export function useUserProfile(initialProfile?: UserProfile | null) {
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile ?? null)
  const [loading, setLoading] = useState(!initialProfile)

  useEffect(() => {
    let unsubFirestore: (() => void) | undefined

    const unsubAuth = auth.onAuthStateChanged((user) => {
      unsubFirestore?.()
      if (!user) {
        // If we have an initialProfile from the server, we might want to keep it
        // but for safety, we respect the client auth state eventually.
        // Let's NOT clear it immediately if we have a server profile, but we will mark loading false
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
