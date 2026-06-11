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
  const [fileNames, setFileNames] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const processFiles = async (files: FileList | File[]) => {
    const supportedFiles = Array.from(files).filter(isSupportedFile)
    if (supportedFiles.length === 0) return

    const contents = await Promise.all(supportedFiles.map(readFileAsText))
    const combinedContent = contents.join('\n')
    setFileNames(supportedFiles.map(f => f.name))
    onExtract(combinedContent)
  }

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) await processFiles(files)
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) await processFiles(files)
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
        multiple
        accept=".txt,.json,.md,.html,.htm,.xml,.csv,.js,.ts,.jsx,.tsx"
        onChange={handleFileChange}
      />
      <IconUpload className="mx-auto mb-3 text-[var(--primary)]" />
      <p className="text-xs sm:text-sm font-semibold text-[var(--border)]">
        {fileNames.length > 0
          ? t('input.files_selected', { count: fileNames.length, fileNames: fileNames.join(', ') })
          : t('input.file_drag_hint')}
      </p>
      <p className="mt-1 text-[10px] sm:text-xs text-[var(--muted-foreground)]">
        {t('input.file_formats')}
      </p>
    </div>
  )
}
