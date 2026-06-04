import { useState, useEffect } from 'react'
import { IconSun, IconMoon } from '../assets/icons'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored === 'dark' || (!stored && prefersDark)
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--foreground)] hover:bg-white/20 transition-colors active:scale-95"
      aria-label={dark ? '切换到亮色模式' : '切换到夜间模式'}
      title={dark ? '切换到亮色模式' : '切换到夜间模式'}
    >
      {dark ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
    </button>
  )
}