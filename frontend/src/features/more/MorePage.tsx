import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MORE_ITEMS } from '../../app/navigation'
import { PageHeader } from '../../ui/PageHeader'

export function MorePage() {
  return (
    <div className="animate-enter">
      <PageHeader title="More" />
      <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
        {MORE_ITEMS.map(({ to, label, icon: Icon, planned }) => (
          <li key={to}>
            <Link to={to} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-sunk">
              <Icon size={20} className="text-accent" aria-hidden />
              <span className="flex-1 font-medium">{label}</span>
              {planned && <span className="text-xs text-ink-faint">{planned.when}</span>}
              <ChevronRight size={18} className="text-ink-faint" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
