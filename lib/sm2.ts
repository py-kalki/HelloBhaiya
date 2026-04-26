import type { SM2Card } from "@/types/question"

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function updateSM2(card: SM2Card, accuracy: number): SM2Card {
  // Accuracy < 60% — reset
  if (accuracy < 60) {
    return {
      interval: 1,
      ease_factor: Math.max(1.3, card.ease_factor - 0.2),
      repetitions: 0,
      next_review: addDays(new Date(), 1),
    }
  }

  // Accuracy 60–80% — hold interval
  if (accuracy < 80) {
    return {
      ...card,
      next_review: addDays(new Date(), card.interval),
    }
  }

  // Accuracy >= 80% — advance
  const newInterval =
    card.repetitions === 0 ? 1
    : card.repetitions === 1 ? 6
    : Math.round(card.interval * card.ease_factor)

  // q=5 performance rating maps to ease factor improvement
  const newEase = Math.max(1.3, card.ease_factor + 0.1)

  return {
    interval: newInterval,
    ease_factor: newEase,
    repetitions: card.repetitions + 1,
    next_review: addDays(new Date(), newInterval),
  }
}

export function isOverdue(card: SM2Card): boolean {
  return new Date() >= card.next_review
}

export function urgencyScore(card: SM2Card, accuracy: number): number {
  const daysOverdue = Math.max(
    0,
    (Date.now() - card.next_review.getTime()) / (1000 * 60 * 60 * 24)
  )
  return (1 - accuracy / 100) * daysOverdue
}
