'use client'
import usePageTitle from '@/hooks/usePageTitle'
import { useState, useMemo } from 'react'
import PageHeader from '@/components/PageHeader'
import { RubyText } from '@/components/Ruby'
import LiuyaoPan from '@/components/LiuyaoPan'
import { computeLiuyao, LIU_SHEN_ICON, LIU_QIN_COLOR, WUXING_COLOR, LIU_SHEN_COLOR, TIAN_GAN, LIU_QIN } from '@/data/liuyao'
import type { LiuyaoResult } from '@/data/liuyao'
import { baguaList, getHexagramName, getHexagramSymbol, baguaMap } from '@/data/bagua'
import { steps, BAGUA_IDS, type HexItem } from '@/data/liuyao-steps'
import { cardBase } from '@/constants'

// ─── 所有六十四卦 ───

const allHexagrams: HexItem[] = BAGUA_IDS.flatMap(lowerId =>
  BAGUA_IDS.map(upperId => ({
    key: `${upperId}-${lowerId}`,
    name: getHexagramName(upperId, lowerId),
    symbol: getHexagramSymbol(upperId, lowerId),
    upperId,
    lowerId,
  }))
).filter(h => h.name)

const baguaLabels = Object.fromEntries(baguaList.map(b => [b.id, `${b.symbol} ${b.name}卦（${b.pinyin}）`]))
const baguaNames = Object.fromEntries(baguaList.map(b => [b.id, b.name]))

// ─── 日干对照 ───

const shenTable: [string, ...string[]][] = [
  ['甲乙', '青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武'],
  ['丙丁', '朱雀', '勾陈', '螣蛇', '白虎', '玄武', '青龙'],
  ['戊己', '勾陈', '螣蛇', '白虎', '玄武', '青龙', '朱雀'],
  ['庚辛', '螣蛇', '白虎', '玄武', '青龙', '朱雀', '勾陈'],
  ['壬癸', '玄武', '青龙', '朱雀', '勾陈', '螣蛇', '白虎'],
]

// ─── 主页面 ───

export default function LiuyaoPage() {
  usePageTitle()
  const [selectedKey, setSelectedKey] = useState('kun-qian')
  const [dayStem, setDayStem] = useState('甲')
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [showDetail, setShowDetail] = useState(true)

  const [upperId, lowerId] = selectedKey.split('-')

  const liuyaoResult = useMemo(() => {
    return computeLiuyao(upperId, lowerId, dayStem)
  }, [dayStem, upperId, lowerId])

  const hexName = allHexagrams.find(x => x.key === selectedKey) || null

  // 六亲统计
  const liuqinStats = liuyaoResult ? countEach(liuyaoResult.lines.map(l => l.liuqin)) : null

  // 错卦 & 综卦
  const cuoKey = liuyaoResult ? getCuoKey(lowerId, upperId) : ''
  const zongKey = `${upperId}-${lowerId}`
  const cuoName = allHexagrams.find(x => x.key === cuoKey)
  const zongName = allHexagrams.find(x => x.key === zongKey)


  // 当位示例文本
  const [matchLabel, misLabel] = getDangweiSummary(upperId, lowerId)
  const isDaySelected = (stem: string) => dayStem === stem || (dayStem === '甲' && stem === '乙') || (dayStem === '丙' && stem === '丁') || (dayStem === '戊' && stem === '己') || (dayStem === '庚' && stem === '辛') || (dayStem === '壬' && stem === '癸')

  return (
    <>
      <PageHeader title="六爻排盘工具" subtitle="选一卦，看传统装卦全过程：定八宫·纳甲·纳支·定世应·装六亲·配六神" />

      {/* 控制区 */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] text-[var(--muted)] mb-1.5 font-medium">选择卦象</label>
            <select value={selectedKey} onChange={e => setSelectedKey(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--bg2)] border border-[var(--border)] text-sm text-[var(--fg)] outline-none cursor-pointer transition-colors focus:border-[var(--accent)]">
              {BAGUA_IDS.map(lid => (
                <optgroup key={lid} label={baguaLabels[lid] || ''}>
                  {BAGUA_IDS.map(uid => {
                    const h = allHexagrams.find(x => x.key === `${lid}-${uid}`)
                    return h ? <option key={h.key} value={h.key}>{h.symbol} {h.name} · {baguaNames[lid]}为下 {baguaNames[uid]}为上</option> : null
                  })}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="w-36">
            <label className="block text-[11px] text-[var(--muted)] mb-1.5 font-medium">日干（定六神）</label>
            <select value={dayStem} onChange={e => setDayStem(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--bg2)] border border-[var(--border)] text-sm text-[var(--fg)] outline-none cursor-pointer transition-colors focus:border-[var(--accent)]">
              {TIAN_GAN.map(s => <option key={s} value={s}>{s}日</option>)}
            </select>
          </div>
          {cuoKey ? (
            <button onClick={() => setSelectedKey(cuoKey)}
              className="px-2.5 py-2 rounded-lg text-[11px] border border-[var(--border)] bg-[var(--bg2)] text-[var(--muted)] cursor-pointer hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors">
              ⟷ 错卦 {cuoName?.symbol}{cuoName?.name}
            </button>
          ) : null}
          {zongKey !== selectedKey ? (
            <button onClick={() => setSelectedKey(zongKey)}
              className="px-2.5 py-2 rounded-lg text-[11px] border border-[var(--border)] bg-[var(--bg2)] text-[var(--muted)] cursor-pointer hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors">
              ↕ 综卦 {zongName?.symbol}{zongName?.name}
            </button>
          ) : null}
        </div>
      </section>

      {/* 排盘展示 */}
      {liuyaoResult ? (
        <>
          {/* 卦概要 */}
          <section className={`${cardBase} p-4 md:p-5 mb-5`}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-2xl">{hexName?.symbol || ''}</span>
              <span className="text-lg font-bold text-[var(--fg)]"><RubyText text={hexName?.name || ''} /></span>
              <Badge accent>{liuyaoResult.palaceName}</Badge>
              <Badge>{liuyaoResult.generation}</Badge>
              <span className="text-xs text-[var(--muted)]">宫五行：<span style={{color:WUXING_COLOR[liuyaoResult.palaceWuxing]}} className="font-semibold">{liuyaoResult.palaceWuxing}</span></span>
              <span className="text-xs text-[var(--muted)]">纳甲：内{liuyaoResult.innerStem} 外{liuyaoResult.outerStem}</span>
            </div>

            {liuqinStats ? (
              <div className="flex flex-wrap gap-2 items-center mb-2">
                <span className="text-[10px] text-[var(--muted)] font-medium">六亲分布：</span>
                {LIU_QIN.map(q => {
                  const c = liuqinStats[q]
                  return c ? (
                    <span key={q} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg3)]/50 border border-[var(--border)]">
                      <span className="inline-block w-2 h-2 rounded-full" style={{backgroundColor: LIU_QIN_COLOR[q]}} />
                      <span className="text-[11px] font-medium text-[var(--fg)]">{q}</span>
                      <span className="text-[10px] text-[var(--muted)]">×{c}</span>
                    </span>
                  ) : null
                })}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-x-5 gap-y-1 pt-2 border-t border-[var(--border)]">
              <Summary label="世爻" color="var(--accent)">
                {lineInfo(liuyaoResult, l => l.isShi)}
              </Summary>
              <Summary label="应爻" color="#e74c3c">
                {lineInfo(liuyaoResult, l => l.isYing)}
              </Summary>
              <Summary label="当位" color="var(--fg)">
                <span className="font-mono">{matchLabel}</span>
              </Summary>
              <Summary label="不当位" color="var(--fg)">
                <span className="font-mono">{misLabel}</span>
              </Summary>
            </div>
          </section>

          <div className="mb-5"><LiuyaoPan result={liuyaoResult} /></div>
        </>
      ) : (
        <div className={`${cardBase} p-8 text-center text-[var(--muted)]`}>
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-sm">排盘数据异常，请尝试选择其他卦</div>
        </div>
      )}

      {/* 装卦流程详解 */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[var(--fg)]">📖 六爻装卦六步详解</h3>
          <button onClick={() => setShowDetail(v => !v)}
            className="text-[11px] px-3 py-1 rounded-lg border border-[var(--border)] bg-[var(--bg2)] text-[var(--muted)] cursor-pointer hover:border-[var(--accent)] transition-colors">
            {showDetail ? '收起全部' : '展开全部'}
          </button>
        </div>

        <div className="space-y-3">
          {steps.map(s => {
            const isExpanded = showDetail || expandedStep === s.step
            return (
              <div key={s.step} className="border border-[var(--border)] rounded-xl overflow-hidden">
                <button onClick={() => setExpandedStep(expandedStep === s.step ? null : s.step)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--bg3)]/30 hover:bg-[var(--glow)] transition-colors cursor-pointer text-left">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg2)] border border-[var(--border)] text-sm">{s.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--accent2)] font-mono font-semibold">STEP {s.step}</span>
                      <span className="text-sm font-bold text-[var(--fg)]">{s.title}</span>
                    </div>
                    <div className="text-[11px] text-[var(--muted)]">{s.subtitle}</div>
                  </div>
                  <span className={`text-xs text-[var(--muted)] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 animate-[fadeSlideIn_0.2s_ease-out]">
                    <div className="p-3 rounded-lg bg-[var(--bg3)]/50">
                      <p className="text-xs text-[var(--fg)]/80 leading-relaxed whitespace-pre-line mb-2">{s.detail}</p>
                      {liuyaoResult ? <StepExample step={s.step} result={liuyaoResult} /> : null}
                    </div>
                    <div className="mt-2 text-xs text-[var(--fg)]/60 leading-relaxed">
                      <span className="text-[var(--muted)]">📖 举例：</span>{s.example}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 六神速查 */}
      <section className={`${cardBase} p-5 md:p-6`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🃏 六神速查表</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-[var(--border)]">
              <th className="text-left py-2 px-3 text-[var(--muted)] font-medium">日干</th>
              {['初爻','二爻','三爻','四爻','五爻','上爻'].map(p => <th key={p} className="text-center py-2 px-2 text-[var(--muted)] font-medium">{p}</th>)}
            </tr></thead>
            <tbody>
              {shenTable.map(([stem, ...shens]) => {
                const isCurrent = isDaySelected(stem)
                return (
                  <tr key={stem} className={`border-b border-[var(--border)]/50 ${isCurrent ? 'bg-[var(--accent)]/5' : ''}`}>
                    <td className={`py-2 px-3 font-mono font-semibold ${stem.includes(dayStem) ? 'text-[var(--accent)]' : 'text-[var(--fg)]'}`}>
                      {stem}日{isCurrent ? ' ← 当前' : ''}
                    </td>
                    {(shens as string[]).map((s, i) => (
                      <td key={i} className="text-center py-2 px-2">
                        <span className="inline-flex items-center gap-1" style={{color: LIU_SHEN_COLOR[s]}}>
                          {LIU_SHEN_ICON[s]}<span className="text-[11px]">{s}</span>
                        </span>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <style>{`@keyframes fadeSlideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </>
  )
}

// ─── 辅助组件 ───

function Badge({ accent, children }: { accent?: boolean; children: React.ReactNode }) {
  if (accent) {
    return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">{children}</span>
  }
  return <span className="px-2 py-1 rounded-md text-xs bg-[var(--bg3)] text-[var(--muted)]">{children}</span>
}

function Summary({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div className="text-[11px] text-[var(--fg)]/70">
      <span style={{color}} className="font-semibold">{label}</span>：{children}
    </div>
  )
}

function lineInfo(result: LiuyaoResult, pred: (l: typeof result.lines[0]) => boolean) {
  const line = result.lines.find(pred)
  if (!line) return <>&mdash;</>
  return <><span className="font-semibold">{line.posName}</span> → <span style={{color: LIU_QIN_COLOR[line.liuqin]}} className="font-semibold">{line.liuqin}</span></>
}

// ─── 步骤示例 ───

function StepExample({ step, result }: { step: number; result: LiuyaoResult }) {
  if (step === 1) return <span className="text-xs text-[var(--fg)]/80">当前卦：{result.palaceName} · {result.generation}卦</span>
  if (step === 2) return <span className="text-xs text-[var(--fg)]/80">内卦天干：{result.innerStem}，外卦天干：{result.outerStem}</span>
  if (step === 3) {
    const r = result.lines
    return <span className="text-xs text-[var(--fg)]/80 font-mono">{r[0].stem}{r[0].branch} · {r[1].stem}{r[1].branch} · {r[2].stem}{r[2].branch} / {r[3].stem}{r[3].branch} · {r[4].stem}{r[4].branch} · {r[5].stem}{r[5].branch}</span>
  }
  if (step === 4) {
    const shi = result.lines.find(l => l.isShi)
    const ying = result.lines.find(l => l.isYing)
    return <span className="text-xs text-[var(--fg)]/80">世爻在{shi?.posName}，应爻在{ying?.posName}</span>
  }
  if (step === 5) return <span className="text-xs text-[var(--fg)]/80">{result.lines.map(l => l.liuqin).join(' · ')}</span>
  if (step === 6) return <span className="text-xs text-[var(--fg)]/80">{result.lines.map(l => l.liushen).join(' · ')}</span>
  return null
}

// ─── 辅助函数 ───

function countEach(items: string[]): Record<string, number> {
  const r: Record<string, number> = {}
  items.forEach(v => { r[v] = (r[v] || 0) + 1 })
  return r
}

function getCuoKey(lowerId: string, upperId: string): string {
  const lb = baguaMap[lowerId]; const ub = baguaMap[upperId]
  if (!lb || !ub) return ''
  const cl = baguaList.find(b => b.yao[0] === (lb.yao[0] ? 0 : 1) && b.yao[1] === (lb.yao[1] ? 0 : 1) && b.yao[2] === (lb.yao[2] ? 0 : 1))
  const cu = baguaList.find(b => b.yao[0] === (ub.yao[0] ? 0 : 1) && b.yao[1] === (ub.yao[1] ? 0 : 1) && b.yao[2] === (ub.yao[2] ? 0 : 1))
  return cl && cu ? `${cl.id}-${cu.id}` : ''
}

function getDangweiSummary(upperId: string, lowerId: string): [string, string] {
  const lb = baguaMap[lowerId]; const ub = baguaMap[upperId]
  if (!lb || !ub) return ['—', '—']
  const yao6 = [lb.yao[0], lb.yao[1], lb.yao[2], ub.yao[0], ub.yao[1], ub.yao[2]]
  const match: string[] = []; const mis: string[] = []
  yao6.forEach((v, i) => {
    const isYangPos = i % 2 === 0
    const name = ['初','二','三','四','五','上'][i]
    if (v === 1 === isYangPos) match.push(name)
    else mis.push(name)
  })
  return [match.join('·') || '无', mis.join('·') || '无']
}
