import { useState } from 'react'
import { Button } from './button'

interface TextInputProps {
  onExtract: (text: string) => void
  linkCount: number
}

export function TextInput({ onExtract, linkCount }: TextInputProps) {
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
        placeholder="在此粘贴包含链接的文本..."
        className="w-full h-32 resize-y rounded-xl border-2 border-[var(--primary-light)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 transition-all duration-200 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
      />

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--border)]">
          检测到 <span className="text-[var(--primary)]">{linkCount}</span> 个链接
        </span>
        <div className="flex gap-2">
          {text && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              清空
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleExtract}
            disabled={!text.trim()}
          >
            提取链接
          </Button>
        </div>
      </div>
    </div>
  )
}
