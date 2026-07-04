'use client'

import type { ReactNode } from 'react'

export interface CardFaceProps {
  front: ReactNode
  back: ReactNode
  flipped: boolean
  onFlip: () => void
  status?: 'new' | 'due' | 'learned' | 'mastered'
}

const statusLabels: Record<string, string> = {
  new: '新卡片',
  due: '待复习',
  learned: '已学',
  mastered: '已掌握',
}

export default function CardFace({ front, back, flipped, onFlip, status }: CardFaceProps) {
  return (
    <div className="perspective-[1000px] cursor-pointer" onClick={onFlip}>
      <div
        className={`relative w-full aspect-[3/4] transition-transform duration-500 preserve-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-[var(--card)] border border-[var(--border)] rounded-2xl flex flex-col items-center justify-center p-8">
          {front}
          {status && (
            <div className={`mt-4 text-[11px] px-2 py-0.5 rounded-md ${
              status === 'due' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' :
              status === 'mastered' ? 'bg-green-500/10 text-green-400' :
              'text-[var(--muted)]'
            }`}>
              {statusLabels[status]}
            </div>
          )}
          <div className="mt-3 text-[11px] text-[var(--muted)]">点击翻转</div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex flex-col items-center justify-center p-6 overflow-y-auto">
          {back}
          <div className="mt-3 text-[10px] text-[var(--muted)]">点击翻回</div>
        </div>
      </div>
    </div>
  )
}
