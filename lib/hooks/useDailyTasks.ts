"use client"

import { useEffect, useState, useCallback } from "react"
import {
  collection, doc, onSnapshot, addDoc, updateDoc,
  deleteDoc, query, where, Timestamp, orderBy
} from "firebase/firestore"
import { auth, db } from "@/lib/firebase/client"
import { toISTDateString } from "@/lib/dateUtils"

export type Task = {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export function useDailyTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [uid, setUid] = useState<string | null>(null)

  // Today's date in YYYY-MM-DD IST — tasks are bucketed per day in India Standard Time
  const todayKey = toISTDateString()

  // Resolve current user
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUid(user?.uid ?? null)
    })
    return unsub
  }, [])

  // Subscribe to today's tasks in Firestore
  useEffect(() => {
    if (!uid) return

    const ref = collection(db, "users", uid, "dailyTasks")
    const q = query(ref, where("day", "==", todayKey), orderBy("createdAt", "asc"))

    const unsub = onSnapshot(q, (snap) => {
      setTasks(
        snap.docs.map((d) => ({
          id: d.id,
          text: d.data().text as string,
          completed: d.data().completed as boolean,
          createdAt: (d.data().createdAt as Timestamp).toMillis(),
        }))
      )
      setLoading(false)
    })

    return unsub
  }, [uid, todayKey])

  const addTask = useCallback(async (text: string) => {
    if (!uid || !text.trim()) return
    await addDoc(collection(db, "users", uid, "dailyTasks"), {
      text: text.trim(),
      completed: false,
      day: todayKey,
      createdAt: Timestamp.now(),
    })
  }, [uid, todayKey])

  const toggleTask = useCallback(async (id: string, current: boolean) => {
    if (!uid) return
    await updateDoc(doc(db, "users", uid, "dailyTasks", id), {
      completed: !current,
    })
  }, [uid])

  const deleteTask = useCallback(async (id: string) => {
    if (!uid) return
    await deleteDoc(doc(db, "users", uid, "dailyTasks", id))
  }, [uid])

  return { tasks, loading, addTask, toggleTask, deleteTask }
}
