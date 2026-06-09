import { useTranslation } from 'react-i18next'
import { Badge } from './badge'

interface FilterBarProps {
  current: FilterType
  onChange: (filter: FilterType) => void
  counts: Record<FilterType, number>
}

const filterKeys: FilterType[] = ['all', 'success', 'error', 'pending']

const badgeVariant: Record<FilterType, 'default' | 'success' | 'error' | 'warning' | 'info'> = {
  all: 'default',
  success: 'success',
  error: 'error',
  pending: 'warning',
}

export function FilterBar({ current, onChange, counts }: FilterBarProps) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {filterKeys.map(key => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200
            ${current === key
              ? 'bg-[var(--primary)] text-white shadow-md'
              : 'bg-[var(--card)] text-[#84cc16]/80 border border-[#84cc16]/40 hover:bg-[var(--muted)] active:scale-[0.98]'
            }`}
        >
          <span className="mr-1.5">{t(`filter.${key}`)}</span>
          <Badge variant={badgeVariant[key]}>
            {counts[key]}
          </Badge>
        </button>
      ))}
    </div>
  )
}
