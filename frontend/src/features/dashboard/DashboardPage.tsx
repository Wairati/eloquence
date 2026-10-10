import { ArrowRight, ChartLine, Mic } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NAV_ITEMS } from '../../app/navigation'
import { greetingFor } from '../../content/greeting'
import { promptForDate } from '../../content/prompts'
import { Card, Eyebrow } from '../../ui/Card'

const CONTINUE_LEARNING = ['/thoughts', '/pronunciation', '/vocabulary']

export function DashboardPage() {
  const [now] = useState(() => new Date())
  const challenge = promptForDate(now)

  return (
    <div className="animate-enter space-y-5">
      <header className="mb-2">
        <p className="text-sm text-ink-faint md:hidden">Eloquence</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{greetingFor(now)}.</h1>
        <p className="mt-1 text-ink-soft">A few minutes of speaking today is enough.</p>
      </header>

      <Card className="border-transparent! bg-hero! text-on-hero">
        <p className="text-xs font-semibold tracking-[0.12em] uppercase opacity-75">Today’s speaking challenge</p>
        <p className="mt-3 font-display text-2xl leading-snug sm:text-[1.7rem]">“{challenge.text}”</p>
        <p className="mt-3 text-sm opacity-80">Speak without a script. Pauses are allowed — finish your thought.</p>
        <Link
          to="/speak"
          className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-on-hero px-5 font-medium text-hero transition-opacity hover:opacity-90"
        >
          <Mic size={18} aria-hidden /> Start speaking practice
        </Link>
      </Card>

      <Card>
        <Eyebrow>Your progress</Eyebrow>
        <div className="mt-4 flex items-start gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-surface-sunk text-ink-faint">
            <ChartLine size={20} aria-hidden />
          </span>
          <div>
            <p className="font-medium">No sessions yet</p>
            <p className="mt-1 text-sm text-ink-soft">
              Your streak, filler-word trends and speaking pace will appear here after your first practice session. Every
              number comes from sessions you have actually completed.
            </p>
          </div>
        </div>
      </Card>

      <section>
        <h2 className="mb-3 px-1 text-sm font-semibold text-ink-soft">Continue learning</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {NAV_ITEMS.filter((item) => CONTINUE_LEARNING.includes(item.to)).map(({ to, label, icon: Icon, planned }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:bg-surface-sunk sm:flex-col sm:items-start"
            >
              <Icon size={20} className="text-accent" aria-hidden />
              <span className="flex-1">
                <span className="block text-sm font-medium">{label}</span>
                {planned && <span className="block text-xs text-ink-faint">{planned.when}</span>}
              </span>
              <ArrowRight size={16} className="text-ink-faint sm:hidden" aria-hidden />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
