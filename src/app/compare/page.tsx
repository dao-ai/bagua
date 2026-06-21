'use client'

import { useState, useMemo } from 'react'
import usePageTitle from '@/hooks/usePageTitle'
import { RubyText } from '@/components/Ruby'
import { baguaList, baguaMap, getHexagramName, getHexagramSymbol } from '@/data/bagua'
import { hexagramOrder, getHexagramDetail } from '@/data/hexagrams'

/** 八经卦五行 */
const WU_XING: Record<string, string> = {
  qian: '金', dui: '金',
  zhen: '木', xun: '木',
  kan: '水',
  li: '火',
  gen: '土', kun: '土',
}

const WU_XING_COLORS: Record<string, string> = {
  '金': '#f0d080',
  '木': '#6bb86b',
  '水': '#5b9bd5',
  '火': '#e06050',
  '土': '#d4a050',
}

interface HexData {
  upperId: string
  lowerId: string
  name: string
  symbol: string
  detail: ReturnType<typeof getHexagramDetail>
}

export default function ComparePage() {
  usePageTitle()

  // 两个对比对象
  const [left, setLeft] = useState<HexData | null>(null)
  const [right, setRight] = useState<HexData | null>(null)

  // 选卦弹窗
  const [picker, setPicker] = useState<'left' | 'right' | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return hexagramOrder
    const q = search.toLowerCase().trim()
    return hexagramOrder.filter(([u, l]) => getHexagramName(u, l).includes(q))
  }, [search])

  const selectHex = (side: 'left' | 'right', u: string, l: string) => {
    const data: HexData = {
      upperId: u, lowerId: l,
      name: getHexagramName(u, l),
      symbol: getHexagramSymbol(u, l),
      detail: getHexagramDetail(u, l),
    }
    if (side === 'left') setLeft(data)
    else setRight(data)
    setPicker(null)
    setSearch('')
  }

  return (
    <>
      <div className="text-center pb-6">
        <h2 className="text-[26px] mb-1.5 font-heading">双卦对比</h2>
        <p className="text-sm text-[var(--muted)] max-w-[520px] mx-auto">
          左右各选一卦，对比卦象、卦辞、五行属性。
        </p>
      </div>

      {/* 对比区 */}
      <div className="flex justify-center gap-2 items-stretch max-sm:flex-col max-w-[800px] mx-auto mb-6">
        {/* 左卦 */}
        <div className="flex-1 min-w-0">
          <HexPanel
            data={left}
            side="left"
            onPick={() => setPicker('left')}
            onClear={() => setLeft(null)}
          />
        </div>

        {/* VS */}
        <div className="flex items-center justify-center px-2">
          <div className="text-[20px] text-[var(--muted)] font-bold">VS</div>
        </div>

        {/* 右卦 */}
        <div className="flex-1 min-w-0">
          <HexPanel
            data={right}
            side="right"
            onPick={() => setPicker('right')}
            onClear={() => setRight(null)}
          />
        </div>
      </div>

      {/* 对比结果 */}
      {left && right && (
        <ComparisonTable left={left} right={right} />
      )}

      {/* 选卦弹窗 */}
      {picker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => { setPicker(null); setSearch('') }}
        >
          <div
            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-[420px] max-h-[70vh] flex flex-col overflow-hidden animate-[fadeIn_0.15s_ease]"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-3 border-b border-[var(--border)]">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索卦名…"
                autoFocus
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-[var(--fg)] text-sm outline-none focus:border-[var(--accent)] transition-colors caret-[var(--accent)]"
              />
            </div>
            <div className="overflow-y-auto flex-1 p-2">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-sm text-[var(--muted)]">无匹配</div>
              ) : (
                <div className="grid grid-cols-2 gap-0.5">
                  {filtered.map(([u, l]) => {
                    const name = getHexagramName(u, l)
                    const sym = getHexagramSymbol(u, l)
                    return (
                      <button
                        key={`${u}-${l}`}
                        onClick={() => selectHex(picker, u, l)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-left cursor-pointer hover:bg-[var(--bg3)] transition-colors"
                      >
                        <span className="text-[18px] w-[24px] text-center">{sym}</span>
                        <span className="text-sm"><RubyText text={name} /></span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-center text-[var(--muted)] mt-2">💡 左右各选一卦，自动对比</p>
    </>
  )
}

function HexPanel({ data, side, onPick, onClear }: {
  data: HexData | null
  side: 'left' | 'right'
  onPick: () => void
  onClear: () => void
}) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 text-center h-full flex flex-col">
      {data ? (
        <>
          <div className="flex justify-end mb-1">
            <button onClick={onClear} className="text-[10px] text-[var(--muted)] hover:text-[var(--risk)] cursor-pointer">✕ 清除</button>
          </div>
          <div className="text-[52px] mb-1">{data.symbol}</div>
          <div className="text-[20px] font-bold font-heading mb-0.5">
            <RubyText text={data.name} />
          </div>
          <div className="text-[11px] text-[var(--muted)] mb-2">
            {baguaMap[data.upperId].name}（{baguaMap[data.upperId].symbol}）· {baguaMap[data.lowerId].name}（{baguaMap[data.lowerId].symbol}）
          </div>
          {data.detail && (
            <div className="flex-1 text-left px-2">
              <div className="text-[11px] font-semibold text-[var(--accent)] mb-0.5">卦辞</div>
              <div className="text-[12px] text-[var(--accent2)] font-semibold mb-1"><RubyText text={data.detail.judgment} /></div>
              <div className="text-[10px] italic text-[var(--muted)] mb-1"><RubyText text={data.detail.image} /></div>
              <div className="text-[11px] leading-relaxed line-clamp-4"><RubyText text={data.detail.meaning} /></div>
            </div>
          )}
        </>
      ) : (
        <button onClick={onPick} className="flex-1 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[var(--bg3)] rounded-xl transition-colors border-2 border-dashed border-[var(--border)] py-12">
          <span className="text-[32px] opacity-30">+</span>
          <span className="text-[12px] text-[var(--muted)]">选择{side === 'left' ? '左' : '右'}卦</span>
        </button>
      )}
    </div>
  )
}

function ComparisonTable({ left, right }: { left: HexData; right: HexData }) {
  // 获取上下卦五行
  const lUpElement = WU_XING[left.upperId] || ''
  const lLowElement = WU_XING[left.lowerId] || ''
  const rUpElement = WU_XING[right.upperId] || ''
  const rLowElement = WU_XING[right.lowerId] || ''

  return (
    <div className="max-w-[600px] mx-auto animate-[fadeIn_0.3s_ease]">
      {/* 五行对比 */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5 mb-4">
        <div className="text-[13px] font-semibold font-heading mb-3 text-center">五行属性对比</div>
        <div className="grid grid-cols-2 gap-3">
          {/* 左 */}
          <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <div className="text-[11px] text-center font-semibold mb-2"><RubyText text={left.name} /> {left.symbol}</div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">上卦</span>
                <span>{baguaMap[left.upperId].name} · <ElementBadge el={lUpElement} /></span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">下卦</span>
                <span>{baguaMap[left.lowerId].name} · <ElementBadge el={lLowElement} /></span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">自然</span>
                <span>{baguaMap[left.upperId].nature}/{baguaMap[left.lowerId].nature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">方向</span>
                <span>{baguaMap[left.upperId].direction}/{baguaMap[left.lowerId].direction}</span>
              </div>
            </div>
          </div>
          {/* 右 */}
          <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <div className="text-[11px] text-center font-semibold mb-2"><RubyText text={right.name} /> {right.symbol}</div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">上卦</span>
                <span>{baguaMap[right.upperId].name} · <ElementBadge el={rUpElement} /></span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">下卦</span>
                <span>{baguaMap[right.lowerId].name} · <ElementBadge el={rLowElement} /></span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">自然</span>
                <span>{baguaMap[right.upperId].nature}/{baguaMap[right.lowerId].nature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">方向</span>
                <span>{baguaMap[right.upperId].direction}/{baguaMap[right.lowerId].direction}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 卦辞对比 */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5 mb-4">
        <div className="text-[13px] font-semibold font-heading mb-3 text-center">卦辞对比</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <div className="text-[11px] text-[var(--accent)] font-semibold mb-1">卦辞</div>
            <div className="text-[12px] text-[var(--accent2)] font-semibold mb-1.5"><RubyText text={left.detail?.judgment || ''} /></div>
            <div className="text-[10px] italic text-[var(--muted)] mb-1"><RubyText text={left.detail?.image || ''} /></div>
            <div className="text-[11px] leading-relaxed"><RubyText text={left.detail?.meaning || ''} /></div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <div className="text-[11px] text-[var(--accent)] font-semibold mb-1">卦辞</div>
            <div className="text-[12px] text-[var(--accent2)] font-semibold mb-1.5"><RubyText text={right.detail?.judgment || ''} /></div>
            <div className="text-[10px] italic text-[var(--muted)] mb-1"><RubyText text={right.detail?.image || ''} /></div>
            <div className="text-[11px] leading-relaxed"><RubyText text={right.detail?.meaning || ''} /></div>
          </div>
        </div>
      </div>

      {/* 生克关系 */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5">
        <div className="text-[13px] font-semibold font-heading mb-3 text-center">生克关系</div>
        <div className="text-center text-[12px] leading-relaxed px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
          <RelationResult left={left} right={right} />
        </div>
      </div>
    </div>
  )
}

function ElementBadge({ el }: { el: string }) {
  const color = WU_XING_COLORS[el] || '#888'
  return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ background: color + '22', color }}>{el}</span>
}

function RelationResult({ left, right }: { left: HexData; right: HexData }) {
  // 上卦对上卦、下卦对下卦的生克关系
  const pairs = [
    { label: '上卦对上卦', l: WU_XING[left.upperId], r: WU_XING[right.upperId] },
    { label: '下卦对下卦', l: WU_XING[left.lowerId], r: WU_XING[right.lowerId] },
    { label: '上卦对下卦', l: WU_XING[left.upperId], r: WU_XING[right.lowerId] },
    { label: '下卦对上卦', l: WU_XING[left.lowerId], r: WU_XING[right.upperId] },
  ]

  const shengKe = (a: string, b: string): string => {
    if (!a || !b) return '—'
    if (a === b) return '同五行'
    const sheng: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }
    const ke: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' }
    if (sheng[a] === b) return `${a}生${b}`
    if (sheng[b] === a) return `${b}生${a}`
    if (ke[a] === b) return `${a}克${b}`
    if (ke[b] === a) return `${b}克${a}`
    return '—'
  }

  return (
    <div className="space-y-1.5 text-[11px]">
      {pairs.map(p => {
        const relation = shengKe(p.l, p.r)
        const isSheng = relation.includes('生')
        const isKe = relation.includes('克')
        return (
          <div key={p.label} className="flex justify-between items-center">
            <span className="text-[var(--muted)]">{p.label}</span>
            <span>
              <ElementBadge el={p.l} /> → <ElementBadge el={p.r} />
              <span className={`ml-2 text-[10px] font-semibold ${
                isSheng ? 'text-[var(--yang)]' : isKe ? 'text-[var(--risk)]' : 'text-[var(--muted)]'
              }`}>
                {relation}
              </span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
