import { useState, useMemo, useCallback } from 'react'
import type { LinkInfo, FilterType } from '../lib/types'
import {
  extractLinks,
  createLinkInfo,
  checkAllLinks,
  checkSingleLink,
  filterLinks,
} from '../lib/link-utils'
import type { CheckResult } from '../lib/types'
import { FileUploadTab } from './file-upload'
import { TextInput } from './text-input'
import { FilterBar } from './filter-bar'
import { ActionBar } from './action-bar'
import { LinkCard } from './link-card'
import { Progress } from './progress'
import { IconLink } from './icons'

export function LinkExtractor() {
  const [links, setLinks] = useState<LinkInfo[]>([])
  const [inputTab, setInputTab] = useState<'file' | 'text'>('text')
  const [filter, setFilter] = useState<FilterType>('all')
  const [checking, setChecking] = useState(false)
  const [checkedCount, setCheckedCount] = useState(0)

  const rawLinkCount = links.length

  const filteredLinks = useMemo(() => filterLinks(links, filter), [links, filter])

  const counts = useMemo(() => ({
    all: links.length,
    success: links.filter(l => l.status === 'success').length,
    error: links.filter(l => l.status === 'error' || l.status === 'timeout').length,
    pending: links.filter(l => l.status === 'pending' || l.status === 'checking').length,
  }), [links])

  const progress = useMemo(() => {
    if (links.length === 0) return 0
    return Math.round((checkedCount / links.length) * 100)
  }, [checkedCount, links.length])

  const handleText = useCallback((text: string) => {
    const urls = extractLinks(text)
    const newLinks = urls.map(createLinkInfo)
    setLinks(newLinks)
    setCheckedCount(0)
    setFilter('all')
  }, [])

  const handleCheckAll = useCallback(async () => {
    if (links.length === 0) return
    setChecking(true)
    setCheckedCount(0)

    const initial = links.map(l => ({ ...l, status: 'pending' as const }))
    setLinks(initial)

    let count = 0
    await checkAllLinks(initial, (id, result) => {
      setLinks(prev =>
        prev.map(l => {
          if (l.id !== id) return l
          if (result.error === 'checking') {
            count++
            return { ...l, status: 'checking' as const }
          }
          return {
            ...l,
            status: result.success ? ('success' as const) : (result.error === 'timeout' ? ('timeout' as const) : ('error' as const)),
            statusCode: result.statusCode,
            title: result.title,
            description: result.description,
            errorMessage: result.success ? undefined : result.message,
          }
        })
      )
      count++
      setCheckedCount(count)
    })

    setChecking(false)
  }, [links])

  const handleDelete = useCallback((id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id))
  }, [])

  const handleReverify = useCallback(async (id: string) => {
    const link = links.find(l => l.id === id)
    if (!link) return

    setLinks(prev =>
      prev.map(l => l.id === id ? { ...l, status: 'checking', title: undefined, description: undefined, statusCode: undefined, errorMessage: undefined } : l)
    )

    const result = await checkSingleLink(link.url)

    setLinks(prev =>
      prev.map(l => {
        if (l.id !== id) return l
        return {
          ...l,
          status: result.success ? 'success' : (result.error === 'timeout' ? 'timeout' : 'error'),
          statusCode: result.statusCode,
          title: result.title,
          description: result.description,
          errorMessage: result.success ? undefined : result.message,
        }
      })
    )
  }, [links])

  const handleClear = useCallback(() => {
    setLinks([])
    setCheckedCount(0)
    setFilter('all')
  }, [])

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden border-b border-[var(--primary-light)] bg-gradient-to-br from-[var(--background)] to-white pb-60 pt-20 sm:pt-28">
        {/* Organic decorations */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[var(--primary-light)] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -bottom-24 h-48 w-48 rounded-full bg-[var(--primary)] opacity-20 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* ── Text Column ── */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--primary-light)] px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              <span className="text-xs font-semibold text-[var(--border)]">
                免费在线工具 · 无需注册
              </span>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl lg:text-6xl">
              从文本和文件中
              <br />
              <span className="text-[var(--primary)]">
                一键提取所有链接
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg font-medium leading-relaxed text-[var(--foreground)] lg:mx-0">
              批量提取 URL、验证链接可用性、智能筛选过滤、多格式导出。纯客户端运行，你的数据安全可控。
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <button
                onClick={() => document.getElementById('input-card')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_14px_0_rgba(132,204,22,0.39)] transition-all duration-200 hover:bg-[var(--primary-dark)] hover:shadow-[0_6px_20px_-4px_rgba(132,204,22,0.5)] active:scale-[0.98]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                立即开始提取
              </button>
              <span className="hidden text-sm text-[var(--muted-foreground)]/30 sm:inline">·</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)]">
                <svg className="h-4 w-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                无需注册，免费使用
              </div>
            </div>

            {/* Social proof bar */}
            <div className="mt-12 flex items-center justify-center gap-6 lg:justify-start">
              <div className="flex -space-x-2">
                {['A', 'M', 'S', 'J'].map((initial, i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white shadow-md"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <div className="text-left text-sm font-semibold text-[var(--muted-foreground)]">
                <span className="text-[var(--foreground)]">500+</span> 开发者在用
                <div className="flex items-center gap-1 text-xs text-[var(--primary)]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  ))}
                  <span className="ml-1 text-[var(--muted-foreground)]/60">4.9</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Organic Composition ── */}
          <div className="relative mt-12 hidden lg:block">
            <div className="relative mx-auto flex h-[420px] w-full max-w-[480px] items-center justify-center">
              {/* Large circle */}
              <div className="absolute h-72 w-72 rounded-full border-4 border-[var(--primary-light)]">
                <div className="absolute inset-4 rounded-full bg-[var(--primary)]" />
              </div>

              {/* Rotated square */}
              <div className="absolute h-52 w-52 rotate-12 rounded-2xl border-4 border-[var(--primary-dark)] bg-white">
                <div className="flex h-full items-center justify-center -rotate-12">
                  <IconLink className="h-10 w-10 text-[var(--primary)]" strokeWidth={2} />
                </div>
              </div>

              {/* Organic blob */}
              <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-[var(--primary-light)]" />

              {/* Small decorative circle */}
              <div className="absolute -left-6 -top-6 h-12 w-12 rounded-full bg-[var(--primary)] shadow-md" />

              {/* Small decorative square */}
              <div className="absolute -right-10 top-10 h-8 w-8 rotate-45 rounded-lg bg-[var(--primary-dark)]" />

              {/* Result cards */}
              <div className="absolute -left-6 top-6 z-30 w-64 rounded-2xl border border-[var(--primary-light)] bg-white p-4 shadow-lg">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)]">
                    <IconLink className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-bold text-[var(--foreground)]">链接提取结果</span>
                </div>
                <div className="space-y-2">
                  {[
                    { url: 'github.com', status: '✓ 200', color: 'text-[var(--success)]' },
                    { url: 'docs.google.com', status: '✓ 200', color: 'text-[var(--success)]' },
                    { url: 'example.org', status: '✗ 404', color: 'text-[var(--error)]' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg bg-[var(--muted)] px-3 py-1.5">
                      <span className={`text-xs font-bold ${item.color}`}>{item.status}</span>
                      <span className="truncate text-xs font-semibold text-[var(--foreground)]">{item.url}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export card */}
              <div className="absolute -bottom-2 -right-8 z-20 w-52 rounded-2xl border border-[var(--primary-light)] bg-white p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-light)]">
                    <svg className="h-4 w-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--foreground)]">导出完毕</div>
                    <div className="text-[10px] text-[var(--muted-foreground)]">28 个链接 · CSV 格式</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INPUT CARD (floats above hero) ── */}
      <div id="input-card" className="relative z-10 -mt-40 mx-auto max-w-4xl px-4">
        <div className="rounded-2xl border border-[var(--primary-light)] bg-white shadow-xl">
          {/* Tabs */}
          <div className="flex border-b border-[var(--primary-light)]">
            <button
              onClick={() => setInputTab('text')}
              className={`flex-1 px-4 py-4 text-sm font-semibold transition-all duration-200 rounded-tl-2xl ${
                inputTab === 'text'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-white text-[var(--border)] hover:bg-[var(--muted)]'
              }`}
            >
              文本输入
            </button>
            <button
              onClick={() => setInputTab('file')}
              className={`flex-1 px-4 py-4 text-sm font-semibold transition-all duration-200 rounded-tr-2xl ${
                inputTab === 'file'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-white text-[var(--border)] hover:bg-[var(--muted)]'
              }`}
            >
              文件上传
            </button>
          </div>
          <div className="p-6 sm:p-8">
            {inputTab === 'text' ? (
              <TextInput onExtract={handleText} linkCount={rawLinkCount} />
            ) : (
              <FileUploadTab onExtract={handleText} />
            )}
          </div>
        </div>
      </div>

      {/* ── RESULTS ── */}
      {links.length > 0 && (
        <div className="mx-auto mt-10 max-w-4xl space-y-4 px-4 pb-20">
          {/* Section label */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-light)] px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
            <span className="text-xs font-semibold text-[var(--border)]">
              结果列表
            </span>
          </div>

          {/* Action bar + Filter */}
          <div className="space-y-4 rounded-2xl border border-[var(--primary-light)] bg-white p-4 shadow-lg sm:p-6">
            <ActionBar
              links={links}
              filter={filter}
              canCheck={counts.pending > 0}
              checking={checking}
              onCheckAll={handleCheckAll}
              onClear={handleClear}
            />
            <FilterBar
              current={filter}
              onChange={setFilter}
              counts={counts}
            />
          </div>

          {/* Progress */}
          {checking && (
            <div className="space-y-2 rounded-2xl border border-[var(--primary-light)] bg-white p-4 shadow-lg sm:p-6">
              <div className="flex justify-between text-sm font-semibold text-[var(--border)]">
                <span>正在检查链接...</span>
                <span>{checkedCount} / {links.length}</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Link list */}
          <div className="space-y-3">
            {filteredLinks.length === 0 ? (
              <div className="rounded-2xl border border-[var(--primary-light)] bg-white p-12 text-center shadow-lg">
                <p className="text-sm font-semibold text-[var(--muted-foreground)]">没有匹配的链接</p>
              </div>
            ) : (
              filteredLinks.map(link => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onDelete={handleDelete}
                  onReverify={handleReverify}
                />
              ))
            )}
          </div>

          <div className="pt-4 text-center text-xs font-semibold text-[var(--muted-foreground)]/60">
             显示 {filteredLinks.length} / {links.length} 个链接
           </div>
        </div>
      )}

      {/* ─── FEATURES ─── */}
      <section className="border-b border-[var(--primary-light)] bg-white py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--primary-light)] px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              <span className="text-xs font-semibold text-[var(--border)]">
                核心功能
              </span>
            </div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-[var(--foreground)]">
              强大而简洁的{' '}
              <span className="text-[var(--primary)]">
                链接处理工具
              </span>
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-[var(--muted-foreground)]">
              从提取到验证再到导出，一站式完成所有链接操作。纯客户端处理，数据安全无忧。
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-6 w-6 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                ),
                title: '批量提取 URL',
                description: '支持从纯文本和多文件格式（TXT、JSON、MD、HTML、CSV 等）中自动识别并提取所有链接地址。',
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-[var(--primary-dark)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                title: '链接有效性验证',
                description: '5 并发快速检测每个链接的可用性，自动识别成功、失败、超时状态，并提供 HTTP 状态码和页面标题。',
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                ),
                title: '多种导出格式',
                description: '支持 TXT、JSON、CSV 三种格式导出结果，满足数据分析、文档整理、报告生成等不同场景需求。',
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-[var(--primary-dark)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                title: '隐私安全',
                description: '纯客户端运行，所有数据仅在浏览器中处理，不上传任何内容到服务器，确保你的数据安全。',
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
                title: '智能过滤',
                description: '按全部、成功、失败、等待中状态快速筛选链接，精准定位需要关注的异常链接，提升处理效率。',
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-[var(--primary-dark)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                ),
                title: '重新验证',
                description: '对失败或超时的链接可单独重新检查，无需重新提取全部链接，节省时间的同时精准定位问题链接。',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-[var(--primary-light)] bg-white p-8 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--primary-light)] transition-transform duration-200 group-hover:scale-110">
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[var(--primary)]" />
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-[var(--foreground)]">{feature.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-[var(--muted-foreground)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="border-b border-[var(--primary-light)] bg-[var(--foreground)] py-24 lg:py-28">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="text-xs font-semibold text-white">
                使用步骤
              </span>
            </div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-white">
              三步完成链接提取
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-white/60">
              无需注册，无需安装，打开浏览器即可使用
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            {[
              { step: '1', title: '粘贴或上传', description: '将包含链接的文本粘贴到输入框，或上传 TXT、JSON、HTML 等格式的文件。自动识别所有 URL。', color: 'bg-[var(--primary)]' },
              { step: '2', title: '提取并验证', description: '一键批量提取所有 URL，点击"检查全部"并发验证每个链接的有效性，获取状态码和页面标题。', color: 'bg-[var(--primary-dark)]' },
              { step: '3', title: '筛选与导出', description: '按成功、失败等状态筛选链接，一键复制到剪贴板或导出为 TXT、JSON、CSV 格式，满足不同场景需求。', color: 'bg-[var(--primary)]' },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className={`relative mx-auto mb-6 flex h-20 w-20 items-center justify-center ${item.color} rounded-2xl shadow-lg`}>
                  <span className="text-3xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{item.title}</h3>
                <p className="mx-auto max-w-xs text-sm font-medium leading-relaxed text-white/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="border-b border-[var(--primary-light)] bg-[var(--muted)] py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="text-xs font-semibold text-white">
                用户评价
              </span>
            </div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-[var(--foreground)]">
              深受{' '}
              <span className="text-[var(--primary)]">
                开发者喜爱
              </span>
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-[var(--muted-foreground)]">
              来自全球用户的真实反馈
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: '批量链接验证功能太实用了，不用再手动一个个点开检查。JSON 导出直接对接我的数据分析流程，工作效率提升了很多。',
                author: '陈明远',
                role: '全栈开发工程师 · 杭州',
                color: 'var(--primary)',
              },
              {
                quote: '做 SEO 优化需要频繁检查外链状态。这个工具纯客户端运行，不用担心数据泄露，安全放心。界面简洁，功能强大。',
                author: 'Marcus Johnson',
                role: 'SEO 工程师 · 新加坡',
                color: 'var(--primary-dark)',
              },
              {
                quote: '拖拽日志文件就能提取所有链接，多格式导出支持很全面。作为数据分析师，这个工具已经成为我日常工作的必备利器。',
                author: '张雨晴',
                role: '数据分析师 · 上海',
                color: 'var(--primary)',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-[var(--primary-light)] bg-white p-8 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl" style={{ background: item.color }} />

                <p className="relative mb-6 text-sm font-medium leading-relaxed text-[var(--foreground)]">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
                    style={{ background: item.color }}
                  >
                    {item.author[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--foreground)]">{item.author}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust metrics row */}
          <div className="mt-16 grid grid-cols-2 gap-0 rounded-2xl border border-[var(--primary-light)] bg-white shadow-md md:grid-cols-4">
            {[
              { number: '10,000+', label: '链接已处理', bg: 'bg-[var(--primary-light)]' },
              { number: '99.9%', label: '工具在线率', bg: 'bg-white' },
              { number: '纯客户端', label: '零数据上传', bg: 'bg-white' },
              { number: '永久免费', label: '无需付费', bg: 'bg-[var(--primary)]' },
            ].map((stat, i) => (
              <div key={i} className={`text-center p-8 ${stat.bg} ${i < 3 ? 'border-r border-[var(--primary-light)]' : ''}`}>
                <div className="text-2xl font-bold text-[var(--foreground)]">{stat.number}</div>
                <div className="mt-1 text-xs font-semibold text-[var(--muted-foreground)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="border-b border-[var(--primary-light)] bg-[var(--foreground)] py-24 lg:py-28">
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="text-xs font-semibold text-white">
              免费 · 无需注册 · 永久使用
            </span>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-white">
            立即开始提取链接
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base font-medium leading-relaxed text-white/70">
            无需注册，无需下载，打开浏览器即可使用。所有数据仅在本地处理，安全可靠。
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => document.getElementById('input-card')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_14px_0_rgba(132,204,22,0.39)] transition-all duration-200 hover:bg-[var(--primary-dark)] hover:shadow-[0_6px_20px_-4px_rgba(132,204,22,0.5)] active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              免费开始使用
            </button>
            <span className="flex items-center gap-2 text-sm font-semibold text-white/60">
              <svg className="h-4 w-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              无需信用卡
            </span>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold text-white/60">
            <span>纯客户端处理</span>
            <span>5 并发验证</span>
            <span>支持 3 种导出格式</span>
            <span>支持多语言 URL</span>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[var(--foreground)] py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <svg className="h-4 w-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Link Extractor
            </div>
            <p className="text-xs font-semibold text-white/50">
              纯客户端工具 · 不上传你的数据 · 永久免费使用
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
