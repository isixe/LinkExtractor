import { useTranslation } from 'react-i18next'
import "../locales/i18n"
import { IconGithub } from '../assets/icons'
import { ThemeToggle } from './theme-toggle'
import { LanguageToggle } from './language-toggle'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="relative z-50 bg-transparent">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-end px-4">
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <a
            href="https://github.com/isixe/LinkExtractor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--foreground)] hover:bg-white/20 transition-colors active:scale-95"
            aria-label="GitHub"
            title={t('header.github_title')}
          >
            <IconGithub className="h-5 w-5" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}