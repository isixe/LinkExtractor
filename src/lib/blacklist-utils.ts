/**
 * Convert a wildcard pattern to a RegExp.
 * - `*` matches any sequence of characters
 * - The match is case-insensitive
 */
function patternToRegex(pattern: string): RegExp {
  const trimmed = pattern.trim()
  if (!trimmed) return /$^/ // never matches

  // Escape special regex chars except *
  const escaped = trimmed.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
  // Convert * to .*
  const regexStr = escaped.replace(/\*/g, '.*')
  return new RegExp(`^${regexStr}$`, 'i')
}

/**
 * Check if a URL matches any blacklist pattern.
 *
 * Patterns support `*` wildcards and are matched against the full URL.
 * Common usage examples:
 *   `*.doubleclick.net/*`    → blocks any doubleclick.net URLs
 *   `https://example.com/ads/*` → blocks URLs under /ads/
 *   `example.com`           → blocks any URL containing example.com
 *   `*spam*`                → blocks any URL containing "spam"
 */
export function isUrlBlacklisted(url: string, patterns: string[]): boolean {
  if (!patterns.length) return false

  const cleaned = patterns.filter((p) => p.trim().length > 0)
  if (!cleaned.length) return false

  return cleaned.some((pattern) => {
    try {
      const regex = patternToRegex(pattern)
      return regex.test(url)
    } catch {
      // If a user-supplied pattern somehow breaks regex, skip it
      return false
    }
  })
}

export function parseBlacklistText(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function formatBlacklistText(patterns: string[]): string {
  return patterns.join('\n')
}
