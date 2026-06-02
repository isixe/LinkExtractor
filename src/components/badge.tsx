import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--muted)] text-[var(--border)]',
    success: 'bg-[var(--success)] text-white',
    error: 'bg-[var(--error)] text-white',
    warning: 'bg-[var(--warning)] text-white',
    info: 'bg-[var(--primary)] text-white',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
