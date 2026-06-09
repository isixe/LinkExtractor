import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  shape?: 'square' | 'pill'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const shapes = {
    square: 'rounded-xl',
    pill: 'rounded-full',
  }

  const variants = {
    primary:
      'bg-[#65a30d] text-white shadow-[0_4px_14px_0_rgba(101,163,13,0.39)] hover:bg-[#5a940c] hover:shadow-[0_6px_20px_-4px_rgba(101,163,13,0.5)] active:scale-[0.98] active:shadow-sm',
    secondary:
      'bg-[#65a30d] text-white shadow-md hover:bg-[#5a940c] active:scale-[0.98]',
    outline:
      'bg-transparent text-[#84cc16] border border-[#84cc16]/40 hover:bg-[var(--muted)] active:scale-[0.98]',
    ghost:
      'bg-transparent text-[#84cc16] hover:bg-[var(--muted)] shadow-none',
    danger:
      'bg-[#65a30d] text-white shadow-md hover:bg-[#5a940c] active:scale-[0.98]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs sm:text-sm',
    md: 'px-5 py-2.5 text-sm sm:text-base',
    lg: 'px-8 py-3.5 text-base sm:text-lg',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${shapes[shape]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
