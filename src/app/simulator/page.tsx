'use client'

import { useState, useEffect, useMemo } from 'react'
import usePageTitle from '@/hooks/usePageTitle'
import PageHeader from '@/components/PageHeader'
import dynamic from 'next/dynamic'
import YaoLine from '@/components/Yao'

const ThreeYaoHexagram = dynamic(() => import('@/components/ThreeYaoHexagram'), { ssr: false })
import { RubyText, Ruby } from '@/components/Ruby'
import { baguaMap, getHexagramName, getHexagramSymbol, computeHexagramChange, YAO_LABELS } from '@/data/bagua'
import { hexagramOrder, getHexagramDetail } from '@/data/hexagrams'
import type { DivineResult } from '@/hooks/divineTypes'
import HexagramRelations from '@/components/HexagramRelations'

export default function SimulatorPage() {
  usePageTitle()

  // 当前选中的卦 — 默认需卦（坎上乾下）
  const [selected, setSelected] = useState<{ upperId: string; lowerId: string }>({ upperId: 'kan', lowerId: 'qian' })
  const [result, setResult] = useState<DivineResult | null>(null)

  // 动画状态
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const [animPhase, setAnimPhase] = useState<'idle' | 'flash' | 'flip' | 'done'>('idle')

  // 下拉搜索
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  // 当前卦的 yao6
  const currentYao6 = useMemo(() => {
    const ub = baguaMap[selected.upperId]
    const lb = baguaMap[selected.lowerId]
    return [...ub.yao.slice().reverse(), ...lb.yao.slice().reverse()]
  }, [selected])

  const currentName = useMemo(() => getHexagramName(selected.upperId, selected.lowerId), [selected])
  const currentSymbol = useMemo(() => getHexagramSymbol(selected.upperId, selected.lowerId), [selected])
  const currentDetail = useMemo(() => getHexagramDetail(selected.upperId, selected.lowerId), [selected])

  // 清理选中时重置结果
  useEffect(() => {
    setResult(null)
    setActiveIndex(-1)
    setAnimPhase('idle')
  }, [selected])

  // 点击爻线
  const handleYaoClick = (index: number) => {
    // yao6 索引: 0=上爻,5=初爻。点击的 mk 从下往上数
    const mk = 6 - index

    setActiveIndex(index)
    setAnimPhase('flash')

    // 先计算变卦结果（但暂不显示）
    const newResult = computeHexagramChange(currentYao6, mk, getHexagramDetail)
    setResult(newResult)

    // 动画序列
    setTimeout(() => setAnimPhase('flip'), 1000)
    setTimeout(() => setAnimPhase('done'), 1800)
  }

  // 选择卦
  const handleSelect = (upperId: string, lowerId: string) => {
    setSelected({ upperId, lowerId })
    setOpen(false)
    setSearch('')
  }

  // 过滤后的卦列表
  const filteredList = useMemo(() => {
    if (!search) return hexagramOrder
    const q = search.toLowerCase().trim()
    return hexagramOrder.filter(([u, l]) => {
      const name = getHexagramName(u, l)
      return name.includes(q) || u.includes(q) || l.includes(q)
    })
  }, [search])

  // 变卦结果弹窗
  const changedDetail = result?.changedDetail

  const ub = baguaMap[selected.upperId]
  const lb = baguaMap[selected.lowerId]

  return (
    <>
      <PageHeader title="变爻模拟器" subtitle="选择一卦，点击任意爻线，看「一爻动则全卦变」。" />

      {/* 选择器 */}
      <div className="max-w-[500px] mx-auto mb-6">
        <div className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] cursor-pointer hover:border-[var(--accent)] transition-colors text-left"
          >
            <span className="text-[28px]">{currentSymbol}</span>
            <div className="flex-1">
              <div className="font-semibold">
                <RubyText text={currentName} />
              </div>
              <div className="text-[11px] text-[var(--muted)]">
                上{ub.name}（{ub.symbol}）· 下{lb.name}（{lb.symbol}）
              </div>
            </div>
            <span className="text-[var(--muted)] text-lg">{open ? '▲' : '▼'}</span>
          </button>

          {open && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-[0_8px_32px_var(--shadow)] animate-[fadeIn_0.15s_ease] max-h-[360px] overflow-hidden flex flex-col">
              {/* 搜索框 */}
              <div className="p-2 border-b border-[var(--border)]">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="搜索卦名…"
                  autoFocus
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-[var(--fg)] text-sm outline-none focus:border-[var(--accent)] transition-colors caret-[var(--accent)]"
                />
              </div>
              {/* 列表 */}
              <div className="overflow-y-auto flex-1">
                {filteredList.length === 0 ? (
                  <div className="p-6 text-center text-sm text-[var(--muted)]">无匹配卦象</div>
                ) : (
                  <div className="grid grid-cols-2 gap-0.5 p-2">
                    {filteredList.map(([u, l]) => {
                      const name = getHexagramName(u, l)
                      const sym = getHexagramSymbol(u, l)
                      const isCurrent = u === selected.upperId && l === selected.lowerId
                      return (
                        <button
                          key={`${u}-${l}`}
                          onClick={() => handleSelect(u, l)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left cursor-pointer transition-colors ${
                            isCurrent
                              ? 'bg-[var(--accent)] text-[var(--bg)]'
                              : 'hover:bg-[var(--bg3)] text-[var(--fg)]'
                          }`}
                        >
                          <span className="text-[18px] w-[24px] text-center">{sym}</span>
                          <span className="text-sm">{name}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 主显示区 */}
      <div className="max-w-[700px] mx-auto">
        {/* 卦象 + 爻线 */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8">
          <div className="flex justify-center gap-12 items-center max-sm:flex-col max-sm:gap-8">
            {/* 本卦 */}
            <div className="flex-1 text-center">
              <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-3">
                {result && animPhase !== 'done' ? '本卦' : (result ? '本卦' : '点击爻线')}
              </div>

              {/* 卦符 */}
              <div className="text-[48px] mb-2">{currentSymbol}</div>

              {/* 3D 卦象 */}
              <ThreeYaoHexagram
                lines={[
                  currentYao6[5], currentYao6[4], currentYao6[3],
                  currentYao6[2], currentYao6[1], currentYao6[0],
                ]}
                changingIndex={animPhase === 'done' ? activeIndex : (animPhase !== 'idle' ? activeIndex : undefined)}
                interactive={animPhase === 'idle' || animPhase === 'done'}
                size={260}
                autoRotate={false}
                showLabels
                onYaoClick={(i) => {
                  if (animPhase === 'idle' || animPhase === 'done') {
                    handleYaoClick(5 - i)
                  }
                }}
              />

              {/* 卦名 — 使用与爻线相同的flex偏移，保证对齐 */}
              <div className="mt-2">
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-8 shrink-0" />
                  <div className="w-20 text-center">
                    <div className="text-[18px] font-bold">
                      <RubyText text={currentName} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-8 shrink-0" />
                  <div className="w-20 text-center">
                    <div className="text-xs text-[var(--muted)]">
                      上<Ruby char={ub.name} /> · 下<Ruby char={lb.name} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 中间：变爻指示 + 箭头 */}
            <div className="flex flex-col items-center justify-center gap-2 pt-8 max-sm:pt-0 max-sm:flex-row">
              {animPhase === 'idle' ? (
                <div className="text-[var(--muted)] text-center">
                  <div className="text-2xl mb-1 opacity-40">⇢</div>
                  <div className="text-[10px]">点任一爻开始</div>
                </div>
              ) : result ? (
                <div className="text-center">
                  <div className="text-[11px] text-[var(--accent2)] font-semibold tracking-wider mb-2">
                    {result.movingName}
                  </div>
                  <div className="text-[10px] text-[var(--muted)] mb-1">{result.movingChange}</div>
                  {animPhase === 'done' && (
                    <div className="text-2xl text-[var(--accent2)] mt-1">⇢</div>
                  )}
                  {animPhase !== 'done' && (
                    <div className="text-xs text-[var(--muted)] animate-pulse">
                      {animPhase === 'flash' ? '⋯ 闪烁' : '⋯ 翻转'}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* 变卦 */}
            <div className="flex-1 text-center" style={{
              opacity: result && animPhase === 'done' ? 1 : 0.3,
              transition: 'opacity 0.5s ease',
            }}>
              <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-3">变卦</div>

              {result && animPhase === 'done' ? (
                <>
                  <div className="text-[48px] mb-2">{result.changedSymbol}</div>
                  <div className="flex flex-col items-center gap-[3px] my-3">
                    {result.changedYao6.map((v, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {/* 占位文字（不可见），保持与本卦行高一致 */}
                        <div className="w-8 shrink-0 text-[10px] text-right invisible">{YAO_LABELS[5 - i]}</div>
                        <YaoLine
                          yang={v === 1}
                          className={`${i === result.movingIndex ? 'shadow-[0_0_10px_var(--accent)]' : ''} rounded-sm`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-8 shrink-0 text-[10px] text-right invisible">{YAO_LABELS[5]}</div>
                      <div className="w-20 text-center">
                        <div className="text-[18px] font-bold text-[var(--accent2)]">
                          <RubyText text={result.changedHexName} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-8 shrink-0 text-[10px] text-right invisible">{YAO_LABELS[5]}</div>
                      <div className="w-20 text-center">
                        <div className="text-xs text-[var(--muted)]">
                          上<Ruby char={result.changedUpperName} /> · 下<Ruby char={result.changedLowerName} />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="opacity-20">
                  <div className="text-[48px] mb-2">{currentSymbol}</div>
                  <div className="flex flex-col items-center gap-[3px] my-3">
                    {currentYao6.map((v, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 shrink-0 text-[10px] text-right invisible">{YAO_LABELS[5 - i]}</div>
                        <YaoLine yang={v === 1} className="rounded-sm" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-8 shrink-0 text-[10px] text-right invisible">{YAO_LABELS[5]}</div>
                      <div className="w-20 text-center">
                        <div className="text-[18px] font-bold">{currentName}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 卦辞展示 */}
          {currentDetail && (
            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <div className="flex justify-center gap-6 max-sm:flex-col">
                {/* 本卦卦辞 */}
                <div className="flex-1 p-4 rounded-xl bg-[var(--bg3)]">
                  <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider mb-2">本卦 · {currentName}</div>
                  <div className="text-sm font-semibold text-[var(--accent2)] mb-1"><RubyText text={currentDetail.judgment} /></div>
                  <div className="text-xs italic text-[var(--muted)] mb-1"><RubyText text={currentDetail.image} /></div>
                  <div className="text-xs leading-relaxed"><RubyText text={currentDetail.meaning} /></div>
                </div>

                {/* 变卦卦辞 */}
                {result && animPhase === 'done' && changedDetail && (
                  <div className="flex-1 p-4 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--accent2)]">
                    <div className="text-[10px] text-[var(--accent2)] uppercase tracking-wider mb-2">变卦 · {result.changedHexName}</div>
                    <div className="text-sm font-semibold text-[var(--accent2)] mb-1"><RubyText text={changedDetail.judgment} /></div>
                    <div className="text-xs italic text-[var(--muted)] mb-1"><RubyText text={changedDetail.image} /></div>
                    <div className="text-xs leading-relaxed"><RubyText text={changedDetail.meaning} /></div>
                  </div>
                )}
              </div>

              {/* 动爻爻辞 */}
              {result && animPhase === 'done' && result.nowDetail?.yaoLines && (() => {
                const yl = result.nowDetail.yaoLines[5 - result.movingIndex]
                if (!yl) return null
                return (
                  <div className="mt-3 p-4 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--accent2)] text-left">
                    <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider mb-1">{yl.pos} · 原文</div>
                    <div className="text-sm font-semibold text-[var(--accent2)] mb-1"><RubyText text={yl.text} /></div>
                    <div className="text-xs leading-relaxed"><RubyText text={yl.meaning} /></div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>

        {/* 互卦·错卦·综卦 */}
        {result && animPhase === 'done' && (
          <div className="mt-4 animate-[fadeIn_0.4s_ease]">
            <HexagramRelations
              upperId={result.upperId}
              lowerId={result.lowerId}
              onNavigate={(nu, nl) => handleSelect(nu, nl)}
            />
          </div>
        )}
      </div>

      <p className="text-xs text-center text-[var(--muted)] mt-5">
        💡 试试多爻变化：在变卦上继续点击，一步步探索卦象演变
      </p>
    </>
  )
}
