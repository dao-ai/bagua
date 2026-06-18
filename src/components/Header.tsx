'use client'

import { useState, useEffect } from 'react'

const tabs = [
  { id: 'home', label: '八卦' },
  { id: 'binary', label: '二进制' },
  { id: 'hexagrams', label: '64卦' },
  { id: 'divine', label: '起卦' },
]

export default function Header({ activeTab, onTabChange }: {
  activeTab: string
  onTabChange: (id: string) => void
}) {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('bg-theme')
    const isDark = saved !== 'classic'
    setDark(isDark)
    document.documentElement.classList.toggle('dark', !isDark)
    document.documentElement.style.setProperty('--bg', isDark ? '#0b1120' : '#f5f0e8')
    document.documentElement.style.setProperty('--bg2', isDark ? '#141d33' : '#efe8d8')
    document.documentElement.style.setProperty('--bg3', isDark ? '#1e2a45' : '#e0d5c0')
    document.documentElement.style.setProperty('--fg', isDark ? '#e2e8f0' : '#3d2b1f')
    document.documentElement.style.setProperty('--muted', isDark ? '#7e8ba3' : '#8b7355')
    document.documentElement.style.setProperty('--accent', isDark ? '#d97706' : '#c23b22')
    document.documentElement.style.setProperty('--accent2', isDark ? '#f59e0b' : '#a52a2a')
    document.documentElement.style.setProperty('--card', isDark ? '#141d33' : '#faf6ee')
    document.documentElement.style.setProperty('--border', isDark ? '#1e2a45' : '#d4c5a9')
    document.documentElement.style.setProperty('--yang', isDark ? '#f59e0b' : '#3d2b1f')
    document.documentElement.style.setProperty('--yin', isDark ? '#4a5a7a' : '#a09070')
    document.documentElement.style.setProperty('--risk', isDark ? '#f87171' : '#c23b22')
  }, [dark])

  const toggleTheme = () => setDark(d => !d)

  return (
    <header className="flex items-center gap-3 px-5 py-6 border-b border-[var(--border)] max-w-[960px] mx-auto flex-wrap">
      <h1 className="text-[22px] font-bold tracking-wider bg-gradient-to-r from-[var(--yang)] to-[var(--accent2)] bg-clip-text text-transparent">
        ☰ 八卦入门
      </h1>
      <span className="text-[13px] text-[var(--muted)]">每天15分钟，搞懂八卦</span>
      <div className="ml-auto flex items-center gap-2 flex-wrap">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--bg2)] text-[var(--muted)] flex items-center justify-center cursor-pointer text-base hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors"
        >
          {dark ? '🌙' : '☀️'}
        </button>
        <nav className="flex gap-1.5">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`px-4 py-1.5 rounded-lg text-[13px] border cursor-pointer transition-colors ${
                activeTab === t.id
                  ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
                  : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
