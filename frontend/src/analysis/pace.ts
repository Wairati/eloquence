export type PaceBand = 'slow' | 'comfortable' | 'fast'

export interface Pace {
  wordsPerMinute: number
  band: PaceBand
}

/** Below this, a words-per-minute figure says more about the start and the end than about the speaker. */
export const MIN_SECONDS_FOR_RATES = 15

// Conversational speech usually falls around 120–160 words per minute.
const SLOW_BELOW = 110
const FAST_ABOVE = 170

export function measurePace(wordCount: number, durationSeconds: number): Pace | null {
  if (durationSeconds < MIN_SECONDS_FOR_RATES || wordCount === 0) return null
  const wordsPerMinute = Math.round((wordCount / durationSeconds) * 60)
  const band = wordsPerMinute < SLOW_BELOW ? 'slow' : wordsPerMinute > FAST_ABOVE ? 'fast' : 'comfortable'
  return { wordsPerMinute, band }
}
