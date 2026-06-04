import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './button'

interface TextInputProps {
  onExtract: (text: string) => void
  linkCount: number
}

export function TextInput({ onExtract, linkCount }: TextInputProps) {
  const { t } = useTranslation()
  const [text, setText] = useState('')

  const handleExtract = () => {
    if (text.trim()) {
      onExtract(text)
    }
  }

  const handleClear = () => {
    setText('')
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={t('input.text_placeholder')}
        className="w-full h-32 resize-y rounded-xl border border-[#84cc16]/60 bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 transition-all duration-200 focus:outline-none focus:border-[#84cc16] focus:ring-1 focus:ring-[#84cc16]/10"
      />

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--border)]">
          {t('input.detected')} <span className="text-[var(--primary)]">{linkCount}</span> {t('input.links_count')}
        </span>
        <div className="flex gap-2">
          {text && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              {t('input.clear')}
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleExtract}
            disabled={!text.trim()}
          >
            {t('input.extract')}
          </Button>
        </div>
      </div>
    </div>
  )
}
