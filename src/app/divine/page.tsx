'use client'
import usePageTitle from '@/hooks/usePageTitle'

import { useState, useCallback, useEffect, useRef } from 'react'
import YarrowDivination from '@/components/YarrowDivination'
import PageHeader from '@/components/PageHeader'
import YaoLine, { HexagramDisplay } from '@/components/Yao'
import { RubyText, Ruby } from '@/components/Ruby'
import Coin from '@/components/Coin'
import { baguaList, baguaMap, numToBagua, getHexagramName, getHexagramSymbol, computeHexagramChange } from '@/data/bagua'
import { getHexagramDetail } from '@/data/hexagrams'
import type { DivineResult } from '@/hooks/divineTypes'
import HexagramRelations from '@/components/HexagramRelations'
import ShareCard from '@/components/ShareCard'
import { useDivineHistory, resultToRecord } from '@/hooks/useDivineHistory'
import LiuyaoPan from '@/components/LiuyaoPan'
import { computeLiuyao } from '@/data/liuyao'
import type { LiuyaoResult } from '@/data/liuyao'

interface CoinToss {
  values: number[]
  sum: number
  yao: number
  changing: boolean
}

function tossCoins(): CoinToss {
  const values = Array.from({length: 3}, () => Math.random() < 0.5 ? 3 : 2)
  const sum = values.reduce((a, b) => a + b, 0)
  const yao = sum === 6 || sum === 8 ? 0 : 1
  const changing = sum === 6 || sum === 9
  return { values, sum, yao, changing }
}

export default function DivinePage() {
  usePageTitle()
  const { addRecord } = useDivineHistory()
  const savedRef = useRef(false)
  const [method, setMethod] = useState<'number' | 'coin' | 'yarrow'>('coin')
  const [n1, setN1] = useState('')
  const [n2, setN2] = useState('')
  const [n3, setN3] = useState('')
  const [result, setResult] = useState<DivineResult | null>(null)
  const [tosses, setTosses] = useState<CoinToss[]>([])
  const [tossing, setTossing] = useState(false)

  const doNumberDivine = useCallback(() => {
    const a = parseInt(n1), b = parseInt(n2), c = parseInt(n3)
    if (isNaN(a) || isNaN(b) || isNaN(c)) { setResult(null); return }
    const uk = a % 8, lk = b % 8, mk = c % 6 || 6
    const ui = numToBagua[uk], li = numToBagua[lk]
    if (!ui || !li) { setResult(null); return }
    const ub = baguaMap[ui], lb = baguaMap[li]
    const y6 = [...ub.yao.slice().reverse(), ...lb.yao.slice().reverse()]
    try { setResult(computeHexagramChange(y6, mk, getHexagramDetail)) } catch { setResult(null) }
  }, [n1, n2, n3])

  const doCoinToss = useCallback(() => {
    if (tossing) return
    setTossing(true)
    setTimeout(() => {
      setTosses(prev => [...prev, tossCoins()])
      setTossing(false)
    }, 400)
  }, [tossing])

  useEffect(() => {
    if (tosses.length === 6) {
      const y6 = tosses.map(t => t.yao).reverse()
      const mk = tosses.findIndex(t => t.changing)
      const movingLine = mk === -1 ? 1 : mk + 1
      try { setResult(computeHexagramChange(y6, movingLine, getHexagramDetail)) } catch {}
    }
  }, [tosses])

  // 自动保存起卦历史
  useEffect(() => {
    if (result && !savedRef.current) {
      savedRef.current = true
      addRecord(resultToRecord(result, method))
    }
    if (!result) savedRef.current = false
  }, [result, method, addRecord])

  const resetCoins = () => { setTosses([]); setResult(null) }

  return (
    <>
      <PageHeader title="起卦" subtitle="心里想一件事，选择一种方式起卦。" />

      <div className="flex justify-center gap-1.5 mb-5"
        data-mcp-action="select-divination-method"
        data-mcp-description="选择起卦方式：金钱起卦（抛6次铜钱）、数字起卦（输入3个数字）、或大衍揲蓍法（18步蓍草交互）"
        data-mcp-params='{"required": ["method"]}'
      >
        <button onClick={() => { setMethod('coin'); setResult(null) }}
          data-mcp-param="method" data-mcp-description="金钱起卦：抛6次铜钱，每次三枚，正面3反面2，累计得出卦象" data-mcp-param-value="coin"
          className={`px-4 py-1.5 rounded-lg text-xs border cursor-pointer transition-colors ${
            method === 'coin'
              ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
              : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
          }`}>🪙 金钱起卦</button>
        <button onClick={() => { setMethod('number'); setResult(null) }}
          data-mcp-param="method" data-mcp-description="数字起卦：输入3个数字，第一个定上卦，第二个定下卦，第三个定动爻" data-mcp-param-value="number"
          className={`px-4 py-1.5 rounded-lg text-xs border cursor-pointer transition-colors ${
            method === 'number'
              ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
              : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
          }`}>🔢 数字起卦</button>
        <button onClick={() => { setMethod('yarrow'); setResult(null) }}
          data-mcp-param="method" data-mcp-description="大衍揲蓍法：用50根蓍草，经过「分二·挂一·揲四·归奇」三变得一爻，六爻共十八变后成卦。最古老的筮法，载于《系辞》。" data-mcp-param-value="yarrow"
          className={`px-4 py-1.5 rounded-lg text-xs border cursor-pointer transition-colors ${
            method === 'yarrow'
              ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
              : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
          }`}>🌿 大衍揲蓍</button>
      </div>

      {/* ===== 大衍揲蓍法 ===== */}
      {method === 'yarrow' && (
        <div className="max-w-[500px] mx-auto" data-mcp-action="divine-by-yarrow"
          data-mcp-description="大衍揲蓍法：最古老的起卦方法。点击「开始揲蓍」进入交互流程，依次进行分二、挂一、揲四、归奇，三变得一爻，六爻共十八变后自动生成本卦和变卦。"
        >
          <YarrowDivination
            onComplete={(yaoValues) => {
              // yaoValues: [初爻, 二爻, 三爻, 四爻, 五爻, 上爻] 每个值为 6-9
              const y6: number[] = []
              // 转换为 {0,1} 系统：6老阴→0, 7少阳→1, 8少阴→0, 9老阳→1
              // 同时上卦在上，下卦在下
              yaoValues.forEach(v => {
                y6.unshift(v === 6 || v === 8 ? 0 : 1)
              })
              // y6 现在为 [上卦3, 上卦2, 上卦1, 下卦3, 下卦2, 下卦1] = [0,1,2,3,4,5] 爻位
              // 找变爻：6老阴或9老阳
              const changingIndex = yaoValues.findIndex(v => v === 6 || v === 9)
              const mk = changingIndex === -1 ? 1 : changingIndex + 1
              try { setResult(computeHexagramChange(y6, mk, getHexagramDetail)) } catch { setResult(null) }
            }}
          />
        </div>
      )}

      {/* ===== 起卦区（数字/金钱） ===== */}
      {method !== 'yarrow' && (
      <div className="max-w-[500px] mx-auto bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8"
        data-mcp-action="divine"
        data-mcp-description="起卦占卜，支持数字起卦和金钱起卦两种方式。先选择起卦方式，然后输入数字或抛铜钱，自动生成卦象结果。"
        data-mcp-params='{"required": ["method"], "optional": ["num1", "num2", "num3"]}'
      >
        {method === 'number' ? (
          <>
            <h3 className="text-center text-lg mb-1" data-mcp-param="method" data-mcp-description="当前起卦方式">✍️ 输入三个数字</h3>
            <p className="text-center text-sm text-[var(--muted)] mb-5">第一个数定上卦 · 第二个数定下卦 · 第三个数定动爻</p>
            <div className="flex gap-3 justify-center mb-5">
              {[n1, n2, n3].map((v, i) => (
                <input key={i} type="number" value={v}
                  data-mcp-param={['num1', 'num2', 'num3'][i]}
                  data-mcp-description={['第一个数定上卦', '第二个数定下卦', '第三个数定动爻'][i]}
                  onChange={e => [setN1, setN2, setN3][i](e.target.value)}
                  placeholder={['如 3', '如 5', '如 8'][i]}
                  className="divine-input w-20 p-2.5 text-center bg-[var(--bg3)] border border-[var(--border)] rounded-xl text-[var(--fg)] text-xl font-semibold outline-none transition-all duration-300 caret-[var(--accent)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--glow)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              ))}
            </div>
            <button onClick={doNumberDivine}
              data-mcp-action="divine-by-numbers"
              data-mcp-description="用三个数字起卦。第一个数字定上卦（余数0=坤），第二个数字定下卦，第三个数定动爻（余数0=上爻）。点击后自动生成本卦和变卦。"
              className="w-full py-3.5 text-base font-semibold tracking-wider bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)] active:translate-y-0">
              ☰ 起 卦
            </button>
          </>
        ) : (
          <>
            {/* 标题行 + 抛按钮固定在右上 */}
            <div className="flex items-start justify-between mb-4"
              data-mcp-action="divine-by-coins"
              data-mcp-description="金钱起卦：点击抛铜钱按钮，每次抛3枚。共需抛6次（初爻到上爻），完成后自动生成卦象。正面=3反面=2，老阳/老阴为变爻。"
              data-mcp-params='{"required": [], "optional": []}'
            >
              <div>
                <h3 className="text-base mb-0.5">🪙 抛铜钱</h3>
                <p className="text-xs text-[var(--muted)]">正=3 反=2 · 共抛六次</p>
              </div>
              {tosses.length < 6 ? (
                <button onClick={doCoinToss} disabled={tossing}
                  data-mcp-action="toss-coins"
                  data-mcp-description="抛一次铜钱，三枚。需要连续抛6次完成起卦。"
                  className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)] active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 shrink-0">
                  {tossing ? '⋯ 抛掷中' : `抛第${['一','二','三','四','五','六'][tosses.length]}爻`}
                </button>
              ) : (
                <button onClick={resetCoins}
                  data-mcp-action="reset-coin-divination"
                  data-mcp-description="清空当前抛铜钱结果，重新起卦"
                  className="px-4 py-2 text-sm font-semibold bg-[var(--bg3)] text-[var(--accent2)] border border-[var(--border)] rounded-xl cursor-pointer transition-all duration-300 hover:border-[var(--accent)] shrink-0">
                  🔄 重来
                </button>
              )}
            </div>

            {/* 进度点 */}
            <div className="flex gap-1 justify-center mb-4"
              data-mcp-param="divination-progress"
              data-mcp-description="起卦进度：6个爻位，已完成数和当前步骤"
            >
              {Array.from({length: 6}, (_, i) => (
                <div key={i}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-all ${
                    i < tosses.length
                      ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]'
                      : i === tosses.length
                        ? 'bg-[var(--bg3)] text-[var(--accent2)] border-[var(--accent)] animate-pulse'
                        : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)]'
                  }`}>
                  {['初','二','三','四','五','上'][i]}
                </div>
              ))}
            </div>

            {/* 铜钱展示 */}
            {tosses.length < 6 && (
              <div className="flex justify-center gap-4 mb-4">
                {tosses.length === 0
                  ? [0,1,2].map(i => <Coin key={i} face="back" size={72} />)
                  : tossing
                    ? [0,1,2].map(i => <Coin key={i} face={i % 2 === 0 ? 'front' : 'back'} size={72} flipping />)
                    : (() => {
                        const last = tosses[tosses.length - 1]
                        return last.values.map((v, i) => (
                          <Coin key={i} face={v === 3 ? 'front' : 'back'} size={72} />
                        ))
                      })()
                }
              </div>
            )}

            {/* 已抛结果 — 横向紧凑排列 */}
            {tosses.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                {tosses.map((t, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg3)]"
                    data-mcp-param={`result-yao-${i}`}
                    data-mcp-description={`第${['初','二','三','四','五','上'][i]}爻结果`}
                  >
                    <span className="text-[10px] text-[var(--muted)]">{['初','二','三','四','五','上'][i]}</span>
                    <div className={`w-12 h-1.5 rounded-sm ${t.yao === 1 ? 'bg-[var(--yang)]' : ''}`}
                      style={{ backgroundImage: t.yao === 1 ? undefined :
                        'linear-gradient(to right, var(--yin) 0, var(--yin) 18px, transparent 18px, transparent 30px, var(--yin) 30px, var(--yin) 48px)'}}
                    />
                    <span className="text-[10px] text-[var(--muted)]">
                      {t.changing ? (t.yao === 1 ? '老阳' : '老阴') : (t.yao === 1 ? '少阳' : '少阴')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      )}

      {/* ===== 卦象结果 — 独立更宽 ===== */}
      {result && (
        <div className="max-w-[700px] mx-auto">
          <DivineResultComponent result={result} />
        </div>
      )}

      <p className="text-xs text-center text-[var(--muted)] mt-5">⚠️ 易学是思维模型，不是算命。卦象是参考，不是宿命。</p>
    </>
  )
}

function DivineResultComponent({ result }: { result: DivineResult }) {
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
  if (animPhase === 'revert' || animPhase === 'done') animClass = animPhase === 'revert' ? 'yl-revert' : ''

  return (
    <div className="mt-6 p-6 bg-[var(--bg2)] rounded-xl animate-[fadeIn_0.4s_ease]">
      <div className="flex justify-center gap-8 items-start text-center max-sm:flex-col max-sm:gap-4">
        <div className="flex-1">
          <h4 className="text-[11px] uppercase tracking-widest text-[var(--muted)] mb-2.5">本卦</h4>
          <div id="hex-now"><HexagramDisplay yao6={r.yao6} movingIndex={r.movingIndex} animClass={animClass} /></div>
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
          <div onClick={() => { if (!isAnimating) setAnimPhase('flash') }}
            className={`cursor-pointer transition-all duration-300 ${isAnimating ? '' : 'hover:scale-110'} ${animPhase === 'flash' || animPhase === 'flip' ? 'pointer-events-none' : ''}`}
            title={isAnimating ? '' : (showChanged ? '再演示一次' : '点击演示变爻')}
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
          </div>
        </div>

        <div className="flex-1" style={{ opacity: showChanged ? 1 : 0.5, transition: 'opacity 0.5s ease' }}>
          <h4 className="text-[11px] uppercase tracking-widest text-[var(--muted)] mb-2.5">变卦</h4>
          <div id="hex-changed"><HexagramDisplay yao6={r.changedYao6} /></div>
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
          data-mcp-action="toggle-liuyao-pan"
          data-mcp-description="展开/收起传统六爻排盘（世应·纳甲·六亲·六神）"
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
          {liuyaoResult && (
            <>
              {/* 日干选择 */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-[11px] text-[var(--muted)]">日干：</span>
                <select
                  value={dayStem}
                  onChange={e => setDayStem(e.target.value)}
                  data-mcp-param="liuyao-day-stem"
                  data-mcp-description="选择日干以确定六神排列"
                  className="px-2 py-1 text-xs rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-[var(--fg)] outline-none focus:border-[var(--accent)] cursor-pointer"
                >
                  {['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'].map(s => (
                    <option key={s} value={s}>{s}日</option>
                  ))}
                </select>
              </div>
              <LiuyaoPan result={liuyaoResult} />
            </>
          )}
        </div>
      )}

      {/* 分享按钮 */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <ShareCard
          upperId={r.upperId}
          lowerId={r.lowerId}
          subtitle="起卦结果"
        />
      </div>
      <HexagramRelations upperId={r.upperId} lowerId={r.lowerId} />
    </div>
  )
}
