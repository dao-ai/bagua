'use client'
import usePageTitle from '@/hooks/usePageTitle'

import { useState } from 'react'
import PageHeader from '@/components/PageHeader'
import { RubyText } from '@/components/Ruby'
import { baguaMap } from '@/data/bagua'

/** 先天八卦方位（邵雍伏羲八卦） */
const XIAN_TIAN: { id: string; label: string; position: string }[] = [
  { id: 'qian', label: '乾一', position: '南' },
  { id: 'dui',   label: '兑二', position: '东南' },
  { id: 'li',    label: '离三', position: '东' },
  { id: 'zhen',  label: '震四', position: '东北' },
  { id: 'xun',   label: '巽五', position: '西南' },
  { id: 'kan',   label: '坎六', position: '西' },
  { id: 'gen',   label: '艮七', position: '西北' },
  { id: 'kun',   label: '坤八', position: '北' },
]

/** 后天八卦方位（文王八卦） */
const HOU_TIAN: { id: string; label: string; position: string }[] = [
  { id: 'li',    label: '离', position: '南' },
  { id: 'kun',   label: '坤', position: '西南' },
  { id: 'dui',   label: '兑', position: '西' },
  { id: 'qian',  label: '乾', position: '西北' },
  { id: 'kan',   label: '坎', position: '北' },
  { id: 'gen',   label: '艮', position: '东北' },
  { id: 'zhen',  label: '震', position: '东' },
  { id: 'xun',   label: '巽', position: '东南' },
]

export default function ContrastPage() {
  usePageTitle()

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedBagua = selectedId ? baguaMap[selectedId] : null

  // 选中卦在先天后天中的位置
  const xianPos = XIAN_TIAN.find(x => x.id === selectedId)
  const houPos = HOU_TIAN.find(h => h.id === selectedId)

  // 生成八卦排盘
  const xianTriggers = XIAN_TIAN.map(x => ({
    ...x,
    b: baguaMap[x.id],
    isSelected: x.id === selectedId,
  }))

  const houTriggers = HOU_TIAN.map(h => ({
    ...h,
    b: baguaMap[h.id],
    isSelected: h.id === selectedId,
  }))

  return (
    <>
      <PageHeader title="先天 · 后天" subtitle="同一个八卦，两套图谱。先天说「本来如此」，后天讲「如何应用」。" />

      {/* 两列对比 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto mb-8">
        {/* 先天八卦 */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
          <div className="text-center mb-4">
            <div className="text-[16px] font-bold font-heading">伏羲先天八卦</div>
            <div className="text-[11px] text-[var(--muted)]">邵雍传 · 讲"本来如此"</div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {xianTriggers.map((x, i) => (
              <button
                key={x.id}
                onClick={() => setSelectedId(x.id === selectedId ? null : x.id)}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                  x.isSelected
                    ? 'border-[var(--accent)] bg-[var(--bg3)] shadow-[0_0_12px_var(--glow)]'
                    : 'border-transparent hover:bg-[var(--bg3)] hover:border-[var(--border)]'
                }`}
              >
                <span className="text-[28px]">{x.b.symbol}</span>
                <span className="text-[12px] font-semibold">{x.b.name}</span>
                <span className="text-[9px] text-[var(--muted)]">{x.label}</span>
                <span className="text-[9px] text-[var(--accent)]">{x.position}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 后天八卦 */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
          <div className="text-center mb-4">
            <div className="text-[16px] font-bold font-heading">文王后天八卦</div>
            <div className="text-[11px] text-[var(--muted)]" style={{ color: 'var(--accent2)' }}>讲"如何应用"</div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {houTriggers.map((h, i) => (
              <button
                key={h.id}
                onClick={() => setSelectedId(h.id === selectedId ? null : h.id)}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                  h.isSelected
                    ? 'border-[var(--accent)] bg-[var(--bg3)] shadow-[0_0_12px_var(--glow)]'
                    : 'border-transparent hover:bg-[var(--bg3)] hover:border-[var(--border)]'
                }`}
              >
                <span className="text-[28px]">{h.b.symbol}</span>
                <span className="text-[12px] font-semibold">{h.b.name}</span>
                <span className="text-[9px] text-[var(--muted)]">{h.label}</span>
                <span className="text-[9px] text-[var(--accent2)]">{h.position}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 选中卦的详情对比 */}
      {selectedBagua && selectedId && xianPos && houPos && (
        <div className="max-w-[600px] mx-auto animate-[fadeIn_0.3s_ease]">
          <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-6">
            {/* 卦头 */}
            <div className="text-center mb-5">
              <div className="text-[48px] mb-1">{selectedBagua.symbol}</div>
              <div className="text-[20px] font-bold font-heading">
                <RubyText text={selectedBagua.name} /> 卦
              </div>
              <div className="text-[12px] text-[var(--muted)]">{selectedBagua.pinyin}</div>
            </div>

            {/* 对比表格 */}
            <div className="grid grid-cols-2 gap-4">
              {/* 先天 */}
              <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <div className="text-[11px] uppercase tracking-wider font-semibold mb-3">先天</div>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">顺序</span>
                    <span>{xianPos.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">方位</span>
                    <span className="text-[var(--accent)]">{xianPos.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">二进制</span>
                    <span className="font-mono">{selectedBagua.binary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">十进制</span>
                    <span>{selectedBagua.decimal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">特征</span>
                    <span>{selectedBagua.attribute}</span>
                  </div>
                </div>
              </div>

              {/* 后天 */}
              <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <div className="text-[11px] uppercase tracking-wider font-semibold mb-3" style={{ color: 'var(--accent2)' }}>后天</div>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">方位</span>
                    <span style={{ color: 'var(--accent2)' }}>{houPos.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">季节</span>
                    <span>{selectedBagua.season}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">自然</span>
                    <span>{selectedBagua.nature}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">家人</span>
                    <span>{selectedBagua.family}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">身体</span>
                    <span>{selectedBagua.body}</span>
                  </div>
                    <div className="flex justify-between">
                    <span className="text-[var(--muted)]">动物</span>
                    <span>{selectedBagua.animal}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 核心对比说明 */}
            <div className="mt-4 p-4 rounded-xl bg-[var(--bg3)] text-[11px] leading-relaxed">
              <div className="font-semibold mb-1 text-[var(--accent)]">💡 先天 vs 后天 · {selectedBagua.name}卦</div>
              <div className="text-[var(--muted)]">
                <p className="mb-1">先天位在<strong className="text-[var(--fg)]">{xianPos.position}</strong>，后天位在<strong className="text-[var(--fg)]">{houPos.position}</strong>。</p>
                <p>{selectedBagua.short}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 总览说明 */}
      <div className="max-w-[600px] mx-auto mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <div className="text-[13px] font-semibold font-heading mb-2">先天八卦 · 伏羲</div>
            <div className="text-[11px] text-[var(--muted)] leading-relaxed">
              邵雍根据"太极生两仪，两仪生四象，四象生八卦"推导出的八卦本源次序。讲的是宇宙的本来面貌，看的是"本来如此"。
            </div>
            <div className="mt-2 text-[10px] text-[var(--accent)]">
              乾一 · 兑二 · 离三 · 震四 · 巽五 · 坎六 · 艮七 · 坤八
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <div className="text-[13px] font-semibold font-heading mb-2">后天八卦 · 文王</div>
            <div className="text-[11px] text-[var(--muted)] leading-relaxed">
              周文王根据实际应用调整的卦位体系。讲的是"如何应用"——方位、季节、五行、家庭角色，都在后天八卦中对应。
            </div>
            <div className="mt-2 text-[10px]" style={{ color: 'var(--accent2)' }}>
              离南 · 坤西南 · 兑西 · 乾西北 · 坎北 · 艮东北 · 震东 · 巽东南
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-center text-[var(--muted)] mt-6">
        💡 点选任一卦，查看它在两套系统中的位置对比
      </p>
    </>
  )
}
