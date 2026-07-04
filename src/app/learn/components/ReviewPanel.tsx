// src/app/learn/components/ReviewPanel.tsx
'use client'

import { useState } from 'react'
import type { Card } from '../types'
import CardFace from '@/components/CardFace'
import { RubyText } from '@/components/Ruby'

interface ReviewPanelProps {
  dueCards: Card[]
  reviewCard: (cardId: string, quality: number) => void
}

const qualityLabels = [
  { q: 0, label: '忘了', emoji: '😵', short: '完全忘了' },
  { q: 1, label: '模糊', emoji: '🤔', short: '很模糊' },
  { q: 2, label: '困难', emoji: '😅', short: '想起但难' },
  { q: 3, label: '犹豫', emoji: '🤨', short: '有点犹豫' },
  { q: 4, label: '顺利', emoji: '😊', short: '轻松想起' },
  { q: 5, label: '秒答', emoji: '⚡', short: '毫不费力' },
]

export default function ReviewPanel({ dueCards, reviewCard }: ReviewPanelProps) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)

  const current = dueCards[index] ?? null
  const total = dueCards.length

  const handleRate = (q: number) => {
    if (!current) return
    reviewCard(current.id, q)
    setFlipped(false)
    if (index + 1 >= total) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
    }
  }

  // Empty state
  if (total === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎉</div>
        <p className="text-[var(--fg)] text-lg font-semibold mb-2">今日任务完成！</p>
        <p className="text-[var(--muted)] text-sm mb-4">
          没有需要复习的卡片了，去浏览模式看看新内容吧
        </p>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-[var(--fg)] text-lg font-semibold mb-2">本轮复习完成！</p>
        <p className="text-[var(--muted)] text-sm mb-4">
          已复习 {total} 张卡片，明天继续加油
        </p>
        <button
          onClick={() => { setIndex(0); setDone(false); setFlipped(false) }}
          className="px-6 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] cursor-pointer"
        >
          再来一轮
        </button>
      </div>
    )
  }

  if (!current) return null

  return (
    <div>
      {/* Progress */}
      <div className="max-w-[360px] mx-auto mb-3">
        <div className="text-center text-[12px] font-semibold text-[var(--accent)] mb-1">
          复习 {index + 1} / {total}
        </div>
        <div className="h-1.5 bg-[var(--bg3)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="max-w-[360px] mx-auto mb-4">
        <CardFace
          flipped={flipped}
          onFlip={() => setFlipped(f => !f)}
          front={
            <div className="text-center">
              <div className="text-[56px] mb-3 whitespace-pre-wrap">{current.front}</div>
            </div>
          }
          back={
            <div className="text-center w-full">
              <div className="text-[16px] leading-relaxed whitespace-pre-wrap">
                <RubyText text={current.back} />
              </div>
            </div>
          }
        />
      </div>

      {/* Rating buttons — only show after flip */}
      {flipped && (
        <div className="max-w-[420px] mx-auto">
          <p className="text-center text-[11px] text-[var(--muted)] mb-2">你的记忆程度？</p>
          <div className="flex gap-1.5 justify-center flex-wrap">
            {qualityLabels.map(({ q, label, emoji }) => (
              <button
                key={q}
                onClick={() => handleRate(q)}
                className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5 bg-[var(--bg3)] border border-[var(--border)] text-[var(--fg)] hover:border-[var(--accent)]"
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-[10px]">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
