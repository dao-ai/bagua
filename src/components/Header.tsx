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
  { href: '/glossary', label: '术语', exact: false, group: '学习' },
  { href: '/history', label: '占卜记录', exact: false, group: '探索' },
]

const visibleTabs = tabs.filter(t => ['/', '/eight', '/relations', '/hexagrams', '/divine'].includes(t.href))
const moreTabs = tabs.filter(t => !['/', '/eight', '/hexagrams', '/divine'].includes(t.href))

const mobileGroups = [
  { title: '📖 学习', items: tabs.filter(t => t.group === '学习') },
  { title: '🔧 工具', items: tabs.filter(t => t.group === '工具') },
  { title: '📊 探索', items: tabs.filter(t => t.group === '探索') },
]

export default function Header() {
  const pathname = usePathname()
  const [dark, setDark] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchDetailKey, setSearchDetailKey] = useState<string | null>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const moreBtnRef = useRef<HTMLButtonElement>(null)

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
    setMoreOpen(false)
  }, [pathname])

  // 点击外部关闭更多下拉
  useEffect(() => {
    if (!moreOpen) return
    const handleClick = (e: MouseEvent) => {
      if (
        moreRef.current &&
        !moreRef.current.contains(e.target as Node) &&
        moreBtnRef.current &&
        !moreBtnRef.current.contains(e.target as Node)
      ) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [moreOpen])

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

  const tabLinkClass = (t: typeof tabs[number], base = 'px-4 py-1.5 rounded-lg text-[13px] border no-underline transition-colors') =>
    `${base} ${
      isActive(t)
        ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
        : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)] hover:bg-[var(--glow)]'
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
  '/glossary': '术语解释 · 易经核心术语速查',
    '/history': '占卜记录 · 起卦历史查询',
    '/fuxi': '伏羲六十四卦方圆图 · 邵雍皇极经世',
  }

  return (
    <>
    <header className="flex items-center gap-3 px-5 py-3 md:py-6 border-b border-[var(--border)] max-w-[960px] mx-auto flex-wrap relative">
      <Link href="/" className="text-[22px] font-bold tracking-wider bg-gradient-to-r from-[var(--yang)] to-[var(--accent2)] bg-clip-text text-transparent no-underline shrink-0">
        🌀 八卦入门
      </Link>
      <span className="text-[13px] text-[var(--muted)] hidden sm:inline">每天15分钟，搞懂八卦</span>

      {/* 桌面端按钮 + 导航 */}
      <div className="ml-auto hidden md:flex items-center gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--bg2)] text-[var(--muted)] flex items-center justify-center cursor-pointer text-base hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors shrink-0"
          aria-label="搜索"
        >
          🔍
        </button>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--bg2)] text-[var(--muted)] flex items-center justify-center cursor-pointer text-base hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors shrink-0"
          aria-label="切换主题"
        >
          {dark ? '🌙' : '☀️'}
        </button>
        <PinyinBtn />
        <nav className="flex gap-1.5 items-center">
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

          {/* 更多下拉 */}
          <div className="relative">
            <button
              ref={moreBtnRef}
              onClick={() => setMoreOpen(o => !o)}
              className={`px-4 py-1.5 rounded-lg text-[13px] border no-underline transition-colors cursor-pointer ${
                moreTabs.some(t => isActive(t))
                  ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
                  : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)] hover:bg-[var(--glow)]'
              }`}
            >
              更多 {moreOpen ? '▲' : '▼'}
            </button>
            {moreOpen && (
              <div
                ref={moreRef}
                className="absolute right-0 top-full mt-2 z-50 p-2 rounded-xl bg-[var(--bg2)] border border-[var(--border)] shadow-[0_8px_32px_var(--shadow)] flex flex-col gap-1 min-w-[140px]"
              >
                {moreTabs.map(t => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={`px-4 py-2 rounded-lg text-[13px] border no-underline transition-colors whitespace-nowrap ${
                      isActive(t)
                        ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
                        : 'bg-[var(--card)] text-[var(--fg)] border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--glow)]'
                    }`}
                    data-mcp-action="navigate"
                    data-mcp-description={navDescriptions[t.href] || `前往${t.label}页面`}
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* 移动端操作按钮组 */}
      <div className="md:hidden ml-auto flex items-center gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--bg2)] text-[var(--muted)] flex items-center justify-center cursor-pointer text-base hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors shrink-0"
          aria-label="搜索"
        >
          🔍
        </button>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--bg2)] text-[var(--muted)] flex items-center justify-center cursor-pointer text-base hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors shrink-0"
          aria-label="切换主题"
        >
          {dark ? '🌙' : '☀️'}
        </button>
        <PinyinBtn />
        {/* 汉堡按钮 */}
        <button
          onClick={() => setMobileMenuOpen(o => !o)}
          className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--bg2)] text-[var(--muted)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors shrink-0 gap-[5px]"
          aria-label="菜单"
        >
          <span className={`block w-[16px] h-[2px] bg-current rounded transition-all duration-200 ${mobileMenuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`block w-[16px] h-[2px] bg-current rounded transition-all duration-200 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-[16px] h-[2px] bg-current rounded transition-all duration-200 ${mobileMenuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </div>

      {/* 移动端导航下拉 */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-50 mt-0 px-5 pb-5 origin-top animate-[menuSlide_0.2s_ease-out]">
          <nav className="flex flex-col p-3 rounded-2xl bg-[var(--bg2)] border border-[var(--border)] shadow-[0_8px_32px_var(--shadow)]">
            {mobileGroups.map((group, gi) => (
              <div key={group.title}>
                {gi > 0 && <div className="mx-3 my-2 h-px bg-[var(--border)]" />}
                <div className="px-3 py-1.5 text-[12px] text-[var(--muted)] font-medium tracking-wider">{group.title}</div>
                {group.items.map(t => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={`px-4 py-2.5 rounded-lg text-[14px] border no-underline transition-colors ${
                      isActive(t)
                        ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
                        : 'bg-[var(--card)] text-[var(--fg)] border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--glow)]'
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
