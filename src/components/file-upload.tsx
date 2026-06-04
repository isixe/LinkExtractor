import { useState, useRef, type ChangeEvent, type DragEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { IconUpload } from './icons'
import { isSupportedFile, readFileAsText } from '../lib/link-utils'

interface FileUploadTabProps {
  onExtract: (text: string) => void
}

export function FileUploadTab({ onExtract }: FileUploadTabProps) {
  const { t } = useTranslation()
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const processFile = async (file: File) => {
    if (!isSupportedFile(file)) return
    const content = await readFileAsText(file)
    setFileName(file.name)
    onExtract(content)
  }

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) await processFile(file)
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await processFile(file)
  }

  return (
    <div
      className={`cursor-pointer rounded-2xl border border-dashed border-[#84cc16]/60 p-8 text-center transition-all duration-200
        ${dragOver
          ? 'border-[#84cc16] bg-[#84cc16]/10 shadow-[0_2px_12px_-4px_rgba(132,204,22,0.2)]'
          : 'bg-[var(--card)] shadow-sm hover:shadow-md hover:-translate-y-0.5'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".txt,.json,.md,.html,.htm,.xml,.csv,.js,.ts,.jsx,.tsx"
        onChange={handleFileChange}
      />
      <IconUpload className="mx-auto mb-3 text-[var(--primary)]" />
      <p className="text-sm font-semibold text-[var(--border)]">
        {fileName
          ? t('input.file_selected', { fileName })
          : t('input.file_drag_hint')}
      </p>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
        {t('input.file_formats')}
      </p>
    </div>
  )
}
