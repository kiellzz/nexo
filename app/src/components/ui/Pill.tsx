import type { ReactNode } from 'react'

export function Pill({
  children,
  variant,
  className,
}: {
  children: ReactNode
  variant?: 'default' | 'lite'
  className?: string
}) {
  const classes = ['pill', variant === 'lite' ? 'lite' : '', className]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}
