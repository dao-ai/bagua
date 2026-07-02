'use client'
import usePageTitle from '@/hooks/usePageTitle'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'
import Modal from '@/components/Modal'
import { RubyText, Ruby } from '@/components/Ruby'
import { baguaMap, getHexagramName, getHexagramSymbol } from '@/data/bagua'
import { getHexagramDetail, hexagramOrder } from '@/data/hexagrams'
import ShareCard from '@/components/ShareCard'
import HexagramRelations from '@/components/HexagramRelations'

export default function HexagramsPage() {
  usePageTitle()
  const [modal, setModal] = useState<React.ReactNode | null>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null) }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const openDetail = (u: string, l: string) => {
    const name = getHexagramName(u, l)
    const detail = getHexagramDetail(u, l)
    const ud = baguaMap[u], ld = baguaMap[l]
    const sym = getHexagramSymbol(u, l)
    setModal(
      <div>
        <div className="text-[60px] text-center block">{sym}</div>
        <h2 className="text-center text-2xl mt-1.5 mb-0.5"><RubyText text={name} /></h2>
        <p className="text-center text-sm text-[var(--muted)]">上<Ruby char={ud.name} />（{ud.symbol}）· 下<Ruby char={ld.name} />（{ld.symbol}）</p>
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
        ) : <p className="text-center text-[var(--muted)] mt-6">解读待补充</p>}
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
            upperId={u}
            lowerId={l}
            subtitle="卦象详情"
          />
        </div>

        <HexagramRelations upperId={u} lowerId={l} onNavigate={(nu, nl) => openDetail(nu, nl)} />
      </div>
    )
  }

  return (
    <>
      <PageHeader title="六十四卦" subtitle="八卦两两相叠，成六十四卦。点击任一卦，查看卦辞与解读。" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {hexagramOrder.map(([u, l], idx) => {
          const name = getHexagramName(u, l)
          const detail = getHexagramDetail(u, l)
          const sym = getHexagramSymbol(u, l)
          const ud = baguaMap[u], ld = baguaMap[l]
          return (
            <div
              key={u + l}
              onClick={() => openDetail(u, l)}
              className="group relative bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 cursor-pointer transition-all duration-300 hover:border-[var(--accent)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_var(--shadow)]
                before:content-[''] before:absolute before:top-0 before:left-3 before:right-3 before:h-[2.5px] before:bg-gradient-to-r before:from-transparent before:via-[var(--accent)] before:to-transparent before:rounded-b before:opacity-0 before:transition-opacity before:duration-300
                group-hover:before:opacity-100"
            >
              {/* 卦序号 */}
              <div className="text-[10px] font-mono text-[var(--muted)] mb-1 tracking-wider">
                #{String(idx + 1).padStart(2, '0')}
              </div>

              <div className="flex items-start gap-3">
                <div className="text-[28px] shrink-0 leading-none pt-0.5">{sym}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-base leading-tight">
                    <RubyText text={name} />
                  </div>
                  <div className="text-[11px] text-[var(--muted)] mt-0.5">
                    上<Ruby char={ud.name} /> · 下<Ruby char={ld.name} />
                  </div>
                  {detail?.judgment && (
                    <div className="text-[11px] text-[var(--accent2)] mt-1.5 truncate leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      <RubyText text={detail.judgment} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} label="卦象详情">{modal}</Modal>
    </>
  )
}
