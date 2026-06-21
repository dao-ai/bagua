'use client'

import { useMemo } from 'react'
import { baguaMap } from '@/data/bagua'
import { getInterlocking, getOpposite, getInverted } from '@/data/hexagramRelations'
import { RubyText, Ruby } from '@/components/Ruby'

interface Props {
  upperId: string
  lowerId: string
  /** 点击关系卦时的导航回调（可选），传递该卦的upperId/lowerId */
  onNavigate?: (upperId: string, lowerId: string) => void
}

interface RelationCard {
  type: string
  label: string
  hint: string
  result: { upperId: string; lowerId: string; name: string; symbol: string } | null
}

export default function HexagramRelations({ upperId, lowerId, onNavigate }: Props) {
  const cards: RelationCard[] = useMemo(() => [
    {
      type: '互卦',
      label: '内在演化',
      hint: '取二至五爻重新组合，揭示内在变化趋势',
      result: getInterlocking(upperId, lowerId),
    },
    {
      type: '错卦',
      label: '对立视角',
      hint: '全爻阴阳相反，从对立面观察事物',
      result: getOpposite(upperId, lowerId),
    },
    {
      type: '综卦',
      label: '反转视角',
      hint: '六爻上下颠倒，站在对方角度看问题',
      result: getInverted(upperId, lowerId),
    },
  ], [upperId, lowerId])

  // 同一卦时避免导航回自己
  const isSame = (u: string, l: string) => u === upperId && l === lowerId

  return (
    <div className="mt-6">
      <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-3">互卦 · 错卦 · 综卦</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map(card => {
          const r = card.result
          return (
            <div
              key={card.type}
              className={`bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 text-center transition-all duration-300
                ${r && !isSame(r.upperId, r.lowerId) && onNavigate
                  ? 'cursor-pointer hover:border-[var(--accent)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--shadow)]'
                  : ''}`}
              onClick={() => {
                if (r && !isSame(r.upperId, r.lowerId) && onNavigate) {
                  onNavigate(r.upperId, r.lowerId)
                }
              }}
            >
              {/* 类型标签 */}
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1.5">{card.type}</div>

              {r ? (
                <>
                  {/* 卦符 - 大字 */}
                  <div className="text-[36px] leading-none mb-1">{r.symbol}</div>

                  {/* 卦名 */}
                  <div className="font-semibold text-base leading-tight mb-0.5">
                    <RubyText text={r.name} />
                  </div>

                  {/* 上下卦 */}
                  <div className="text-[11px] text-[var(--muted)] mb-2">
                    上<Ruby char={baguaMap[r.upperId]?.name || ''} />·下<Ruby char={baguaMap[r.lowerId]?.name || ''} />
                  </div>

                  {/* 简短说明 */}
                  <div className="text-[10px] text-[var(--accent)] font-medium">{card.label}</div>
                  <div className="text-[10px] text-[var(--muted)] leading-relaxed mt-0.5">{card.hint}</div>
                </>
              ) : (
                <div className="py-6 text-[var(--muted)]">
                  <div className="text-2xl mb-1">—</div>
                  <div className="text-[11px]">计算失败</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
