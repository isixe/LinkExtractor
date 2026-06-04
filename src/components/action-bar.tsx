import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { LinkInfo, FilterType } from '../lib/types'
import { Button } from './button'
import { IconCopy, IconDownload, IconRefresh, IconTrash, IconLink } from './icons'
import { formatLinksForExport, downloadFile, copyToClipboard, filterLinks } from '../lib/link-utils'

interface ActionBarProps {
  links: LinkInfo[]
  filter: FilterType
  canCheck: boolean
  checking: boolean
  onCheckAll: () => void
  onClear: () => void
}

export function ActionBar({ links, filter, canCheck, checking, onCheckAll, onClear }: ActionBarProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const filteredLinks = filterLinks(links, filter)

  const handleCopy = async () => {
    const text = formatLinksForExport(filteredLinks, 'txt')
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleExport = (format: 'txt' | 'json' | 'csv') => {
    const content = formatLinksForExport(filteredLinks, format)
    const filename = `links-${Date.now()}.${format === 'csv' ? 'csv' : format}`
    const mime = format === 'json'
      ? 'application/json'
      : format === 'csv'
        ? 'text/csv'
        : 'text/plain'
    downloadFile(content, filename, mime)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        disabled={filteredLinks.length === 0}
      >
        <IconCopy />
        {copied ? t('action_bar.copied') : t('action_bar.copy')}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('txt')}
        disabled={filteredLinks.length === 0}
      >
        <IconDownload />
        TXT
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('json')}
        disabled={filteredLinks.length === 0}
      >
        <IconDownload />
        JSON
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('csv')}
        disabled={filteredLinks.length === 0}
      >
        <IconDownload />
        CSV
      </Button>

      <div className="flex-1" />

      <Button
        size="sm"
        onClick={onCheckAll}
        disabled={!canCheck || checking}
      >
        {checking ? (
          <>
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            {t('action_bar.checking')}
          </>
        ) : (
          <>
            <IconRefresh />
            {t('action_bar.check_all')}
          </>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        disabled={links.length === 0}
      >
        <IconTrash />
        {t('action_bar.clear')}
      </Button>
    </div>
  )
}
