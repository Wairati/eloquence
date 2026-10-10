import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border border-line bg-surface text-ink hover:bg-surface-sunk',
  ghost: 'text-ink-soft hover:bg-surface-sunk hover:text-ink',
}

const sizes: Record<Size, string> = {
  md: 'h-10 px-4 text-sm',
  lg: 'h-13 px-6 text-base',
}

interface StyleProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

function buttonClasses({ variant = 'primary', size = 'md', className = '' }: Omit<StyleProps, 'children'>) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`
}

export function Button({ variant, size, className, ...props }: StyleProps & ComponentProps<'button'>) {
  return <button type="button" className={buttonClasses({ variant, size, className })} {...props} />
}

export function ButtonLink({ variant, size, className, ...props }: StyleProps & ComponentProps<typeof Link>) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />
}
