import {
  BookOpenText,
  Ear,
  House,
  ChartLine,
  type LucideIcon,
  Mic,
  MessagesSquare,
  Settings,
  Workflow,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Shown in the phone's bottom tab bar (the rest live under "More"). */
  inTabBar: boolean
  /** Present while the section is not built yet — rendered honestly as planned work. */
  planned?: { when: string; summary: string }
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: House, inTabBar: true },
  {
    to: '/speak',
    label: 'Speak',
    icon: Mic,
    inTabBar: true,
    planned: {
      when: 'Phase 1 · step 3',
      summary:
        'Timed speaking practice with live transcription, recording and replay, followed by a review of fillers, repetitions and pace.',
    },
  },
  {
    to: '/thoughts',
    label: 'Train My Thoughts',
    icon: Workflow,
    inTabBar: true,
    planned: {
      when: 'Phase 1 · step 6',
      summary:
        'Answer questions using PREP, Situation → Action → Result and other frameworks, with optional hints and recovery techniques.',
    },
  },
  {
    to: '/progress',
    label: 'Progress',
    icon: ChartLine,
    inTabBar: true,
    planned: {
      when: 'Phase 1 · step 7',
      summary: 'Your session history and trends, built only from sessions you have actually completed.',
    },
  },
  {
    to: '/pronunciation',
    label: 'Pronunciation Lab',
    icon: Ear,
    inTabBar: false,
    planned: {
      when: 'Phase 2',
      summary:
        'L and R tongue placement, minimal pairs (light / right, glass / grass), sentence practice, recording, replay and self-assessment.',
    },
  },
  {
    to: '/vocabulary',
    label: 'Vocabulary',
    icon: BookOpenText,
    inTabBar: false,
    planned: {
      when: 'Phase 2',
      summary: 'Natural expressions by situation, a personal phrase bank and spaced-repetition review.',
    },
  },
  {
    to: '/conversation',
    label: 'Conversation Practice',
    icon: MessagesSquare,
    inTabBar: false,
    planned: {
      when: 'Phase 3',
      summary:
        'Role-play conversations and interview simulations with follow-up questions, reviewed at the end rather than interrupted.',
    },
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: Settings,
    inTabBar: false,
    planned: {
      when: 'Phase 1 · step 7',
      summary: 'Your name, default practice length, transcript storage, AI coaching on/off and deleting your data.',
    },
  },
]

export const TAB_BAR_ITEMS = NAV_ITEMS.filter((item) => item.inTabBar)
export const MORE_ITEMS = NAV_ITEMS.filter((item) => !item.inTabBar)
