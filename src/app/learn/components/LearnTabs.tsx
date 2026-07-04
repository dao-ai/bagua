// src/app/learn/components/LearnTabs.tsx
'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
    <div className="flex justify-center mb-6">
      <Tabs value={mode} onValueChange={(v) => onChange(v as LearnMode)}>
        <TabsList>
          {tabs.map(t => (
            <TabsTrigger key={t.key} value={t.key} className="relative">
              {t.emoji} {t.label}
              {t.key === 'review' && reviewCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center leading-none">
                  {reviewCount > 99 ? '99+' : reviewCount}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
