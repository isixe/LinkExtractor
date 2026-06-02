import { useState, useRef, type ChangeEvent, type DragEvent } from 'react'
import { IconUpload } from './icons'
import { isSupportedFile, readFileAsText } from '../lib/link-utils'

interface FileUploadTabProps {
  onExtract: (text: string) => void
}

export function FileUploadTab({ onExtract }: FileUploadTabProps) {
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
      className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200
        ${dragOver
          ? 'border-[var(--primary)] bg-[var(--primary-light)] shadow-[0_4px_20px_-4px_rgba(132,204,22,0.3)]'
          : 'border-[var(--primary-light)] bg-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
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
          ? `已选择: ${fileName}，正在提取链接...`
          : '拖拽文件到此处，或点击上传'}
      </p>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
        支持 TXT, JSON, MD, HTML, XML, CSV, JS, TS, JSX, TSX
      </p>
    </div>
  )
}
