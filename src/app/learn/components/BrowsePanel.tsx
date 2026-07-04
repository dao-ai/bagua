// src/app/learn/components/BrowsePanel.tsx
'use client'

import { useState, useMemo } from 'react'
import type { Card, CardType } from '../types'
import CardFace from '@/components/CardFace'
import { RubyText } from '@/components/Ruby'

interface BrowsePanelProps {
  cards: Card[]
  markLearned: (id: string) => void
  markForReview: (id: string) => void
  todayStr: string
}

const typeLabels: Record<CardType, string> = {
  trigram: '八卦',
  hexagram: '六十四卦',
  yao: '爻辞',
  relation: '卦关系',
}

function getCardStatus(card: Card, todayStr: string): 'new' | 'due' | 'learned' | 'mastered' {
  if (card.interval >= 21) return 'mastered'
  if (card.nextReview <= todayStr) return card.learned ? 'due' : 'new'
  return 'learned'
}

export default function BrowsePanel({ cards, markLearned, markForReview, todayStr }: BrowsePanelProps) {
  const [filter, setFilter] = useState<CardType | 'all'>('all')
  const [search, setSearch] = useState('')
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const filtered = useMemo(() => {
    let list = filter === 'all' ? cards : cards.filter(c => c.type === filter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(c =>
        c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q)
      )
    }
    return list
  }, [cards, filter, search])

  const current = filtered[index] ?? null

  const goTo = (i: number) => {
    setFlipped(false)
    if (filtered.length === 0) return
    setIndex(((i % filtered.length) + filtered.length) % filtered.length)
  }

  const next = () => goTo(index + 1)
  const prev = () => goTo(index - 1)

  // Progress per type
  const typeProgress = useMemo(() => {
    const result: Record<string, { total: number; learned: number }> = {}
    for (const t of ['trigram', 'hexagram', 'yao', 'relation'] as CardType[]) {
      const ofType = cards.filter(c => c.type === t)
      result[t] = {
        total: ofType.length,
        learned: ofType.filter(c => c.learned).length,
      }
    }
    return result
  }, [cards])

  if (!current) {
    return (
      <div className="text-center py-12 text-[var(--muted)]">
        <div className="text-4xl mb-3">🔍</div>
        <p>没有匹配的卡片</p>
        {search && <button onClick={() => setSearch('')} className="mt-2 text-xs text-[var(--accent)] underline cursor-pointer">清除搜索</button>}
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center mb-4">
        <div className="flex gap-1 p-1 rounded-lg bg-[var(--bg3)] border border-[var(--border)] mx-auto">
          {(['all', 'trigram', 'hexagram', 'yao', 'relation'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setFilter(t); goTo(0) }}
              className={`px-2.5 py-1 text-[11px] rounded-md cursor-pointer transition-colors ${
                filter === t
                  ? 'bg-[var(--accent)] text-[var(--bg)] font-semibold'
                  : 'text-[var(--muted)] hover:text-[var(--fg)]'
              }`}
            >
              {t === 'all' ? '全部' : typeLabels[t]}
              {t !== 'all' && (
                <span className="ml-1 opacity-60">
                  {typeProgress[t].learned}/{typeProgress[t].total}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); goTo(0) }}
          placeholder="搜索卦名..."
          className="w-full max-w-xs px-3 py-1.5 text-[12px] rounded-lg bg-[var(--bg2)] border border-[var(--border)] text-[var(--fg)] placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]"
        />
      </div>

      {/* Progress bar */}
      <div className="max-w-[360px] mx-auto mb-3">
        <div className="text-center text-[11px] text-[var(--muted)] mb-1">
          {filtered.length > 0 ? `${((index % filtered.length) + 1)} / ${filtered.length}` : '0 / 0'}
        </div>
        <div className="h-1 bg-[var(--bg3)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
            style={{ width: `${filtered.length > 0 ? (((index % filtered.length) + 1) / filtered.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="max-w-[360px] mx-auto mb-4">
        <CardFace
          flipped={flipped}
          onFlip={() => {
            setFlipped(f => !f)
            if (!flipped) markLearned(current.id)
          }}
          status={getCardStatus(current, todayStr)}
          front={
            <div className="text-center">
              <div className="text-[12px] text-[var(--muted)] mb-2">{typeLabels[current.type]}</div>
              <div className="text-[56px] mb-3 whitespace-pre-wrap">{current.front}</div>
            </div>
          }
          back={
            <div className="text-center w-full">
              <div className="text-[12px] text-[var(--muted)] mb-2">{typeLabels[current.type]}</div>
              <div className="text-[14px] leading-relaxed whitespace-pre-wrap">
                <RubyText text={current.back} />
              </div>
            </div>
          }
        />
        {/* Action buttons */}
        <div className="flex justify-center gap-2 mt-3">
          <button
            onClick={() => markForReview(current.id)}
            className="px-3 py-1 text-[11px] rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] cursor-pointer transition-colors"
          >
            标记复习
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center items-center gap-3">
        <button
          onClick={prev}
          className="px-4 py-2 text-sm rounded-xl bg-[var(--bg3)] border border-[var(--border)] text-[var(--fg)] cursor-pointer hover:bg-[var(--bg2)] transition-colors disabled:opacity-30"
          disabled={filtered.length <= 1}
        >← 上一张</button>
        <span className="text-[11px] text-[var(--muted)] min-w-[40px] text-center">
          {filtered.length > 0 ? `${((index % filtered.length) + 1)}/${filtered.length}` : '0'}
        </span>
        <button
          onClick={next}
          className="px-4 py-2 text-sm rounded-xl bg-[var(--bg3)] border border-[var(--border)] text-[var(--fg)] cursor-pointer hover:bg-[var(--bg2)] transition-colors disabled:opacity-30"
          disabled={filtered.length <= 1}
        >下一张 →</button>
      </div>
    </div>
  )
}
