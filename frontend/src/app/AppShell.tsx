import { Ellipsis } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { MORE_ITEMS, NAV_ITEMS, TAB_BAR_ITEMS } from './navigation'

const TAB_LABELS: Record<string, string> = { '/': 'Home', '/thoughts': 'Thoughts' }

export function AppShell() {
  return (
    <div className="min-h-dvh md:flex">
      <Sidebar />
      <main className="mx-auto w-full max-w-3xl px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-28 sm:px-6 md:pt-10 md:pb-12">
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}

/** Desktop and tablet: all eight sections in a quiet left rail. */
function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-surface px-4 py-8 md:flex">
      <div className="mb-8 px-3">
        <p className="font-display text-2xl font-semibold tracking-tight">Eloquence</p>
        <p className="mt-0.5 text-sm text-ink-faint">Think clearly. Speak confidently.</p>
      </div>
      <nav aria-label="Main" className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-accent-soft text-accent' : 'text-ink-soft hover:bg-surface-sunk hover:text-ink'
              }`
            }
          >
            <Icon size={18} aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

/** Phone: four primary tabs plus "More". Speak is the visual centre of gravity. */
function TabBar() {
  const { pathname } = useLocation()
  const moreActive = pathname === '/more' || MORE_ITEMS.some((item) => pathname.startsWith(item.to))
  const tabClass = (active: boolean) =>
    `flex flex-1 flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-medium transition-colors ${
      active ? 'text-accent' : 'text-ink-faint'
    }`

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      {TAB_BAR_ITEMS.map(({ to, label, icon: Icon }) =>
        to === '/speak' ? (
          <NavLink key={to} to={to} aria-label={label} className="flex flex-1 flex-col items-center pt-1.5 pb-2">
            {({ isActive }) => (
              <span
                className={`grid size-11 place-items-center rounded-full text-on-accent shadow-sm transition-colors ${
                  isActive ? 'bg-accent-hover' : 'bg-accent'
                }`}
              >
                <Icon size={20} aria-hidden />
              </span>
            )}
          </NavLink>
        ) : (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => tabClass(isActive)}>
            <Icon size={21} aria-hidden />
            {TAB_LABELS[to] ?? label}
          </NavLink>
        ),
      )}
      <NavLink to="/more" className={() => tabClass(moreActive)}>
        <Ellipsis size={21} aria-hidden />
        More
      </NavLink>
    </nav>
  )
}
