'use client'
import { useState, useEffect } from 'react'
import usePageTitle from '@/hooks/usePageTitle'
import PageHeader from '@/components/PageHeader'
import { sovereignHexagrams, preHeavenTerms, solarTerms24, postHeavenTerms, seasonColors, seasonLabels } from '@/data/solarTerms'
import type { SolarTermItem, SovereignHexagram, PreHeavenTerm } from '@/data/solarTerms'

// ─── 爻线渲染组件 ──────────────────────────────────────

function YaoLines({ yao, size = 6 }: { yao: number[], size?: number }) {
  return (
    <div className="flex flex-col-reverse gap-0.5 items-center" style={{ gap: `${size * 0.12}px` }}>
      {yao.map((line, i) => (
        <div
          key={i}
          className={line === 1 ? 'rounded-sm bg-[var(--yang)]' : 'rounded-sm bg-[var(--yin)]'}
          style={{
            width: `${size * 5}px`,
            height: `${size * 0.7}px`,
            opacity: 0.9,
          }}
        >
          {line === 0 && (
            <div className="flex justify-between px-[1px] h-full items-center">
              <div className="w-[30%] h-full rounded-sm bg-[var(--yin)]" />
              <div className="w-[30%] h-full rounded-sm bg-[var(--yin)]" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── 子组件：十二辟卦时间轴 ─────────────────────────────

function SovereignTimeline() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {/* 横滚动时间轴 */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex gap-2 min-w-max">
          {sovereignHexagrams.map((h, idx) => (
            <button
              key={h.id}
              onClick={() => setActiveIdx(activeIdx === idx ? null : idx)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 w-[84px] ${
                activeIdx === idx
                  ? 'border-[var(--accent)] bg-[var(--glow)]'
                  : 'border-[var(--border)] bg-[var(--bg2)] hover:border-[var(--accent)] hover:bg-[var(--bg3)]'
              }`}
            >
              <span className="text-[20px] leading-none">{h.symbol}</span>
              <span className="text-[12px] font-heading text-[var(--fg)]">{h.name}</span>
              <YaoLines yao={h.yao} size={4} />
              <span className="text-[10px] text-[var(--muted)]">{h.month}</span>
              {/* 阴阳计数器 */}
              <div className="flex gap-1 text-[9px]">
                <span className="text-[var(--yang)]">{h.yao.filter(y=>y===1).length}阳</span>
                <span className="text-[var(--muted)]">/</span>
                <span className="text-[var(--yin)]">{h.yao.filter(y=>y===0).length}阴</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 选中卦的详情 */}
      {activeIdx !== null && (
        <div className="p-4 rounded-xl bg-[var(--bg3)] border border-[var(--accent)] animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <span className="text-[32px] leading-none">{sovereignHexagrams[activeIdx].symbol}</span>
              <span className="text-[16px] font-heading text-[var(--fg)] mt-1">{sovereignHexagrams[activeIdx].name}</span>
              <YaoLines yao={sovereignHexagrams[activeIdx].yao} size={8} />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-wrap gap-2 text-[12px]">
                <span className="px-2 py-0.5 rounded-full bg-[var(--bg2)] border border-[var(--border)]">
                  {sovereignHexagrams[activeIdx].month}
                </span>
                {sovereignHexagrams[activeIdx].solarTerms.map(st => (
                  <span key={st} className="px-2 py-0.5 rounded-full bg-[var(--glow)] border border-[var(--accent)] text-[var(--accent)]">
                    {st}
                  </span>
                ))}
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                {sovereignHexagrams[activeIdx].meaning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 阴阳消长指示条 */}
      <div className="p-3 rounded-lg bg-[var(--bg2)] border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] text-[var(--yang)] font-medium">⬆ 阳长</span>
          <div className="flex-1 h-2 rounded-full bg-[var(--bg3)] overflow-hidden flex">
            {sovereignHexagrams.map((h, i) => {
              const yangCount = h.yao.filter(y => y === 1).length
              const isSelected = i === activeIdx
              return (
                <div
                  key={h.id}
                  className="flex-1 h-full transition-all duration-300 cursor-pointer"
                  style={{
                    background: isSelected ? 'var(--accent)' : `rgba(245,158,11,${yangCount / 6 * 0.7})`,
                    opacity: activeIdx === null || isSelected ? 1 : 0.4,
                  }}
                  title={`${h.name} (${yangCount}阳)`}
                />
              )
            })}
          </div>
          <span className="text-[11px] text-[var(--yin)] font-medium">⬇ 阴长</span>
        </div>
        <div className="flex justify-between text-[9px] text-[var(--muted)]">
          <span>冬至·一阳生</span>
          <span>春分</span>
          <span>立夏·纯阳</span>
          <span>夏至·一阴生</span>
          <span>秋分</span>
          <span>立冬·纯阴</span>
        </div>
      </div>
    </div>
  )
}

// ─── 子组件：八卦配八节卡片 ────────────────────────────

function BaguaSeasonCard({ item, index }: { item: PreHeavenTerm, index: number }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      onClick={() => setFlipped(!flipped)}
      className={`relative w-full rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        flipped ? 'border-[var(--accent)] bg-[var(--glow)]' : 'border-[var(--border)] bg-[var(--bg2)] hover:border-[var(--accent)]'
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* 正面 */}
      <div className={`p-3.5 transition-opacity ${flipped ? 'opacity-0 absolute' : 'opacity-100'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[28px] leading-none">{item.baguaSymbol}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg3)] text-[var(--muted)] border border-[var(--border)]">
            {item.direction}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[16px] font-heading text-[var(--fg)]">{item.baguaName}</span>
          <span className="text-[11px] text-[var(--accent)] font-medium">{item.solarTerm}</span>
        </div>
        <YaoLines yao={item.yao} size={5} />
        <div className="mt-1.5 text-[11px] text-[var(--muted)] text-left">
          {item.description}
        </div>
      </div>
      {/* 反面 — 后天八卦对照 */}
      <div className={`p-3.5 transition-opacity ${flipped ? 'opacity-100' : 'opacity-0 absolute'}`}>
        <div className="text-[11px] text-[var(--muted)] mb-1">后天八卦</div>
        {postHeavenTerms.find(p => p.baguaName === item.baguaName) && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[20px]">{item.baguaSymbol}</span>
              <span className="text-[14px] font-heading text-[var(--fg)]">{item.baguaName}</span>
              <span className="text-[12px] text-[var(--accent)]">
                {postHeavenTerms.find(p => p.baguaName === item.baguaName)?.solarTerm}
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] leading-relaxed">
              {postHeavenTerms.find(p => p.baguaName === item.baguaName)?.significance}
            </p>
          </div>
        )}
        <div className="mt-2 text-[10px] text-[var(--muted)] italic">点击翻转 ↺ 看后天八卦对照</div>
      </div>
    </button>
  )
}

// ─── 子组件：二十四节气表 ──────────────────────────────

function SolarTermGrid() {
  const grouped = solarTerms24.reduce((acc, item) => {
    if (!acc[item.season]) acc[item.season] = []
    acc[item.season].push(item)
    return acc
  }, {} as Record<string, SolarTermItem[]>)

  return (
    <div className="space-y-6">
      {(['春','夏','秋','冬'] as const).map(season => (
        <div key={season}>
          <h3 className="text-[14px] font-heading text-[var(--fg)] mb-2.5">{seasonLabels[season]}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {grouped[season].map(item => (
              <div
                key={item.no}
                className={`p-3 rounded-lg bg-[var(--bg2)] border border-[var(--border)] border-l-2 ${seasonColors[season]} hover:border-l-[var(--accent)] transition-colors`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-[var(--muted)] font-mono">#{item.no.toString().padStart(2,'0')}</span>
                    <span className="text-[14px] font-heading text-[var(--fg)]">{item.name}</span>
                    <span className="text-[10px] text-[var(--muted)]">{item.pinyin}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.type === '节' ? 'bg-[var(--glow)] text-[var(--accent)]' : 'bg-[var(--bg3)] text-[var(--muted)]'} border border-[var(--border)]`}>
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[var(--muted)] mb-1">
                  <span>{item.date}</span>
                  <span className="opacity-40">|</span>
                  <span>黄经{item.celestial}</span>
                  {item.bagua && (
                    <>
                      <span className="opacity-40">|</span>
                      <span>卦·{item.bagua}</span>
                    </>
                  )}
                  {item.hexagram && (
                    <>
                      <span className="opacity-40">|</span>
                      <span className="text-[var(--accent)]">{item.hexagram}</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── 主页面 ────────────────────────────────────────────

export default function SolarTermsPage() {
  usePageTitle()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <main className="px-4 pb-12 mx-auto max-w-[960px]">
        <PageHeader
          title="卦象与节气历法"
          subtitle="八卦配二十四节气 · 阴阳消长 · 天人合一"
        />
        <div className="animate-pulse space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-40 rounded-xl bg-[var(--bg2)] opacity-50" />)}
        </div>
      </main>
    )
  }

  return (
    <main className="px-4 pb-16 mx-auto max-w-[960px]">
      <PageHeader
        title="卦象与节气历法"
        subtitle="八卦配二十四节气 · 阴阳消长 · 天人合一"
      />

      {/* ─── 导语 ─────────────────────────── */}
      <div className="mb-8 p-5 rounded-xl bg-[var(--bg2)] border border-[var(--border)]">
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          二十四节气是中国古人观察太阳周年运动而制定的时间体系，八卦则是描述宇宙变化规律的符号语言。
          二者在汉代合流，形成了<strong className="text-[var(--fg)]">卦气说</strong>——
          将卦象配节气、节气配音律，构建了一个<strong className="text-[var(--accent)]">时空一体、天人相应</strong>的完整宇宙模型。
        </p>
        <p className="text-sm text-[var(--muted)] leading-relaxed mt-2">
          这套体系的核心思想是<strong className="text-[var(--fg)]">「阴阳消长」</strong>：
          冬至一阳生（复卦䷗），夏至一阴生（姤卦䷫），
          阳气从复卦的一爻逐渐增长到乾卦的六爻纯阳，阴气从姤卦的一爻增长到坤卦的六爻纯阴。
          一年四季的变化，就是阴阳二气此消彼长的过程——这就是<strong className="text-[var(--accent)]">天人合一</strong>最直观的体现。
        </p>
      </div>

      {/* ─── 一、先天八卦配八节 ───────────── */}
      <section className="mb-10">
        <h3 className="text-[17px] font-heading text-[var(--fg)] mb-3">📍 先天八卦配八节</h3>
        <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
          伏羲先天八卦定空间方位，以<strong className="text-[var(--fg)]">二分二至（春分·夏至·秋分·冬至）+ 四立（立春·立夏·立秋·立冬）</strong>为骨架。
          每卦掌管一个关键节气。点击卡片翻转查看后天八卦对照。
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {preHeavenTerms.map((item, i) => (
            <BaguaSeasonCard key={item.baguaId} item={item} index={i} />
          ))}
        </div>
        {/* 四正四维示意图 */}
        <div className="mt-3 p-3 rounded-lg bg-[var(--bg2)] border border-[var(--border)] text-[11px] text-[var(--muted)] leading-relaxed">
          <strong className="text-[var(--fg)]">四正：</strong>震（春分·东）· 离（夏至·南）· 兑（秋分·西）· 坎（冬至·北）
          <span className="mx-2 opacity-30">|</span>
          <strong className="text-[var(--fg)]">四维：</strong>艮（立春·东北）· 巽（立夏·东南）· 坤（立秋·西南）· 乾（立冬·西北）
        </div>
      </section>

      {/* ─── 二、十二辟卦 · 阴阳消息 ─────────── */}
      <section className="mb-10">
        <h3 className="text-[17px] font-heading text-[var(--fg)] mb-3">📍 十二辟卦 · 阴阳消息</h3>
        <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
          十二辟卦（又称<strong className="text-[var(--fg)]">十二消息卦</strong>）由汉代孟喜创立。
          用十二个卦象模拟一年十二个月的阴阳消长过程——每卦管一个月，含两个节气。
          点击任意卦查看详情。
        </p>
        <SovereignTimeline />
      </section>

      {/* ─── 三、后天八卦配八节 ───────────── */}
      <section className="mb-10">
        <h3 className="text-[17px] font-heading text-[var(--fg)] mb-3">📍 后天八卦配八节</h3>
        <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
          文王后天八卦更侧重人间事，卦象与节气配合更为精细，
          每卦再分三山（二十四山向），精确对应二十四节气的具体日期。
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {postHeavenTerms.map(item => (
            <div key={item.baguaName} className="p-3 rounded-xl bg-[var(--bg2)] border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[20px]">{item.baguaSymbol}</span>
                <span className="text-[14px] font-heading text-[var(--fg)]">{item.baguaName}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] mb-1">
                <span className="text-[var(--accent)] font-medium">{item.solarTerm}</span>
                <span className="text-[var(--muted)]">· {item.direction}</span>
                <span className="text-[var(--muted)]">· {item.lunarMonth}月</span>
              </div>
              <p className="text-[11px] text-[var(--muted)] leading-relaxed">{item.significance}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 四、二十四节气全表 ─────────────── */}
      <section className="mb-10">
        <h3 className="text-[17px] font-heading text-[var(--fg)] mb-3">📍 二十四节气全表</h3>
        <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
          二十四节气按太阳黄经（0°~360°）划分，每15°一个节气。
          <strong className="text-[var(--fg)]">「节」</strong>为季节转换节点，
          <strong className="text-[var(--fg)]">「气」</strong>为气候中气。
          每个节气都对应特定的卦象，反映阴阳变化。
        </p>
        <SolarTermGrid />
      </section>

      {/* ─── 五、天人合一 ────────────────── */}
      <section className="mb-6">
        <h3 className="text-[17px] font-heading text-[var(--fg)] mb-3">📍 天人合一 · 卦气说的哲学内涵</h3>
        <div className="p-5 rounded-xl bg-gradient-to-br from-[var(--bg2)] via-[var(--bg2)] to-[var(--bg3)] border border-[var(--border)] space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-[18px] mt-0.5">☯️</span>
            <div>
              <h4 className="text-[13px] text-[var(--fg)] font-medium mb-1">时空一体</h4>
              <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                八卦既是空间方位（东、南、西、北、东北、东南、西南、西北），
                又是时间节律（春分、夏至、秋分、冬至、四立）。
                在卦象里，时间和空间是统一的——你站在哪个方位，就对应什么节气。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[18px] mt-0.5">🔄</span>
            <div>
              <h4 className="text-[13px] text-[var(--fg)] font-medium mb-1">物极必反</h4>
              <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                从复卦一阳生到乾卦纯阳（春→夏），阳气渐盛至极则一阴生（姤卦），
                再到坤卦纯阴（秋→冬），阴气渐盛至极则一阳复生——循环往复，无始无终。
                这个规律在二十四节气里同样成立：冬至阴极生阳，夏至阳极生阴。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[18px] mt-0.5">🌿</span>
            <div>
              <h4 className="text-[13px] text-[var(--fg)] font-medium mb-1">顺势而为</h4>
              <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                卦气说告诉我们的不是宿命，而是<strong className="text-[var(--accent)]">因时制宜</strong>的智慧。
                春分震卦当令——该行动了；夏至姤卦当令——该收敛了；
                秋分兑卦当令——该收获了；冬至复卦当令——该积蓄了。
                人不是对抗自然，而是顺应天地节律来安排自己的生活。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[18px] mt-0.5">🌌</span>
            <div>
              <h4 className="text-[13px] text-[var(--fg)] font-medium mb-1">天人相应</h4>
              <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                《乾卦·文言》曰：「与天地合其德，与日月合其明，与四时合其序。」
                人体的小宇宙和天地的大宇宙遵循同一个阴阳法则。
                春天养生、夏天养长、秋天养收、冬天养藏——中医的子午流注、五运六气，
                都是这个思想的具体应用。八卦配节气的终极意义，就是让人找到自己在天地间的位置。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 经典引文 ──────────────────── */}
      <blockquote className="p-4 rounded-xl bg-[var(--bg2)] border border-[var(--border)] text-center">
        <p className="text-xs text-[var(--muted)] italic leading-relaxed">
          「<strong className="text-[var(--fg)] not-italic">卦气</strong>起<strong className="text-[var(--yang)]">中孚</strong>，
          故离<strong className="text-[var(--yang)]">坎</strong>、<strong className="text-[var(--yang)]">震</strong>、<strong className="text-[var(--yang)]">兑</strong>各主一方，
          其餘六十卦，卦有六爻，爻主一日，凡主三百六十日。
          餘有五日四分日之一者，以通閏餘。」
        </p>
        <footer className="mt-1 text-[10px] text-[var(--muted)]">—— 孟喜 · 卦气图说（汉代）</footer>
      </blockquote>

      {/* 今日卦象注 */}
      <div className="mt-6 p-4 rounded-xl bg-[var(--bg3)] border border-[var(--border)]">
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          📌 <strong className="text-[var(--fg)]">今日卦象：</strong>
          6月28日，时值芒种之后、夏至刚过，阴气初生未盛。
          从十二辟卦来看，正处在 <strong className="text-[var(--accent)]">姤卦䷫</strong>
          （一阴始生）向 <strong className="text-[var(--accent)]">遁卦䷠</strong>
          （二阴浸长）过渡的阶段——这也正是首页显示䷠遁卦的原因。
          阳极转阴，君子当知进退，审时度势。
        </p>
      </div>

    </main>
  )
}
