import type { FilterType } from '../lib/types'
import { Badge } from './badge'

interface FilterBarProps {
  current: FilterType
  onChange: (filter: FilterType) => void
  counts: Record<FilterType, number>
}

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'success', label: '成功' },
  { key: 'error', label: '失败' },
  { key: 'pending', label: '等待中' },
]

const badgeVariant: Record<FilterType, 'default' | 'success' | 'error' | 'warning' | 'info'> = {
  all: 'default',
  success: 'success',
  error: 'error',
  pending: 'warning',
}

export function FilterBar({ current, onChange, counts }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {filters.map(f => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200
            ${current === f.key
              ? 'bg-[var(--primary)] text-white shadow-md'
              : 'bg-white text-[#84cc16]/80 border border-[#84cc16]/40 hover:bg-[var(--muted)] active:scale-[0.98]'
            }`}
        >
          <span className="mr-1.5">{f.label}</span>
          <Badge variant={badgeVariant[f.key]}>
            {counts[f.key]}
          </Badge>
        </button>
      ))}
    </div>
  )
}
