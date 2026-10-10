import { Clock } from 'lucide-react'
import type { NavItem } from '../../app/navigation'
import { ButtonLink } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { PageHeader } from '../../ui/PageHeader'

export type PlannedNavItem = NavItem & { planned: NonNullable<NavItem['planned']> }

/** An honest placeholder for a section that is not built yet. No fake controls. */
export function PlannedPage({ item }: { item: PlannedNavItem }) {
  const Icon = item.icon
  return (
    <div className="animate-enter">
      <PageHeader title={item.label} />
      <Card>
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
            <Icon size={22} aria-hidden />
          </span>
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-soft px-2.5 py-1 text-xs font-medium text-amber">
              <Clock size={13} aria-hidden /> Not built yet · {item.planned.when}
            </p>
            <p className="mt-3 text-ink-soft">{item.planned.summary}</p>
          </div>
        </div>
      </Card>
      <ButtonLink to="/" variant="ghost" className="mt-4">
        Back to dashboard
      </ButtonLink>
    </div>
  )
}
