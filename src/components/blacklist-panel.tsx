import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { parseBlacklistText, formatBlacklistText } from '../lib/blacklist-utils'
import { IconSettings } from './icons'

interface BlacklistPanelProps {
  open: boolean
  onClose: () => void
  patterns: string[]
  onPatternsChange: (patterns: string[]) => void
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
}

export function BlacklistPanel({
  open,
  onClose,
  patterns,
  onPatternsChange,
  enabled,
  onEnabledChange,
}: BlacklistPanelProps) {
  const { t } = useTranslation()

  const [draftText, setDraftText] = useState('')

  useEffect(() => {
    if (open) {
      setDraftText(formatBlacklistText(patterns))
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, patterns])

  if (!open) return null

  const handleTextChange = (value: string) => {
    setDraftText(value)
  }

  const handleConfirm = () => {
    onPatternsChange(parseBlacklistText(draftText))
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-[var(--primary-light)] bg-[var(--card)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--primary-light)] px-6 py-4">
          <div className="flex items-center gap-2">
            <IconSettings className="h-5 w-5 text-[var(--primary)]" />
            <h2 className="text-lg font-bold text-[var(--foreground)]">{t('blacklist.title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          <p className="text-sm font-medium text-[var(--muted-foreground)]">
            {t('blacklist.description')}
          </p>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {t('blacklist.enable_label')}
            </span>
            <button
              role="switch"
              aria-checked={enabled}
              onClick={() => onEnabledChange(!enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                enabled ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>

          {/* Textarea */}
          <div>
            <textarea
              value={draftText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={t('blacklist.placeholder')}
              rows={8}
              className="w-full resize-y rounded-xl border border-[var(--primary-light)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/40 transition-all duration-200 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/10 font-mono"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[var(--primary-light)] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-[var(--primary-light)] px-5 py-2 text-xs font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--muted)] active:scale-[0.98]"
          >
            {t('blacklist.close')}
          </button>
          <button
            onClick={handleConfirm}
            className="rounded-xl bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-[var(--primary-dark)] active:scale-[0.98]"
          >
            {t('blacklist.confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}
