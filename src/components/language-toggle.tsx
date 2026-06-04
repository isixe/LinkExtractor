import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconGlobe } from './icons'

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const current = i18n.language === 'zh' ? 'zh' : 'en'

  const switchLang = (lang: string) => {
    i18n.changeLanguage(lang)
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--foreground)] hover:bg-white/20 transition-colors active:scale-95"
        aria-label="Switch language"
        title={current === 'zh' ? 'Switch Language' : '切换语言'}
      >
        <IconGlobe className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-32 rounded-xl border border-[var(--primary-light)] bg-[var(--card)] py-1 shadow-lg z-50">
          <button
            onClick={() => switchLang('en')}
            className={`flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--muted)] ${
              current === 'en' ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${current === 'en' ? 'bg-[var(--primary)]' : 'bg-transparent'}`} />
            English
          </button>
          <button
            onClick={() => switchLang('zh')}
            className={`flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--muted)] ${
              current === 'zh' ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${current === 'zh' ? 'bg-[var(--primary)]' : 'bg-transparent'}`} />
            中文
          </button>
        </div>
      )}
    </div>
  )
}