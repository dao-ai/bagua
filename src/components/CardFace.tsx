'use client'

import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'

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

const statusVariant: Record<string, 'secondary' | 'default' | 'outline'> = {
  new: 'secondary',
  due: 'default',
  learned: 'secondary',
  mastered: 'outline',
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
            <Badge variant={statusVariant[status]} className="mt-4">
              {statusLabels[status]}
            </Badge>
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
