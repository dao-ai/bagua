'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import YaoLine from '@/components/Yao'
import { RubyText, Ruby } from '@/components/Ruby'
import LiuyaoPan from '@/components/LiuyaoPan'
import HexagramRelations from '@/components/HexagramRelations'
import { computeLiuyao } from '@/data/liuyao'
import { getHexagramDetail } from '@/data/hexagrams'
import { analyzeDivination } from '@/data/divination'
import type { LiuyaoResult } from '@/data/liuyao'
import type { DivineResult } from '@/hooks/divineTypes'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const ShareCard = dynamic(() => import('@/components/ShareCard'))
const ThreeYaoHexagram = dynamic(() => import('@/components/ThreeYaoHexagram'), { ssr: false })

const YAO_POS_LABELS = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'] as const

export default function DivineResult({ result }: { result: DivineResult }) {
  const [showLiuyao, setShowLiuyao] = useState(false)
  const [dayStem, setDayStem] = useState('甲')
  const liuyaoResult: LiuyaoResult | null = showLiuyao
    ? computeLiuyao(result.upperId, result.lowerId, dayStem)
    : null
  const [animPhase, setAnimPhase] = useState<'idle' | 'flash' | 'flip' | 'revert' | 'done'>('idle')
  const r = result

  // 按传统变占规则给出断卦依据（静卦不造变爻）
  const analysis = useMemo(
    () => analyzeDivination(
      r.yao6,
      r.movingKeys ?? (r.movingIndex >= 0 ? [6 - r.movingIndex] : []),
      getHexagramDetail,
    ),
    [r.yao6, r.movingKeys, r.movingIndex],
  )

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

  // 全部变爻：自上而下排列，逐爻同步演示
  const movingKeys = r.movingKeys ?? (r.movingIndex >= 0 ? [6 - r.movingIndex] : [])
  const movingIndexes = movingKeys.map(k => 6 - k)
  const movingRows = [...movingKeys].sort((a, b) => b - a).map(k => {
    const idx = 6 - k
    const wasYang = r.yao6[idx] === 1
    const willBeYang = r.changedYao6[idx] === 1
    const anim = animPhase === 'flash'
      ? 'yl-flash'
      : animPhase === 'flip'
        ? (wasYang ? 'yl-flip-yang' : 'yl-flip-yin')
        : ''
    return { key: k, idx, wasYang, willBeYang, anim, pos: YAO_POS_LABELS[k - 1] }
  })

  return (
    <Card className="mt-6 animate-[fadeIn_0.4s_ease]">
      <CardContent className="p-6">
      <div className="flex justify-center gap-8 items-start text-center max-sm:flex-col max-sm:gap-4">
        {/* 本卦 */}
        <div className="flex-1">
          <h4 className="text-[11px] uppercase tracking-widest text-[var(--muted)] mb-2.5">本卦</h4>
          <div id="hex-now"><ThreeYaoHexagram
                lines={r.yao6 as [number, number, number, number, number, number]}
                size={200}
                autoRotate
                interactive={false}
                changingIndexes={movingIndexes}
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
          {r.movingIndex < 0 && (
            <div className="flex flex-col items-center gap-1 py-4 text-center">
              <div className="text-[26px] text-[var(--muted)] opacity-50">☯</div>
              <div className="text-[10px] text-[var(--muted)]">无变爻<br />以本卦卦辞为断</div>
            </div>
          )}
          {r.movingIndex >= 0 && (
          <button onClick={() => { if (!isAnimating) setAnimPhase('flash') }}
            className={`bg-transparent border-none p-0 cursor-pointer transition-all duration-300 ${isAnimating ? '' : 'hover:scale-105'} ${animPhase === 'flash' || animPhase === 'flip' ? 'pointer-events-none' : ''}`}
            title={isAnimating ? '' : (showChanged ? '再演示一次' : '点击演示变爻')}
            aria-label={showChanged ? '再演示一次变爻' : '点击演示变爻'}
          >
            <div className="flex flex-col items-center gap-[6px]">
              {movingRows.map(row => (
                <div key={row.key} className="flex items-center gap-1.5">
                  <span className="w-[26px] text-right text-[10px] text-[var(--muted)]">{row.pos}</span>
                  <YaoLine
                    yang={animPhase === 'done' ? row.willBeYang : row.wasYang}
                    animClass={row.anim}
                    className={`rounded-sm ${animPhase === 'done'
                      ? 'shadow-[0_0_10px_var(--accent)]'
                      : 'shadow-[0_0_12px_var(--accent),0_0_28px_var(--glow)] yl-moving'}`}
                  />
                  <span className="w-[30px] text-[10px] text-[var(--muted)]">
                    {animPhase === 'done'
                      ? (row.willBeYang ? '阳' : '阴')
                      : (row.wasYang ? '阳' : '阴')}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-[var(--accent2)] mt-2">
              {animPhase === 'done'
                ? '✓ 点击再演'
                : animPhase === 'flash'
                  ? '⋯ 闪烁'
                  : animPhase === 'flip'
                    ? '⋯ 翻转'
                    : '◈ 点我演示'}
            </div>
            {movingRows.length > 1 && (
              <div className="mt-1 text-[10px] leading-tight text-[var(--muted)]">
                {movingRows.length} 爻同步
              </div>
            )}
          </button>
          )}
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

      {/* 变爻爻辞（单爻变时高亮该爻） */}
      {showChanged && r.movingIndex >= 0 && r.nowDetail?.yaoLines && r.nowDetail.yaoLines[5 - r.movingIndex] && (() => {
        const yl = r.nowDetail!.yaoLines![5 - r.movingIndex]
        return (
          <div className="mt-3 p-4 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--accent2)] text-left">
            <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">{yl.pos}</div>
            <div className="text-sm font-semibold text-[var(--accent2)] mb-1"><RubyText text={yl.text} /></div>
            <div className="text-xs leading-relaxed text-[var(--fg)]"><RubyText text={yl.meaning} /></div>
          </div>
        )
      })()}

      {/* 占断依据 — 依朱熹《易学启蒙·考变占》 */}
      <div className="mt-3 p-4 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--accent)] text-left">
        <div className="flex flex-wrap items-baseline gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-md bg-[var(--accent)]/15 text-[11px] font-semibold text-[var(--accent2)] tracking-wide">{analysis.rule}</span>
          <span className="text-[11px] text-[var(--muted)]">{analysis.primaryLabel}</span>
        </div>
        <div className="text-xs leading-relaxed text-[var(--muted)]">{analysis.ruleText}</div>

        {analysis.special && (
          <div className="mt-2 pt-2 border-t border-[var(--border)]">
            <div className="text-[11px] text-[var(--muted)] mb-0.5">{analysis.special.name}</div>
            <div className="text-sm font-semibold text-[var(--accent2)]"><RubyText text={analysis.special.text} /></div>
            <div className="text-xs leading-relaxed mt-1"><RubyText text={analysis.special.meaning} /></div>
          </div>
        )}

        {analysis.refs.map(ref => (
          <div key={`${ref.source}-${ref.index}`} className="mt-2 pt-2 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] text-[var(--muted)]">{ref.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg2)] text-[var(--muted)]">{ref.source === 'now' ? '本卦' : '变卦'}</span>
              {ref.primary && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent2)] font-semibold">主</span>}
            </div>
            <div className="text-sm font-semibold text-[var(--accent2)]"><RubyText text={ref.text} /></div>
            <div className="text-xs leading-relaxed mt-1"><RubyText text={ref.meaning} /></div>
          </div>
        ))}

        {(analysis.useNowJudgment || analysis.useChangedJudgment) && analysis.refs.length === 0 && !analysis.special && (
          <div className="mt-2 pt-2 border-t border-[var(--border)] text-[11px] leading-relaxed text-[var(--muted)]">
            {analysis.useNowJudgment && `以本卦「${analysis.nowName}」卦辞为主断`}
            {analysis.useChangedJudgment && `${analysis.useNowJudgment ? '，' : ''}参看变卦「${analysis.changedName}」卦辞`}
            （卦辞见上方本卦 / 变卦卡片）
          </div>
        )}
      </div>

      {/* 已保存标记 */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[var(--muted)]">
        <span>✓ 已保存到历史记录</span>
      </div>

      {/* 六爻排盘切换按钮 */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <Button
          variant={showLiuyao ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowLiuyao(v => !v)}
        >
          {showLiuyao ? '▲ 收起排盘' : '📋 六爻排盘'}
        </Button>
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
    </CardContent>
    </Card>
  )
}
