import { describe, expect, it } from 'vitest'
import { greetingFor } from './greeting'
import { promptForDate, SPEAKING_PROMPTS } from './prompts'

describe('promptForDate', () => {
  it('returns the same prompt throughout one day', () => {
    const morning = new Date(2026, 9, 10, 6, 0)
    const night = new Date(2026, 9, 10, 23, 59)
    expect(promptForDate(morning).id).toBe(promptForDate(night).id)
  })

  it('moves to the next prompt on the next day', () => {
    const today = promptForDate(new Date(2026, 9, 10, 12))
    const tomorrow = promptForDate(new Date(2026, 9, 11, 12))
    const i = SPEAKING_PROMPTS.indexOf(today)
    expect(tomorrow).toBe(SPEAKING_PROMPTS[(i + 1) % SPEAKING_PROMPTS.length])
  })
})

describe('greetingFor', () => {
  it.each([
    [3, 'Good evening'],
    [8, 'Good morning'],
    [13, 'Good afternoon'],
    [20, 'Good evening'],
  ])('at %i:00 says %s', (hour, expected) => {
    expect(greetingFor(new Date(2026, 9, 10, hour))).toBe(expected)
  })
})
