import { type FillerKind, type FillerMatch, findFillers, hesitationFor } from './fillers'
import { MIN_SECONDS_FOR_RATES, measurePace, type Pace } from './pace'
import { findFrequentWords, findRepeatedRuns, type FrequentWord, type RepeatedRun } from './repetition'
import { type Token, tokenize } from './tokenize'

export interface FillerCount {
  filler: string
  kind: FillerKind
  count: number
}

export interface SpeechAnalysis {
  tokens: Token[]
  /** Spoken words, not counting hesitation sounds such as "um". */
  wordCount: number
  durationSeconds: number
  fillers: {
    matches: FillerMatch[]
    total: number
    /** Most frequent first. */
    counts: FillerCount[]
    /** Null when the session is too short for a rate to mean anything. */
    perMinute: number | null
    per100Words: number | null
  }
  repetitions: {
    runs: RepeatedRun[]
    frequentWords: FrequentWord[]
  }
  pace: Pace | null
}

const round1 = (n: number) => Math.round(n * 10) / 10

function countFillers(matches: FillerMatch[]): FillerCount[] {
  const counts = new Map<string, FillerCount>()
  for (const { filler, kind } of matches) {
    const entry = counts.get(filler) ?? { filler, kind, count: 0 }
    entry.count++
    counts.set(filler, entry)
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.filler.localeCompare(b.filler))
}

export function analyzeSpeech(transcript: string, durationSeconds: number): SpeechAnalysis {
  const tokens = tokenize(transcript)
  const wordCount = tokens.filter((t) => !hesitationFor(t.word)).length
  const matches = findFillers(tokens)
  const total = matches.length

  return {
    tokens,
    wordCount,
    durationSeconds,
    fillers: {
      matches,
      total,
      counts: countFillers(matches),
      perMinute: durationSeconds >= MIN_SECONDS_FOR_RATES ? round1((total / durationSeconds) * 60) : null,
      per100Words: wordCount > 0 ? round1((total / wordCount) * 100) : null,
    },
    repetitions: {
      runs: findRepeatedRuns(tokens),
      frequentWords: findFrequentWords(tokens),
    },
    pace: measurePace(wordCount, durationSeconds),
  }
}
