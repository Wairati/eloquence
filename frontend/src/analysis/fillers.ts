import type { Token } from './tokenize'

/** "hesitation" = sounds like um and uh; "habit" = real words used as verbal padding. */
export type FillerKind = 'hesitation' | 'habit'

export interface FillerMatch {
  /** Normalised filler, such as "um" or "you know". */
  filler: string
  kind: FillerKind
  /** Token index of the first word, and one past the last. */
  start: number
  end: number
}

const HESITATIONS: [RegExp, string][] = [
  [/^u+h*m+$/, 'um'], // um, umm, uhm
  [/^u+h+$/, 'uh'],
  [/^e+r+m*$/, 'er'], // er, err, erm
  [/^a+h+$/, 'ah'],
  [/^(?:h+m+|m{2,})$/, 'hmm'], // hm, hmm, mm
  [/^e+h+$/, 'eh'],
]

export function hesitationFor(word: string): string | undefined {
  return HESITATIONS.find(([pattern]) => pattern.test(word))?.[1]
}

interface HabitRule {
  words: string[]
  /** True when this occurrence is ordinary language ("I like tea"), not padding. */
  isLiteral?: (before: string, after: string) => boolean
}

const set = (words: string) => new Set(words.split(' '))

// Transcripts from speech recognition have little punctuation, so these rules look at neighbouring words instead.
// They lean towards counting: only clear verb and comparison uses ("I like tea", "looks like rain") are left out,
// so "it was like, amazing" and "you know, the thing is" are flagged.
const LIKE_LITERAL_BEFORE = set(
  "i you we they he she i'd you'd we'd they'd he'd she'd would don't doesn't didn't do does did to really also " +
    'still not never always look looks looked seem seems seemed sound sounds sounded feel feels felt something ' +
    'more much things people stuff anything nothing',
)
const YOU_KNOW_LITERAL_BEFORE = set("do did don't didn't if what as whether how would will")
const YOU_KNOW_LITERAL_AFTER = set('what how why where who when him her them me it about')
const I_MEAN_LITERAL_BEFORE = set('what which that')
const I_MEAN_LITERAL_AFTER = set('it that what to you')
const KIND_OF_LITERAL_BEFORE = set(
  'a what this that the some any every one which same different other these those all no my your our their his her its',
)

const HABIT_RULES: HabitRule[] = [
  { words: ['you', 'know'], isLiteral: (b, a) => YOU_KNOW_LITERAL_BEFORE.has(b) || YOU_KNOW_LITERAL_AFTER.has(a) },
  { words: ['i', 'mean'], isLiteral: (b, a) => I_MEAN_LITERAL_BEFORE.has(b) || I_MEAN_LITERAL_AFTER.has(a) },
  { words: ['kind', 'of'], isLiteral: (b) => KIND_OF_LITERAL_BEFORE.has(b) },
  { words: ['sort', 'of'], isLiteral: (b) => KIND_OF_LITERAL_BEFORE.has(b) },
  { words: ['like'], isLiteral: (b) => LIKE_LITERAL_BEFORE.has(b) },
  { words: ['basically'] },
  { words: ['actually'] },
  { words: ['literally'] },
  { words: ['honestly'] },
]

/** Single words that are only ever counted as fillers, so other analyses can leave them out. */
export const HABIT_WORDS = new Set(HABIT_RULES.filter((r) => !r.isLiteral).flatMap((r) => r.words))

function matchHabit(words: string[], i: number): HabitRule | undefined {
  return HABIT_RULES.find(
    (rule) =>
      rule.words.every((w, k) => words[i + k] === w) &&
      !rule.isLiteral?.(words[i - 1] ?? '', words[i + rule.words.length] ?? ''),
  )
}

export function findFillers(tokens: Token[]): FillerMatch[] {
  const words = tokens.map((t) => t.word)
  const matches: FillerMatch[] = []
  for (let i = 0; i < words.length; ) {
    const hesitation = hesitationFor(words[i])
    if (hesitation) {
      matches.push({ filler: hesitation, kind: 'hesitation', start: i, end: i + 1 })
      i += 1
      continue
    }
    const habit = matchHabit(words, i)
    if (habit) {
      matches.push({ filler: habit.words.join(' '), kind: 'habit', start: i, end: i + habit.words.length })
      i += habit.words.length
      continue
    }
    i += 1
  }
  return matches
}
