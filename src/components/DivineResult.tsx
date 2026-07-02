'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import YaoLine from '@/components/Yao'
import { RubyText, Ruby } from '@/components/Ruby'
import LiuyaoPan from '@/components/LiuyaoPan'
import HexagramRelations from '@/components/HexagramRelations'
import { computeLiuyao } from '@/data/liuyao'
import type { LiuyaoResult } from '@/data/liuyao'
import type { DivineResult } from '@/hooks/divineTypes'

const ShareCard = dynamic(() => import('@/components/ShareCard'))
const ThreeYaoHexagram = dynamic(() => import('@/components/ThreeYaoHexagram'), { ssr: false })

export default function DivineResult({ result }: { result: DivineResult }) {
  const [showLiuyao, setShowLiuyao] = useState(false)
  const [dayStem, setDayStem] = useState('甲')
  const liuyaoResult: LiuyaoResult | null = showLiuyao
    ? computeLiuyao(result.upperId, result.lowerId, dayStem)
    : null
  const [animPhase, setAnimPhase] = useState<'idle' | 'flash' | 'flip' | 'revert' | 'done'>('idle')
  const r = result

  const resultKey = `${r.hexName}-${r.changedHexName}-${r.movingIndex}`
  useEffect(() => { setAnimPhase('idle') }, [resultKey])

  useEffect(() => {
    if (animPhase === 'flash') {
      const t = setTimeout(() => setAnimPhase('flip'), 1000)
      return () => clearTimeout(t)
    }
    if (animPhase === 'flip') {
      const t = setTimeout(() => setAnimPhase('revert'), 750)
      return () => clearTimeout(t)
    }
    if (animPhase === 'revert') {
      const t = setTimeout(() => setAnimPhase('done'), 500)
      return () => clearTimeout(t)
    }
  }, [animPhase])

  const isAnimating = animPhase !== 'idle' && animPhase !== 'done' && animPhase !== 'revert'
  const showChanged = animPhase === 'revert' || animPhase === 'done'

  let animClass = ''
  if (animPhase === 'flash') animClass = 'yl-flash'
  if (animPhase === 'flip') animClass = r.movingChange === '阳变阴' ? 'yl-flip-yang' : 'yl-flip-yin'

  return (
    <div className="mt-6 p-6 bg-[var(--bg2)] rounded-xl animate-[fadeIn_0.4s_ease]">
      <div className="flex justify-center gap-8 items-start text-center max-sm:flex-col max-sm:gap-4">
        {/* 本卦 */}
        <div className="flex-1">
          <h4 className="text-[11px] uppercase tracking-widest text-[var(--muted)] mb-2.5">本卦</h4>
          <div id="hex-now"><ThreeYaoHexagram
                lines={r.yao6 as [number, number, number, number, number, number]}
                size={200}
                autoRotate
                interactive={false}
              /></div>
          <div className="text-[22px] font-bold mt-1.5">{r.nowSymbol} <RubyText text={r.hexName} /><br /><span className="text-sm font-normal text-[var(--muted)]">上<Ruby char={r.upperName} /> 下<Ruby char={r.lowerName} /></span></div>
          {r.nowDetail && (
            <div className="mt-2.5 p-3 rounded-lg bg-[var(--bg3)] text-left">
              <div className="text-base font-semibold mb-1.5 text-[var(--accent2)]"><RubyText text={r.nowDetail.judgment} /></div>
              <div className="text-xs italic text-[var(--muted)] mb-1.5"><RubyText text={r.nowDetail.image} /></div>
              <div className="text-sm leading-relaxed"><RubyText text={r.nowDetail.meaning} /></div>
            </div>
          )}
        </div>

        {/* 变爻 — 点击触发动画 */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-[11px] text-[var(--accent2)] font-semibold tracking-wider">{r.movingName}</div>
          <button onClick={() => { if (!isAnimating) setAnimPhase('flash') }}
            className={`bg-transparent border-none p-0 cursor-pointer transition-all duration-300 ${isAnimating ? '' : 'hover:scale-110'} ${animPhase === 'flash' || animPhase === 'flip' ? 'pointer-events-none' : ''}`}
            title={isAnimating ? '' : (showChanged ? '再演示一次' : '点击演示变爻')}
            aria-label={showChanged ? '再演示一次变爻' : '点击演示变爻'}
          >
            {animPhase === 'done' ? (
              <div className="flex flex-col items-center gap-1">
                <div className="text-xs text-[var(--muted)] mb-0.5">{r.movingChange}</div>
                <YaoLine yang={r.changedYao6[r.movingIndex] === 1}
                  className="shadow-[0_0_10px_var(--accent)] rounded-sm" />
                <div className="text-[10px] text-[var(--accent2)] mt-1">✓ 点击再演</div>
              </div>
            ) : animPhase !== 'idle' ? (
              <div className="flex flex-col items-center gap-1">
                <div className="text-xs text-[var(--muted)] mb-0.5">{animPhase === 'flash' ? '⋯ 闪烁' : '⋯ 翻转'}</div>
                <YaoLine yang={r.yao6[r.movingIndex] === 1}
                  className="shadow-[0_0_10px_var(--accent)] rounded-sm" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <div className="text-[10px] text-[var(--accent2)] font-semibold mb-0.5">◈ 点我</div>
                <YaoLine yang={r.yao6[r.movingIndex] === 1}
                  className="shadow-[0_0_12px_var(--accent),0_0_28px_var(--glow)] yl-moving rounded-sm" />
                <div className="text-[10px] text-[var(--muted)] mt-0.5">演示变爻</div>
              </div>
            )}
          </button>
        </div>

        {/* 变卦 */}
        <div className="flex-1" style={{ opacity: showChanged ? 1 : 0.5, transition: 'opacity 0.5s ease' }}>
          <h4 className="text-[11px] uppercase tracking-widest text-[var(--muted)] mb-2.5">变卦</h4>
          <div id="hex-changed"><ThreeYaoHexagram
                lines={r.changedYao6 as [number, number, number, number, number, number]}
                size={200}
                autoRotate
                interactive={false}
              /></div>
          <div className="text-[22px] font-bold mt-1.5">{r.changedSymbol} <RubyText text={r.changedHexName} /><br /><span className="text-sm font-normal text-[var(--muted)]">上<Ruby char={r.changedUpperName} /> 下<Ruby char={r.changedLowerName} /></span></div>
          {r.changedDetail && (
            <div className="mt-2.5 p-3 rounded-lg bg-[var(--bg3)] text-left">
              <div className="text-base font-semibold mb-1.5 text-[var(--accent2)]"><RubyText text={r.changedDetail.judgment} /></div>
              <div className="text-xs italic text-[var(--muted)] mb-1.5"><RubyText text={r.changedDetail.image} /></div>
              <div className="text-sm leading-relaxed"><RubyText text={r.changedDetail.meaning} /></div>
            </div>
          )}
        </div>
      </div>

      {/* 变爻爻辞 */}
      {showChanged && r.nowDetail?.yaoLines && r.nowDetail.yaoLines[5 - r.movingIndex] && (() => {
        const yl = r.nowDetail!.yaoLines![5 - r.movingIndex]
        return (
          <div className="mt-3 p-4 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--accent2)] text-left">
            <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">{yl.pos}</div>
            <div className="text-sm font-semibold text-[var(--accent2)] mb-1"><RubyText text={yl.text} /></div>
            <div className="text-xs leading-relaxed text-[var(--fg)]"><RubyText text={yl.meaning} /></div>
          </div>
        )
      })()}

      {/* 已保存标记 */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[var(--muted)]">
        <span>✓ 已保存到历史记录</span>
      </div>

      {/* 六爻排盘切换按钮 */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setShowLiuyao(v => !v)}
          className={`px-4 py-1.5 text-xs rounded-lg border cursor-pointer transition-all
            ${showLiuyao
              ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
              : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
            }`}
        >
          {showLiuyao ? '▲ 收起排盘' : '📋 六爻排盘'}
        </button>
      </div>

      {/* 六爻排盘内容 */}
      {showLiuyao && liuyaoResult && (
        <div className="mt-3 animate-[fadeIn_0.3s_ease]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[11px] text-[var(--muted)]">日干：</span>
            <select
              value={dayStem}
              onChange={e => setDayStem(e.target.value)}
              className="px-2 py-1 text-xs rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-[var(--fg)] outline-none focus:border-[var(--accent)] cursor-pointer"
            >
              {['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'].map(s => (
                <option key={s} value={s}>{s}日</option>
              ))}
            </select>
          </div>
          <LiuyaoPan result={liuyaoResult} />
        </div>
      )}

      {/* 分享按钮 */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <ShareCard upperId={r.upperId} lowerId={r.lowerId} subtitle="起卦结果" />
      </div>
      <HexagramRelations upperId={r.upperId} lowerId={r.lowerId} />
    </div>
  )
}
