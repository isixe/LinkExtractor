import type { LinkInfo } from '../lib/types'
import { getFaviconUrl } from '../lib/link-utils'
import {
  IconClock,
  IconLoader,
  IconCheckCircle,
  IconXCircle,
  IconAlertTriangle,
} from './icons'

interface LinkCardProps {
  link: LinkInfo
  onDelete?: (id: string) => void
  onReverify?: (id: string) => void
}

const statusConfig = {
  pending: { icon: IconClock, color: 'text-[var(--muted-foreground)]', bg: 'bg-[var(--muted)]', label: '等待中' },
  checking: { icon: IconLoader, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary-light)]', label: '检查中' },
  success: { icon: IconCheckCircle, color: 'text-[var(--success)]', bg: 'bg-green-50', label: '成功' },
  error: { icon: IconXCircle, color: 'text-[var(--error)]', bg: 'bg-red-50', label: '失败' },
  timeout: { icon: IconAlertTriangle, color: 'text-[var(--warning)]', bg: 'bg-yellow-50', label: '超时' },
}

export function LinkCard({ link, onDelete, onReverify }: LinkCardProps) {
  const cfg = statusConfig[link.status]
  const Icon = cfg.icon

  return (
    <div className={`rounded-2xl border border-[#84cc16]/40 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${cfg.bg}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex-shrink-0 ${cfg.color}`}>
          <Icon />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            {link.status === 'success' && link.favicon && (
              <img
                src={getFaviconUrl(link.url)}
                alt=""
                className="h-4 w-4 rounded"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            {link.title && (
              <span className="truncate text-sm font-medium text-[var(--foreground)]">
                {link.title}
              </span>
            )}
            {link.statusCode && (
              <span className="flex-shrink-0 text-xs text-[var(--muted-foreground)]">
                {link.statusCode}
              </span>
            )}
          </div>

          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-xs text-[var(--primary)] font-semibold hover:underline"
          >
            {link.url}
          </a>

          {link.description && (
            <p className="mt-1 line-clamp-2 text-xs text-[var(--muted-foreground)]">
              {link.description}
            </p>
          )}

          {link.errorMessage && (
            <p className="mt-1 text-xs text-[var(--error)]">{link.errorMessage}</p>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center gap-1">
          <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
          <div className="ml-2 flex gap-1">
            {link.status === 'error' || link.status === 'timeout' ? (
              <button
                onClick={() => onReverify?.(link.id)}
                className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
                title="重新检查"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </button>
            ) : null}
            {onDelete && (
              <button
                onClick={() => onDelete(link.id)}
                className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--error)]"
                title="删除"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
