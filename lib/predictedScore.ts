const NEET_SUBJECT_MAX: Record<string, number> = {
  Biology:   360,
  Physics:   180,
  Chemistry: 180,
}

/**
 * Returns [low, high] predicted NEET score range
 * based on rolling subject accuracy percentages.
 */
export function predictNEETScore(
  subjectAccuracy: Record<string, number>
): [number, number] {
  let predicted = 0

  for (const [subject, accuracy] of Object.entries(subjectAccuracy)) {
    const max = NEET_SUBJECT_MAX[subject] ?? 0
    if (max === 0) continue

    const attemptRate   = 0.8
    const accuracyRate  = accuracy / 100
    const attempted     = max * attemptRate

    // +4 correct, -1 wrong
    const correct = attempted * accuracyRate
    const wrong   = attempted * (1 - accuracyRate)
    predicted += correct * 4 - wrong * 1
  }

  const normalised = Math.max(0, Math.min(720, predicted))
  return [Math.round(normalised * 0.92), Math.round(normalised * 1.08)]
}
