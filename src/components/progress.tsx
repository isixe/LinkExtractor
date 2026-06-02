interface ProgressProps {
  value: number
  className?: string
}

export function Progress({ value, className = '' }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={`h-3 w-full overflow-hidden rounded-full bg-[var(--muted)] ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] transition-all duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
