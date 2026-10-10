import { HABIT_WORDS, hesitationFor } from './fillers'
import type { Token } from './tokenize'

/** A word or short phrase said again straight away: "I I think", "we went, um, we went". */
export interface RepeatedRun {
  phrase: string
  /** How many times in a row it was said (2 or more). */
  times: number
  /** Token index of the first word, and one past the last. */
  start: number
  end: number
}

export interface FrequentWord {
  word: string
  count: number
}

const MAX_PHRASE_WORDS = 3
const FREQUENT_MIN_COUNT = 3
const FREQUENT_LIMIT = 5

// Doubles that are normal speech ("I know that that works", "very very good", "no no").
const NATURAL_DOUBLES = new Set(['that', 'had', 'very', 'really', 'so', 'no', 'yes', 'yeah', 'bye', 'ha'])

// Grammar words. Crutch words such as "just", "really" and "thing" are left in on purpose: they are worth noticing.
const FUNCTION_WORDS = new Set(
  (
    'a about above after again against all am an and any are as at be because been before being below between both ' +
    'but by can could did do does doing down during each few for from further had has have having he her here hers ' +
    'herself him himself his how i if in into is it its itself me more most my myself no nor not now of off on once ' +
    'only or other our ours ourselves out over own same she should some such than that the their theirs them ' +
    'themselves then there these they this those through to too under until up was we were what when where which ' +
    'while who whom why will with would you your yours yourself yourselves ' +
    "i'm i've i'll i'd you're you've you'll you'd he's she's it's we're we've we'll we'd they're they've they'll " +
    "they'd that's there's what's let's don't doesn't didn't isn't aren't wasn't weren't won't wouldn't can't " +
    "couldn't shouldn't haven't hasn't hadn't oh okay ok yes yeah"
  ).split(' '),
)

function sameWords(words: string[], a: number, b: number, n: number): boolean {
  for (let k = 0; k < n; k++) if (words[a + k] !== words[b + k]) return false
  return true
}

/** Back-to-back repeats. Hesitation sounds are skipped, so "I, um, I" still counts as a restart. */
export function findRepeatedRuns(tokens: Token[]): RepeatedRun[] {
  const positions = tokens.flatMap((t, i) => (hesitationFor(t.word) ? [] : [i]))
  const words = positions.map((i) => tokens[i].word)
  const runs: RepeatedRun[] = []

  for (let i = 0; i < words.length; ) {
    let advanced = false
    // Shortest phrase first, so "the the the" is one word said three times rather than a two-word phrase.
    for (let n = 1; n <= MAX_PHRASE_WORDS && !advanced; n++) {
      if (n === 1 && NATURAL_DOUBLES.has(words[i])) continue
      let times = 1
      while (i + (times + 1) * n <= words.length && sameWords(words, i, i + times * n, n)) times++
      if (times < 2) continue
      runs.push({
        phrase: words.slice(i, i + n).join(' '),
        times,
        start: positions[i],
        end: positions[i + times * n - 1] + 1,
      })
      i += times * n
      advanced = true
    }
    if (!advanced) i++
  }
  return runs
}

/** Content words said several times. Topic words will appear here too, so this is shown as information. */
export function findFrequentWords(tokens: Token[]): FrequentWord[] {
  const counts = new Map<string, number>()
  for (const { word } of tokens) {
    if (FUNCTION_WORDS.has(word) || HABIT_WORDS.has(word) || hesitationFor(word) || /^\d+$/.test(word)) continue
    counts.set(word, (counts.get(word) ?? 0) + 1)
  }
  return [...counts]
    .filter(([, count]) => count >= FREQUENT_MIN_COUNT)
    .sort(([a, x], [b, y]) => y - x || a.localeCompare(b))
    .slice(0, FREQUENT_LIMIT)
    .map(([word, count]) => ({ word, count }))
}
