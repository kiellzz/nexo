import type { ReactNode } from 'react'

export function Pill({
  children,
  variant,
  className,
  onClick,
}: {
  children: ReactNode
  variant?: 'default' | 'lite'
  className?: string
  onClick?: () => void
}) {
  const classes = ['pill', variant === 'lite' ? 'lite' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      {children}
    </span>
  )
}

