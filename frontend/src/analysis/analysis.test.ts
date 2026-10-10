import { describe, expect, it } from 'vitest'
import { analyzeSpeech } from './analyze'
import { findFillers } from './fillers'
import { measurePace } from './pace'
import { findFrequentWords, findRepeatedRuns } from './repetition'
import { tokenize } from './tokenize'

const fillersIn = (text: string) => findFillers(tokenize(text)).map((m) => m.filler)
const runsIn = (text: string) => findRepeatedRuns(tokenize(text)).map(({ phrase, times }) => ({ phrase, times }))

describe('tokenize', () => {
  it('keeps contractions and hyphenated words whole and records offsets', () => {
    const text = 'Well, I don’t — re-think it.'
    const tokens = tokenize(text)
    expect(tokens.map((t) => t.word)).toEqual(['well', 'i', "don't", 're-think', 'it'])
    expect(text.slice(tokens[2].start, tokens[2].end)).toBe('don’t')
  })
})

describe('findFillers', () => {
  it('normalises hesitation sounds', () => {
    expect(fillersIn('Umm, uh, erm, hmm, ahh')).toEqual(['um', 'uh', 'er', 'hmm', 'ah'])
  })

  it('counts "like" used as padding but not as a verb or comparison', () => {
    expect(fillersIn('and like the bus was late')).toEqual(['like'])
    expect(fillersIn('it was like amazing')).toEqual(['like'])
    expect(fillersIn("it's just like that")).toEqual(['like'])
    expect(fillersIn('I like tea')).toEqual([])
    expect(fillersIn("I'd like to go")).toEqual([])
    expect(fillersIn('it looks like rain')).toEqual([])
  })

  it('tells "you know" as padding from real knowing', () => {
    expect(fillersIn('it was, you know, hard')).toEqual(['you know'])
    expect(fillersIn('you know the thing is')).toEqual(['you know'])
    expect(fillersIn('do you know the way')).toEqual([])
    expect(fillersIn('you know what I did')).toEqual([])
  })

  it('tells "kind of" as a hedge from "a kind of"', () => {
    expect(fillersIn('it was kind of hard')).toEqual(['kind of'])
    expect(fillersIn('a kind of fruit')).toEqual([])
    expect(fillersIn('what sort of person')).toEqual([])
  })

  it('handles "I mean" and habit adverbs', () => {
    expect(fillersIn('I mean, basically it actually works')).toEqual(['i mean', 'basically', 'actually'])
    expect(fillersIn('I mean it')).toEqual([])
  })

  it('reports token positions', () => {
    expect(findFillers(tokenize('so um you know yes'))).toEqual([
      { filler: 'um', kind: 'hesitation', start: 1, end: 2 },
      { filler: 'you know', kind: 'habit', start: 2, end: 4 },
    ])
  })
})

describe('findRepeatedRuns', () => {
  it('finds stuttered words and repeated phrases', () => {
    expect(runsIn('I I think the the the plan works')).toEqual([
      { phrase: 'i', times: 2 },
      { phrase: 'the', times: 3 },
    ])
    expect(runsIn('I think I think we should go')).toEqual([{ phrase: 'i think', times: 2 }])
  })

  it('sees through hesitations to the restart', () => {
    const tokens = tokenize('we went, um, we went home')
    expect(findRepeatedRuns(tokens)).toEqual([{ phrase: 'we went', times: 2, start: 0, end: 5 }])
  })

  it('ignores doubles that are normal speech', () => {
    expect(runsIn('I know that that is very very true')).toEqual([])
  })
})

describe('findFrequentWords', () => {
  it('lists content words said three or more times, most frequent first', () => {
    const text = 'the team, the team really, really helped the team. really just just just a team'
    expect(findFrequentWords(tokenize(text))).toEqual([
      { word: 'team', count: 4 },
      { word: 'just', count: 3 },
      { word: 'really', count: 3 },
    ])
  })
})

describe('measurePace', () => {
  it('bands words per minute', () => {
    expect(measurePace(100, 60)).toEqual({ wordsPerMinute: 100, band: 'slow' })
    expect(measurePace(140, 60)).toEqual({ wordsPerMinute: 140, band: 'comfortable' })
    expect(measurePace(90, 30)).toEqual({ wordsPerMinute: 180, band: 'fast' })
  })

  it('gives no pace for very short or silent sessions', () => {
    expect(measurePace(30, 10)).toBeNull()
    expect(measurePace(0, 60)).toBeNull()
  })
})

describe('analyzeSpeech', () => {
  it('combines the analyses and leaves hesitations out of the word count', () => {
    const result = analyzeSpeech('Um, so I think, like, um, we should start', 30)
    expect(result.wordCount).toBe(7)
    expect(result.fillers.total).toBe(3)
    expect(result.fillers.counts).toEqual([
      { filler: 'um', kind: 'hesitation', count: 2 },
      { filler: 'like', kind: 'habit', count: 1 },
    ])
    expect(result.fillers.perMinute).toBe(6)
    expect(result.fillers.per100Words).toBe(42.9)
    expect(result.pace).toEqual({ wordsPerMinute: 14, band: 'slow' })
  })

  it('returns empty results for an empty transcript', () => {
    const result = analyzeSpeech('', 5)
    expect(result.wordCount).toBe(0)
    expect(result.fillers.perMinute).toBeNull()
    expect(result.fillers.per100Words).toBeNull()
    expect(result.pace).toBeNull()
  })
})
