import type { ReactNode } from 'react'

export function PageHeader({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <header className="mb-6">
      <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-prose text-ink-soft">{subtitle}</p>}
    </header>
  )
}
