const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

export function toIST(date: Date): Date {
  return new Date(date.getTime() + IST_OFFSET_MS)
}

export function toISTDateString(date: Date = new Date()): string {
  return toIST(date).toISOString().split("T")[0]!
}

export function isToday(dateStr: string): boolean {
  return dateStr === toISTDateString()
}

export function isYesterday(dateStr: string): boolean {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
  return dateStr === toISTDateString(yesterday)
}

export function daysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.floor(Math.abs(b.getTime() - a.getTime()) / msPerDay)
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function formatCountdown(targetDate: Date): { days: number; label: string } {
  const days = Math.max(0, daysBetween(new Date(), targetDate))
  return { days, label: days === 1 ? "1 day" : `${days} days` }
}
