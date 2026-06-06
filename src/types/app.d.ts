interface LinkInfo {
  id: string
  url: string
  status: 'pending' | 'checking' | 'success' | 'error' | 'timeout'
  statusCode?: number
  favicon?: string
  errorMessage?: string
}

type FilterType = 'all' | 'success' | 'error' | 'pending'

interface CheckResult {
  success: boolean
  statusCode?: number
  error?: string
  message?: string
}

interface DomainGroup {
  domain: string
  links: LinkInfo[]
}

type LinkInfoWithDomain = LinkInfo & { domain: string }