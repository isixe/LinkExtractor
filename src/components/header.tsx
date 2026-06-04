import { IconGithub } from '../assets/icons'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="relative z-50 bg-transparent">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-end px-4">
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/isixe/LinkExtractor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--foreground)] hover:bg-white/20 transition-colors active:scale-95"
            aria-label="GitHub"
            title="在 GitHub 上查看源码"
          >
            <IconGithub className="h-5 w-5" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}