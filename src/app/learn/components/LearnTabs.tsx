// src/app/learn/components/LearnTabs.tsx
'use client'

export type LearnMode = 'browse' | 'review' | 'quiz'

interface LearnTabsProps {
  mode: LearnMode
  onChange: (mode: LearnMode) => void
  reviewCount: number
}

const tabs: { key: LearnMode; label: string; emoji: string }[] = [
  { key: 'browse', label: '浏览', emoji: '📖' },
  { key: 'review', label: '复习', emoji: '🔄' },
  { key: 'quiz', label: '测验', emoji: '🎯' },
]

export default function LearnTabs({ mode, onChange, reviewCount }: LearnTabsProps) {
  return (
    <div className="flex justify-center gap-2 mb-6">
      <div className="flex gap-1.5 p-1 rounded-xl bg-[var(--bg2)] border border-[var(--border)]">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`relative px-4 py-1.5 text-xs rounded-lg cursor-pointer transition-colors ${
              mode === t.key
                ? 'bg-[var(--accent)] text-[var(--bg)] font-semibold'
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >
            {t.emoji} {t.label}
            {t.key === 'review' && reviewCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
                {reviewCount > 99 ? '99+' : reviewCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
