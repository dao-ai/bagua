'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { usePinyin } from '@/contexts/PinyinContext'

const tabs = [
  { href: '/', label: '日签', exact: true },
  { href: '/eight', label: '八卦', exact: false },
  { href: '/hexagrams', label: '64卦', exact: false },
  { href: '/divine', label: '起卦', exact: false },
  { href: '/simulator', label: '变爻模拟', exact: false },
  { href: '/contrast', label: '先天后天', exact: false },
  { href: '/compare', label: '卦对比', exact: false },
  { href: '/flashcard', label: '闪卡', exact: false },
  { href: '/lifegua', label: '本命卦', exact: false },
  { href: '/glossary', label: '术语', exact: false },
  { href: '/history', label: '历史', exact: false },
]

export default function Header() {
  const pathname = usePathname()
  const [dark, setDark] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  // 页面切换时关闭移动端菜单
  useEffect(() => {
    setMobileMenuOpen(false)
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

  return (
    <header className="flex items-center gap-3 px-5 py-6 border-b border-[var(--border)] max-w-[960px] mx-auto flex-wrap relative">
      <Link href="/" className="text-[22px] font-bold tracking-wider bg-gradient-to-r from-[var(--yang)] to-[var(--accent2)] bg-clip-text text-transparent no-underline shrink-0">
        ☰ 八卦入门
      </Link>
      <span className="text-[13px] text-[var(--muted)] hidden sm:inline">每天15分钟，搞懂八卦</span>

      {/* 桌面端按钮 + 导航 */}
      <div className="ml-auto hidden md:flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--bg2)] text-[var(--muted)] flex items-center justify-center cursor-pointer text-base hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors shrink-0"
          aria-label="切换主题"
        >
          {dark ? '🌙' : '☀️'}
        </button>
        <PinyinBtn />
        <nav className="flex gap-1.5">
          {tabs.map(t => (
            <Link
              key={t.href}
              href={t.href}
              className={`px-4 py-1.5 rounded-lg text-[13px] border no-underline transition-colors ${
                isActive(t)
                  ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
                  : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* 移动端操作按钮组 */}
      <div className="md:hidden ml-auto flex items-center gap-2">
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
        <div className="md:hidden absolute top-full left-0 right-0 z-50 mt-0 px-5 pb-5 animate-[fadeIn_0.2s_ease]">
          <nav className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[var(--bg2)] border border-[var(--border)] shadow-[0_8px_32px_var(--shadow)]">
            {tabs.map(t => (
              <Link
                key={t.href}
                href={t.href}
                className={`px-4 py-2.5 rounded-lg text-[14px] border no-underline transition-colors ${
                  isActive(t)
                    ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
                    : 'bg-[var(--card)] text-[var(--fg)] border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
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
