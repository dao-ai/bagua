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
    <div className="perspective-[1200px] cursor-pointer group/card p-[6px]" onClick={onFlip}>
      <div
        className={`relative w-full aspect-[3/4] transition-all duration-700 preserve-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ═══ FRONT — Lacquer Board ═══ */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl flex flex-col items-center justify-center overflow-hidden
                      border-2 border-[var(--border)]
                      shadow-[0_0_40px_rgba(0,0,0,0.6),0_0_0_5px_var(--bg),0_0_0_6px_var(--border)]
                      group-hover/card:shadow-[0_0_40px_rgba(0,0,0,0.6),0_0_0_5px_var(--bg),0_0_0_6px_var(--accent),0_0_24px_var(--glow)]
                      transition-shadow duration-500"
        >
          {/* Lacquer texture — subtle radial gradient */}
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_30%,#1e180e_0%,#080808_55%,#050505_100%)]"
          />
          {/* Subtle wood-grain waves */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 20% 10%, transparent 40%, rgba(255,255,255,0.06) 40.5%, transparent 41%),
                radial-gradient(ellipse at 70% 25%, transparent 35%, rgba(255,255,255,0.05) 35.5%, transparent 36%),
                radial-gradient(ellipse at 40% 50%, transparent 45%, rgba(255,255,255,0.04) 45.5%, transparent 46%),
                radial-gradient(ellipse at 80% 70%, transparent 50%, rgba(255,255,255,0.05) 50.5%, transparent 51%),
                radial-gradient(ellipse at 15% 85%, transparent 38%, rgba(255,255,255,0.04) 38.5%, transparent 39%)
              `,
            }}
          />

          {/* Corner studs */}
          <span className="absolute top-4 left-4 text-[11px] text-[var(--muted)]/15 select-none pointer-events-none">◆</span>
          <span className="absolute top-4 right-4 text-[11px] text-[var(--muted)]/15 select-none pointer-events-none">◆</span>
          <span className="absolute bottom-14 left-4 text-[11px] text-[var(--muted)]/15 select-none pointer-events-none">◆</span>
          <span className="absolute bottom-14 right-4 text-[11px] text-[var(--muted)]/15 select-none pointer-events-none">◆</span>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-5 px-10">
            {front}
            {status && (
              <Badge variant={statusVariant[status]}>
                {statusLabels[status]}
              </Badge>
            )}
          </div>

          {/* Flip hint — subtle glyph that glows on hover */}
          <div className="absolute bottom-7 text-[18px] tracking-[8px] text-[var(--muted)]/10
                          group-hover/card:text-[var(--accent)]/30 group-hover/card:tracking-[12px]
                          transition-all duration-700 select-none pointer-events-none">
            ⠿⠿
          </div>
        </div>

        {/* ═══ BACK — Antique Scroll ═══ */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl flex flex-col overflow-hidden
                      border-2 border-[var(--border)]
                      shadow-[0_0_40px_rgba(0,0,0,0.6),0_0_0_5px_var(--bg),0_0_0_6px_var(--border)]
                      group-hover/card:shadow-[0_0_40px_rgba(0,0,0,0.6),0_0_0_5px_var(--bg),0_0_0_6px_var(--accent),0_0_24px_var(--glow)]
                      transition-shadow duration-500"
        >
          {/* Antique paper background */}
          <div
            className="absolute inset-0 bg-[#221c12]"
          />
          {/* Bamboo-slip horizontal lines */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  to bottom,
                  transparent,
                  transparent 27px,
                  rgba(255,255,255,0.3) 27px,
                  rgba(255,255,255,0.3) 28px
                )
              `,
            }}
          />
          {/* Subtle paper fiber noise */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 15% 10%, rgba(255,255,255,0.2) 0%, transparent 3%),
                radial-gradient(circle at 85% 20%, rgba(0,0,0,0.2) 0%, transparent 4%),
                radial-gradient(circle at 50% 40%, rgba(255,255,255,0.15) 0%, transparent 2%),
                radial-gradient(circle at 30% 75%, rgba(0,0,0,0.2) 0%, transparent 3%),
                radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 2%),
                radial-gradient(circle at 10% 90%, rgba(0,0,0,0.15) 0%, transparent 3%)
              `,
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto thin-scroll">
            {back}
          </div>

          {/* Watermark — yin-yang */}
          <div className="absolute right-2 bottom-2 text-[100px] opacity-[0.025] select-none pointer-events-none rotate-12 text-[var(--fg)]">
            ☯
          </div>

          {/* Flip hint */}
          <div className="relative z-10 flex justify-center pb-2">
            <div className="text-[10px] text-[var(--muted)]/25 select-none pointer-events-none
                            group-hover/card:text-[var(--muted)]/50 transition-all duration-700
                            tracking-widest">
              ◈
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
