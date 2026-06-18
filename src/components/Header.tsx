'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const tabs = [
  { href: '/', label: '八卦', exact: true },
  { href: '/binary', label: '二进制', exact: false },
  { href: '/hexagrams', label: '64卦', exact: false },
  { href: '/divine', label: '起卦', exact: false },
]

export default function Header() {
  const pathname = usePathname()
  const [dark, setDark] = useState(true)

  const isActive = (t: typeof tabs[number]) =>
    t.exact ? pathname === t.href : pathname.startsWith(t.href)

  useEffect(() => {
    const saved = localStorage.getItem('bg-theme')
    const isDark = saved !== 'classic'
    setDark(isDark)
    const vars: [string, string, string][] = [
      ['--bg', '#0b1120', '#f5f0e8'],
      ['--bg2', '#141d33', '#efe8d8'],
      ['--bg3', '#1e2a45', '#e0d5c0'],
      ['--fg', '#e2e8f0', '#3d2b1f'],
      ['--muted', '#7e8ba3', '#8b7355'],
      ['--accent', '#d97706', '#c23b22'],
      ['--accent2', '#f59e0b', '#a52a2a'],
      ['--card', '#141d33', '#faf6ee'],
      ['--border', '#1e2a45', '#d4c5a9'],
      ['--yang', '#f59e0b', '#3d2b1f'],
      ['--yin', '#4a5a7a', '#a09070'],
      ['--risk', '#f87171', '#c23b22'],
      ['--glow', 'rgba(245,158,11,.15)', 'rgba(194,59,34,.1)'],
      ['--shadow', 'rgba(0,0,0,.4)', 'rgba(60,40,20,.12)'],
    ]
    vars.forEach(([k, d, c]) => document.documentElement.style.setProperty(k, isDark ? d : c))
  }, [dark])

  const toggleTheme = () => setDark(d => !d)

  return (
    <header className="flex items-center gap-3 px-5 py-6 border-b border-[var(--border)] max-w-[960px] mx-auto flex-wrap">
      <Link href="/" className="text-[22px] font-bold tracking-wider bg-gradient-to-r from-[var(--yang)] to-[var(--accent2)] bg-clip-text text-transparent no-underline">
        ☰ 八卦入门
      </Link>
      <span className="text-[13px] text-[var(--muted)]">每天15分钟，搞懂八卦</span>
      <div className="ml-auto flex items-center gap-2 flex-wrap">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--bg2)] text-[var(--muted)] flex items-center justify-center cursor-pointer text-base hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors"
          aria-label="切换主题"
        >
          {dark ? '🌙' : '☀️'}
        </button>
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
    </header>
  )
}
