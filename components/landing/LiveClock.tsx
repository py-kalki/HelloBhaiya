"use client"

import { useEffect, useState } from "react"

const FMT = new Intl.DateTimeFormat("en-GB", {
  timeZone:    "Asia/Kolkata",
  hour:        "2-digit",
  minute:      "2-digit",
  second:      "2-digit",
  hour12:      false,
})

export default function LiveClock() {
  const [time, setTime] = useState<string>("")

  useEffect(() => {
    const update = () => setTime(FMT.format(new Date()) + " IST")
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) return null

  return (
    <span className="font-mono text-[12px]" style={{ color: "#333333" }}>
      {time}
    </span>
  )
}
