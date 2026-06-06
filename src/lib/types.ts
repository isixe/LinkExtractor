export interface LinkInfo {
  id: string
  url: string
  status: 'pending' | 'checking' | 'success' | 'error' | 'timeout'
  statusCode?: number
  favicon?: string
  errorMessage?: string
}

export type FilterType = 'all' | 'success' | 'error' | 'pending'

export interface CheckResult {
  success: boolean
  statusCode?: number
  error?: string
  message?: string
}