'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Modal from '@/components/Modal'
import { RubyText, Ruby } from '@/components/Ruby'
import { baguaMap, getHexagramName, getHexagramSymbol } from '@/data/bagua'
import { getHexagramDetail } from '@/data/hexagrams'
import HexagramRelations from '@/components/HexagramRelations'

const ShareCard = dynamic(() => import('@/components/ShareCard'))

interface Props {
  hexagramKey: string | null   // "upperId-lowerId"
  onClose: () => void
}

/**
 * 卦象详情弹窗 — 复用自 /hexagrams 页面的 modal 内容
 *
 * 支持内部通过互/错/综卦导航切换展示的卦象，
 * 无需关闭再打开。
 */
export default function HexagramDetailModal({ hexagramKey, onClose }: Props) {
  // 支持在弹窗内部点击互/错/综卦时切换展示
  const [currentKey, setCurrentKey] = useState<string | null>(hexagramKey)
  const key = currentKey ?? hexagramKey

  if (!key) return null

  const [upperId, lowerId] = key.split('-')
  const name = getHexagramName(upperId, lowerId)
  const detail = getHexagramDetail(upperId, lowerId)
  const ud = baguaMap[upperId]
  const ld = baguaMap[lowerId]
  const sym = getHexagramSymbol(upperId, lowerId)

  return (
    <Modal open={true} onClose={onClose} label={`${name}卦详情`}>
      <div className="text-[60px] text-center block">{sym}</div>
      <h2 className="text-center text-2xl mt-1.5 mb-0.5"><RubyText text={name} /></h2>
      <p className="text-center text-sm text-[var(--muted)]">
        上<Ruby char={ud.name} />（{ud.symbol}）· 下<Ruby char={ld.name} />（{ld.symbol}）
      </p>

      {detail ? (
        <div className="mt-6 space-y-3">
          <div className="p-5 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--accent)]">
            <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">卦辞</div>
            <div className="text-base font-semibold text-[var(--accent2)]"><RubyText text={detail.judgment} /></div>
          </div>
          <div className="p-5 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--accent2)]">
            <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">象辞</div>
            <div className="text-sm italic text-[var(--fg)]"><RubyText text={detail.image} /></div>
          </div>
          <div className="p-5 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--border)]">
            <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-2">现代解读</div>
            <div className="text-sm leading-relaxed"><RubyText text={detail.meaning} /></div>
          </div>
        </div>
      ) : (
        <p className="text-center text-[var(--muted)] mt-6">解读待补充</p>
      )}

      {detail?.yaoLines && (
        <div className="mt-4">
          <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-2">爻辞</div>
          {detail.yaoLines.map((yl, i) => (
            <div key={i} className={`p-3 rounded-lg mb-1.5 text-sm ${i === 5 ? '' : 'border-b border-[var(--border)]'}`}>
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-mono text-[var(--accent2)]">{yl.pos}</span>
                <span className="font-semibold text-[var(--fg)]"><RubyText text={yl.text} /></span>
              </div>
              <div className="text-xs text-[var(--muted)] mt-0.5"><RubyText text={yl.meaning} /></div>
            </div>
          ))}
        </div>
      )}

      {/* 分享按钮 */}
      <div className="mt-4 flex justify-center">
        <ShareCard
          upperId={upperId}
          lowerId={lowerId}
          subtitle="卦象详情"
        />
      </div>

      <HexagramRelations
        upperId={upperId}
        lowerId={lowerId}
        onNavigate={(nu, nl) => setCurrentKey(`${nl}-${nu}`)}
      />
    </Modal>
  )
}
