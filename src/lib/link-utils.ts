const urlRegex = /(https?):\/\/[-\u4e00-\u9fffA-Za-z0-9+&@#\/%?=~_|!:,.;]+[-\u4e00-\u9fffA-Za-z0-9+&@#\/%=~_|]/gi

export function extractLinks(text: string): string[] {
  const matches = text.match(urlRegex)
  if (!matches) return []
  const cleaned = matches.map(cleanUrl).filter(Boolean) as string[]
  return [...new Set(cleaned)]
}

function cleanUrl(url: string): string | null {
  let cleaned = url.trim()
  cleaned = cleaned.replace(/[.,;:!?）\)]+$/, '')
  cleaned = cleaned.replace(/[.,;:!?）\)]+$/, '')
  if (cleaned.length <= 10) return null
  try {
    new URL(cleaned)
    return cleaned
  } catch {
    // If URL constructor rejects it (e.g. trailing garbage survived regex),
    // strip one char at a time until it parses or string is too short.
    while (cleaned.length > 10) {
      cleaned = cleaned.slice(0, -1)
      try { new URL(cleaned); return cleaned } catch { }
    }
    return null
  }
}


export function generateId(): string {
  return crypto.randomUUID()
}

export function createLinkInfo(url: string): LinkInfo {
  return {
    id: generateId(),
    url,
    status: 'pending',
  }
}

const CONCURRENCY = 5
const TIMEOUT_MS = 10000

export async function checkSingleLink(url: string): Promise<CheckResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    let statusCode = 0

    // Step 1: Try a normal CORS GET — if allowed, we get real status + body
    try {
      const corsResp = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      })
      statusCode = corsResp.status
    } catch {
      // CORS blocked — fall back to no-cors HEAD to confirm reachable
      try {
        const opaqueResp = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
          mode: 'no-cors',
        })
        // no-cors HEAD succeeded (no throw) → resource is reachable
        statusCode = 0
      } catch {
        // Even no-cors failed → resource likely unreachable
        throw new Error('无法访问该链接')
      }
    }

    clearTimeout(timer)
    return {
      success: true,
      statusCode,
    }
  } catch (err: unknown) {
    clearTimeout(timer)
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        success: false,
        error: 'timeout',
        message: '请求超时',
      }
    }
    return {
      success: false,
      error: 'error',
      message: err instanceof Error ? err.message : '未知错误',
    }
  }
}

export async function checkAllLinks(
  links: LinkInfo[],
  onProgress: (id: string, result: CheckResult) => void
): Promise<void> {
  const pending = links.filter(l => l.status === 'pending')

  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    const batch = pending.slice(i, i + CONCURRENCY)
    await Promise.all(
      batch.map(async link => {
        onProgress(link.id, { success: false, error: 'checking' })
        const result = await checkSingleLink(link.url)
        onProgress(link.id, result)
      })
    )
  }
}

export function formatLinksForExport(
  links: LinkInfo[],
  format: 'txt' | 'json' | 'csv'
): string {
  switch (format) {
    case 'txt':
      return links.map(l => l.url).join('\n')
    case 'json':
      return JSON.stringify(links, null, 2)
    case 'csv':
      const header = 'URL,Status,StatusCode'
      const rows = links.map(l =>
        [
          l.url,
          l.status,
          l.statusCode ?? '',
        ].join(',')
      )
      return [header, ...rows].join('\n')
  }
}

export function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function filterLinks(links: LinkInfo[], filter: FilterType): LinkInfo[] {
  switch (filter) {
    case 'all':
      return links
    case 'success':
      return links.filter(l => l.status === 'success')
    case 'error':
      return links.filter(l => l.status === 'error' || l.status === 'timeout')
    case 'pending':
      return links.filter(l => l.status === 'pending' || l.status === 'checking')
  }
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}

export function extractDomain(url: string): string {
  try {
    const u = new URL(url)
    return u.hostname
  } catch {
    return url
  }
}

export function groupByDomain(links: LinkInfo[]): DomainGroup[] {
  const groups = new Map<string, LinkInfo[]>()
  for (const link of links) {
    const domain = extractDomain(link.url)
    if (!groups.has(domain)) groups.set(domain, [])
    groups.get(domain)!.push(link)
  }
  return Array.from(groups.entries())
    .map(([domain, links]) => ({ domain, links }))
    .sort((a, b) => a.domain.localeCompare(b.domain))
}

export function searchLinks(links: LinkInfo[], query: string): LinkInfo[] {
  if (!query.trim()) return links
  const q = query.toLowerCase()
  return links.filter(l => l.url.toLowerCase().includes(q))
}

const SUPPORTED_EXTENSIONS = [
  '.txt', '.json', '.md', '.html', '.htm', '.xml', '.csv',
  '.js', '.ts', '.jsx', '.tsx',
]

export function isSupportedFile(file: File): boolean {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  return SUPPORTED_EXTENSIONS.includes(ext)
}