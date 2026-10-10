export type PromptCategory = 'personal' | 'opinion' | 'explain' | 'story' | 'professional'

export interface SpeakingPrompt {
  id: string
  text: string
  category: PromptCategory
}

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  { id: 'about-yourself', text: 'Tell me about yourself.', category: 'personal' },
  {
    id: 'change-community',
    text: 'What is something you would like to change about your community?',
    category: 'opinion',
  },
  { id: 'recent-decision', text: 'Explain a decision you recently made.', category: 'explain' },
  { id: 'good-leader', text: 'What do you think makes someone a good leader?', category: 'opinion' },
  {
    id: 'problem-solved',
    text: 'Describe a problem you solved and how you approached it.',
    category: 'professional',
  },
  {
    id: 'technical-concept',
    text: 'Explain a technical concept to someone without a technical background.',
    category: 'explain',
  },
  {
    id: 'unexpected-story',
    text: 'Tell a story about something unexpected that happened to you.',
    category: 'story',
  },
]

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Same prompt all day, a different one tomorrow. Uses local calendar days. */
export function promptForDate(date: Date, prompts: SpeakingPrompt[] = SPEAKING_PROMPTS): SpeakingPrompt {
  const localMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  const dayNumber = Math.floor(localMidnight / MS_PER_DAY)
  return prompts[dayNumber % prompts.length]
}
