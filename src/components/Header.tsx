'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { usePinyin } from '@/contexts/PinyinContext'
import SearchOverlay from '@/components/SearchOverlay'
import HexagramDetailModal from '@/components/HexagramDetailModal'

const tabs = [
  { href: '/', label: '首页', exact: true, group: '学习' },
  { href: '/eight', label: '八卦', exact: false, group: '学习' },
  { href: '/relations', label: '关系图', exact: false, group: '学习' },
  { href: '/hexagrams', label: '64卦', exact: false, group: '学习' },
  { href: '/divine', label: '起卦', exact: false, group: '工具' },
  { href: '/simulator', label: '变爻模拟', exact: false, group: '工具' },
  { href: '/contrast', label: '先后天', exact: false, group: '探索' },
  { href: '/fuxi', label: '方圆图', exact: false, group: '探索' },
  { href: '/compare', label: '卦对比', exact: false, group: '工具' },
  { href: '/ai-reading', label: 'AI解卦', exact: false, group: '工具' },
  { href: '/flashcard', label: '闪卡', exact: false, group: '学习' },
  { href: '/lifegua', label: '本命卦', exact: false, group: '工具' },
  { href: '/liuyao', label: '六爻排盘', exact: false, group: '工具' },
  { href: '/yao-positions', label: '爻位体系', exact: false, group: '学习' },
  { href: '/ten-wings', label: '十翼', exact: false, group: '学习' },
  { href: '/hetu-luoshu', label: '河图洛书', exact: false, group: '学习' },
  { href: '/flying-stars', label: '九宫飞星', exact: false, group: '探索' },
  { href: '/evolution', label: '易学流变', exact: false, group: '学习' },
  { href: '/yijing-computer', label: '易与计算机', exact: false, group: '探索' },
  { href: '/glossary', label: '术语', exact: false, group: '学习' },
  { href: '/history', label: '占卜记录', exact: false, group: '探索' },
]

const visibleTabs = tabs.filter(t => ['/', '/eight', '/relations', '/hexagrams', '/divine'].includes(t.href))
const moreTabs = tabs.filter(t => !['/', '/eight', '/relations', '/hexagrams', '/divine'].includes(t.href))

const mobileGroups = [
  { title: '📖 学习', items: tabs.filter(t => t.group === '学习') },
  { title: '🔧 工具', items: tabs.filter(t => t.group === '工具') },
  { title: '📊 探索', items: tabs.filter(t => t.group === '探索') },
]

const moreGroups = [
  { title: '📖 学习', items: moreTabs.filter(t => t.group === '学习') },
  { title: '🔧 工具', items: moreTabs.filter(t => t.group === '工具') },
  { title: '📊 探索', items: moreTabs.filter(t => t.group === '探索') },
]

export default function Header() {
  const pathname = usePathname()
  const [dark, setDark] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchDetailKey, setSearchDetailKey] = useState<string | null>(null)
  const moreRef = useRef<HTMLDetailsElement>(null)

  const isActive = (t: typeof tabs[number]) =>
    t.exact ? pathname === t.href : pathname.startsWith(t.href)

  // 初始化：从 localStorage 读取主题
  useEffect(() => {
    const saved = localStorage.getItem('bg-theme')
    const isDark = saved !== 'classic'
    if (isDark !== dark) setDark(isDark)
    applyTheme(isDark)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 用户切换时：保存并应用
  useEffect(() => {
    localStorage.setItem('bg-theme', dark ? 'dark' : 'classic')
    applyTheme(dark)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dark])

  // Ctrl+K 快捷键打开搜索
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(s => !s)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 页面切换时关闭移动端菜单和更多下拉
  useEffect(() => {
    setMobileMenuOpen(false)
    if (moreRef.current) moreRef.current.open = false
  }, [pathname])

  function applyTheme(isDark: boolean) {
    const vars: [string, string, string][] = [
      ['--bg', '#0b1120', '#f5f0e8'],
      ['--bg2', '#141d33', '#efe8d8'],
      ['--bg3', '#1e2a45', '#fcf9f2'],
      ['--fg', '#e2e8f0', '#3d2b1f'],
      ['--muted', '#7e8ba3', '#8b7355'],
      ['--accent', '#d97706', '#c23b22'],
      ['--accent2', '#f59e0b', '#a52a2a'],
      ['--card', '#141d33', '#ffffff'],
      ['--border', '#1e2a45', '#d4c5a9'],
      ['--yang', '#f59e0b', '#3d2b1f'],
      ['--yin', '#4a5a7a', '#a09070'],
      ['--risk', '#f87171', '#c23b22'],
      ['--glow', 'rgba(245,158,11,.15)', 'rgba(194,59,34,.1)'],
      ['--shadow', 'rgba(0,0,0,.4)', 'rgba(60,40,20,.12)'],
    ]
    vars.forEach(([k, d, c]) => document.documentElement.style.setProperty(k, isDark ? d : c))
  }

  const toggleTheme = () => setDark(d => !d)

  const tabLinkClass = (t: typeof tabs[number], base = 'px-3 py-0.5 text-[13px] no-underline transition-colors') =>
    `${base} ${
      isActive(t)
        ? 'text-[var(--accent)] font-semibold'
        : 'text-[var(--muted)] hover:text-[var(--fg)]'
    }`

  // WebMCP descriptions for navigation links
  const navDescriptions: Record<string, string> = {
    '/': '首页 · 每日一签和功能导航',
    '/eight': '八卦学习 · 八卦的象征、属性和对应关系',
    '/relations': '卦象关系图 · 先天八卦方位、阴阳对偶、五行相生、家庭角色',
    '/hexagrams': '六十四卦浏览 · 全部卦辞、象辞、爻辞和现代释义',
    '/divine': '起卦占卜 · 数字起卦或金钱起卦',
    '/simulator': '变爻模拟器 · 选卦→点爻→变卦动画',
    '/contrast': '先天后天对照 · 伏羲八卦 vs 文王八卦',
    '/compare': '双卦对比工具 · 两卦并排对照',
    '/ai-reading': 'AI 解卦 · 用 AI 解读卦象',
    '/flashcard': '闪卡复习 · 八卦/64卦记忆卡片',
    '/lifegua': '本命卦生成 · 根据生辰推算命卦',
    '/liuyao': '六爻排盘工具 · 传统装卦六步：八宫/纳甲/纳支/世应/六亲/六神',
    '/yao-positions': '爻位体系详解 · 六爻位置、当位中正、承乘比应互动学习',
    '/ten-wings': '十翼专题 · 易传/彖传/象传/系辞传/文言传/说卦传/序卦传/杂卦传',
    '/hetu-luoshu': '河图洛书专题 · 河图/洛书/九宫五行/八卦数理之源',
    '/flying-stars': '九宫飞星沙盘 · 洛书九宫动态飞星推演交互工具',
    '/evolution': '易学流变年表 · 从太极八卦到各门术数的演化史',
    '/yijing-computer': '易与计算机 · 太极二进制/逻辑门/图灵完备',
    '/glossary': '术语解释 · 易经核心术语速查',
    '/history': '占卜记录 · 起卦历史查询',
    '/fuxi': '伏羲六十四卦方圆图 · 邵雍皇极经世',
  }

  const btnBase = 'w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--bg2)] text-[var(--muted)] flex items-center justify-center cursor-pointer text-base hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors shrink-0'

  return (
    <>
    <header className="border-b border-[var(--border)] relative">
      <div className="flex items-center py-3 lg:py-6 max-w-[960px] mx-auto px-5 gap-3">
        {/* ── START: Hamburger (mobile) + Logo ── */}
        <div className="flex flex-1 justify-start items-center gap-3">
          <div className="lg:hidden relative">
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              className={btnBase}
              aria-label="菜单"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d={mobileMenuOpen ? 'M4 4l10 10M14 4L4 14' : 'M3 5h12M3 9h12M3 13h12'} />
              </svg>
            </button>
            {mobileMenuOpen && (
              <div className="absolute left-0 top-full mt-3 z-50 w-64 animate-[menuSlide_0.2s_ease-out]">
                <nav className="flex flex-col p-3 rounded-2xl bg-[var(--bg2)] border border-[var(--border)] shadow-[0_8px_32px_var(--shadow)] max-h-[70vh] overflow-y-auto overscroll-contain">
                  {mobileGroups.map((group, gi) => (
                    <div key={group.title}>
                      {gi > 0 && <div className="mx-3 my-2 h-px bg-[var(--border)]" />}
                      <div className="px-3 py-1.5 text-[12px] text-[var(--muted)] font-medium tracking-wider">{group.title}</div>
                      {group.items.map(t => (
                        <Link
                          key={t.href}
                          href={t.href}
                          className={`block px-3 py-2 text-[14px] no-underline transition-colors rounded ${
                            isActive(t)
                              ? 'text-[var(--accent)] font-semibold bg-[var(--glow)]'
                              : 'text-[var(--fg)] hover:text-[var(--accent)]'
                          }`}
                          data-mcp-action="navigate"
                          data-mcp-description={navDescriptions[t.href] || `前往${t.label}页面`}
                        >
                          {t.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </nav>
              </div>
            )}
          </div>
          <Link href="/" className="text-[22px] font-bold tracking-wider bg-gradient-to-r from-[var(--yang)] to-[var(--accent2)] bg-clip-text text-transparent no-underline shrink-0">
            🌀 八卦入门
          </Link>
        </div>

        {/* ── CENTER: Desktop 导航 ── */}
        <nav className="hidden lg:flex items-center gap-1">
          {visibleTabs.map(t => (
            <Link
              key={t.href}
              href={t.href}
              className={tabLinkClass(t)}
              data-mcp-action="navigate"
              data-mcp-description={navDescriptions[t.href] || `前往${t.label}页面`}
            >
              {t.label}
            </Link>
          ))}

          {/* 更多下拉 — DaisyUI <details> 模式 */}
          <details ref={moreRef} className="relative">
            <summary className={`px-3 py-0.5 text-[13px] no-underline transition-colors cursor-pointer list-none ${
              moreTabs.some(t => isActive(t))
                ? 'text-[var(--accent)] font-semibold'
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}>
              更多 ▼
            </summary>
            <div className="absolute right-0 top-full mt-2 z-50 p-3 rounded-xl bg-[var(--bg2)] border border-[var(--border)] shadow-[0_8px_32px_var(--shadow)] min-w-[160px]">
              {moreGroups.map((group, gi) => (
                <div key={group.title}>
                  {gi > 0 && <div className="mx-1 my-1.5 h-px bg-[var(--border)]" />}
                  <div className="px-1 pb-0.5 text-[11px] text-[var(--muted)] font-medium tracking-wider">{group.title}</div>
                  {group.items.map(t => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className={`block px-2 py-1 text-[13px] no-underline transition-colors whitespace-nowrap rounded ${
                        isActive(t)
                          ? 'text-[var(--accent)] font-semibold bg-[var(--glow)]'
                          : 'text-[var(--fg)] hover:text-[var(--accent)]'
                      }`}
                      data-mcp-action="navigate"
                      data-mcp-description={navDescriptions[t.href] || `前往${t.label}页面`}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </details>
        </nav>

        {/* ── END: 操作按钮 ── */}
        <div className="flex flex-1 justify-end items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className={btnBase}
            aria-label="搜索"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="6.5" cy="6.5" r="5" />
              <path d="M10.5 10.5L14 14" />
            </svg>
          </button>
          <button
            onClick={toggleTheme}
            className={btnBase}
            aria-label="切换主题"
          >
            {dark ? '🌙' : '☀️'}
          </button>
          <PinyinBtn />
        </div>
      </div>
    </header>

      <SearchOverlay
        open={searchOpen}
        onClose={() => { setSearchOpen(false); setSearchDetailKey(null) }}
        onOpenDetail={(key) => { setSearchOpen(false); setSearchDetailKey(key) }}
      />

      <HexagramDetailModal
        hexagramKey={searchDetailKey}
        onClose={() => setSearchDetailKey(null)}
      />
    </>
  )
}

function PinyinBtn() {
  const { showPinyin, toggle } = usePinyin()
  return (
    <button
      onClick={toggle}
      className={`w-9 h-9 rounded-full border text-base flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
        showPinyin
          ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]'
          : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
      }`}
      aria-label="切换注音"
    >
      🔤
    </button>
  )
}
