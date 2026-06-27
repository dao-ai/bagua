'use client'
import usePageTitle from '@/hooks/usePageTitle'
import PageHeader from '@/components/PageHeader'
import { baguaList, type Bagua } from '@/data/bagua'

// 先天八卦在图上的方位角（0°=上，顺时针）
const xiantianAngles: Record<string, number> = {
  qian: 0,   // 南
  dui:  45,  // 东南
  li:   90,  // 东
  zhen: 135, // 东北
  kun:  180, // 北
  gen:  225, // 西北
  kan:  270, // 西
  xun:  315, // 西南
}

// 方向标签
const directionLabels: Record<string, { label: string; angle: number }> = {
  south: { label: '南', angle: 0 },
  east:  { label: '东', angle: 90 },
  north: { label: '北', angle: 180 },
  west:  { label: '西', angle: 270 },
}

// 五行颜色
const elementColors: Record<string, string> = {
  '木': '#4ade80',
  '火': '#f87171',
  '土': '#fbbf24',
  '金': '#fbbf24',
  '水': '#60a5fa',
}

// Draw trigram lines (3 yao: bottom→top order in yao array)
function drawYao(yao: number[], x: number, y: number, color: string): string {
  const gap = 8
  let lines = ''
  // yao array: [下, 中, 上]; draw top to bottom, so iterate reversed
  for (let i = 0; i < 3; i++) {
    const v = yao[2 - i]
    const cy = y - i * gap
    if (v === 1) {
      lines += `<rect x="${x-10}" y="${cy-2}" width="20" height="3" rx="1" fill="${color}" opacity="0.7"/>`
    } else {
      lines += `<rect x="${x-10}" y="${cy-2}" width="8" height="3" rx="1" fill="${color}" opacity="0.7"/>`
      lines += `<rect x="${x+2}" y="${cy-2}" width="8" height="3" rx="1" fill="${color}" opacity="0.7"/>`
    }
  }
  return lines
}

// SVG coordinate helpers
function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const rad = (angleDeg - 90) * Math.PI / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

type LayerMode = 'all' | 'pairs' | 'element' | 'family'

export default function RelationsPage() {
  usePageTitle()

  const cx = 400, cy = 360, r = 220

  // 配对信息
  const pairs: [string, string, string][] = [
    ['qian', 'kun', '三阳 ↔ 三阴'],
    ['li', 'kan', '外阳内阴 ↔ 外阴内阳'],
    ['zhen', 'xun', '一阳在下 ↔ 一阴在下'],
    ['dui', 'gen', '一阴在上 ↔ 一阳在上'],
  ]

  // 五行相生环：木→火→土→金→水→木 对应卦的五行属性
  const elementOrder: { baguai: string[]; label: string }[] = [
    { baguai: ['xun', 'zhen'], label: '木' },
    { baguai: ['li'], label: '火' },
    { baguai: ['kun', 'gen'], label: '土' },
    { baguai: ['dui', 'qian'], label: '金' },
    { baguai: ['kan'], label: '水' },
  ]

  // 家庭关系标签（在节点附近显示）
  const familyLabels: Record<string, string> = {
    qian: '父☰', kun: '母☷',
    zhen: '长男☳', xun: '长女☴',
    kan: '中男☵', li: '中女☲',
    gen: '少男☶', dui: '少女☱',
  }

  const baguaId = baguaList.reduce((acc, b) => { acc[b.id] = b; return acc }, {} as Record<string, Bagua>)

  return (
    <>
      <PageHeader
        title="🗺️ 卦象关系图"
        subtitle="先天八卦方位 · 阴阳对偶 · 五行生克 · 家庭角色，一图看懂八卦之间的关联"
      />

      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {([
          { mode: 'all', label: '☯ 全貌' },
          { mode: 'pairs', label: '⚡ 阴阳对偶' },
          { mode: 'element', label: '🔥 五行相生' },
          { mode: 'family', label: '👨‍👩‍👧‍👦 家庭关系' },
        ] as { mode: LayerMode; label: string }[]).map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => {
              document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('bg-[var(--accent)]', 'text-[var(--bg)]', 'font-semibold'))
              document.querySelectorAll(`[data-mode="${mode}"]`).forEach(b => b.classList.add('bg-[var(--accent)]', 'text-[var(--bg)]', 'font-semibold'))
              document.querySelectorAll('[data-layer]').forEach(el => el.classList.remove('opacity-0', 'pointer-events-none'))
              if (mode !== 'all') {
                document.querySelectorAll(`[data-layer]:not([data-layer="${mode}"])`).forEach(el => el.classList.add('opacity-0', 'pointer-events-none'))
              }
              // also dim connectors not in this mode
              document.querySelectorAll('.connector').forEach(el => {
                if (mode === 'all') el.classList.remove('opacity-10')
                else el.classList.add('opacity-10')
              })
              document.querySelectorAll(`.connector-${mode}`).forEach(el => {
                if (mode !== 'all') el.classList.remove('opacity-10')
              })
            }}
            data-mode={mode}
            className="layer-btn px-5 py-2 rounded-full text-[13px] border cursor-pointer transition-all bg-transparent text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-[860px] mx-auto rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 800 720" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" style={{ background: 'transparent' }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* 外圈方向标 */}
          {(Object.values(directionLabels) as { label: string; angle: number }[]).map(({ label, angle }) => {
            const [x, y] = polar(cx, cy, 280, angle)
            return (
              <text key={label} x={x} y={y + 4} textAnchor="middle" fontSize={12} fill="var(--muted)" fontFamily="ui-serif, serif" opacity={0.5}>
                {label}
              </text>
            )
          })}

          {/* 引导圆 */}
          {[240, 200, 160].map(rr => (
            <circle key={rr} cx={cx} cy={cy} r={rr} fill="none" stroke="var(--border)" strokeWidth={0.5} opacity={0.15}/>
          ))}

          {/* ======= 阴阳对偶连线 ======= */}
          <g data-layer="pairs" className="connector connector-pairs">
            {pairs.map(([id1, id2, label]) => {
              const b1 = baguaId[id1], b2 = baguaId[id2]
              if (!b1 || !b2) return null
              const a1 = xiantianAngles[id1], a2 = xiantianAngles[id2]
              const [x1, y1] = polar(cx, cy, r, a1)
              const [x2, y2] = polar(cx, cy, r, a2)
              const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2
              return (
                <g key={`pair-${id1}-${id2}`} opacity={0.55}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--risk)" strokeWidth={1.5} strokeDasharray="6 4"/>
                  <text x={midX} y={midY - 8} textAnchor="middle" fontSize={9} fill="var(--risk)" fontFamily="ui-sans, sans-serif" opacity={0.8}>
                    {label}
                  </text>
                </g>
              )
            })}
          </g>

          {/* ======= 五行相生环 ======= */}
          <g data-layer="element" className="connector connector-element">
            {/* 画一个正五边形路径连接五行代表卦 */}
            {/* 木→火→土→金→水→木 */}
            {elementOrder.map((elem, i) => {
              const next = elementOrder[(i + 1) % elementOrder.length]
              // 取每组的第一个卦代表该元素位置
              const fId = elem.baguai[0]
              const toId = next.baguai[0]
              const bf = baguaId[fId], bt = baguaId[toId]
              if (!bf || !bt) return null
              const [xf, yf] = polar(cx, cy, r, xiantianAngles[fId])
              const [xt, yt] = polar(cx, cy, r, xiantianAngles[toId])
              // 画弧线（用二次贝塞尔，向外弯曲一点）
              const midAngle = (xiantianAngles[fId] + xiantianAngles[toId]) / 2
              const [ctrlX, ctrlY] = polar(cx, cy, r + 30, midAngle)
              return (
                <g key={`elem-${i}`}>
                  <path d={`M${xf},${yf} Q${ctrlX},${ctrlY} ${xt},${yt}`}
                    fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="5 3" opacity={0.45}/>
                  {/* 五行标签 */}
                  <text x={(xf + xt) / 2 + 15} y={(yf + yt) / 2 - 10}
                    textAnchor="middle" fontSize={10} fill="var(--accent)" fontFamily="ui-serif, serif" opacity={0.7}>
                    {elem.label}
                  </text>
                </g>
              )
            })}
          </g>

          {/* ======= 八个卦象节点 ======= */}
          {baguaList.map(b => {
            const angle = xiantianAngles[b.id]
            const [nx, ny] = polar(cx, cy, r, angle)
            const boxW = 110, boxH = 68
            const bx = nx - boxW / 2, by = ny - boxH / 2
            const elemAttr = b.attribute === '刚健' || b.attribute === '喜悦' ? '金' :
              b.attribute === '附丽' ? '火' :
              b.attribute === '发动' || b.attribute === '渗透' ? '木' :
              b.attribute === '险陷' ? '水' : '土'

            return (
              <g key={b.id} className="node-box" data-mode-info={b.id}>
                {/* 节点背景 */}
                <rect x={bx} y={by} width={boxW} height={boxH} rx={10}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={1} opacity={0.92}/>
                {/* 顶部装饰线 */}
                <rect x={bx + 10} y={by} width={boxW - 20} height={3} rx={1.5}
                  fill="var(--accent)" opacity={0.3}/>
                {/* 卦名 + 符号 */}
                <text x={nx} y={ny - 12} textAnchor="middle" fontSize={18} fontWeight={700}
                  fill="var(--fg)" fontFamily="ui-serif, serif">
                  {b.symbol} {b.name}
                </text>
                {/* 属性 */}
                <text x={nx} y={ny + 4} textAnchor="middle" fontSize={10}
                  fill="var(--muted)" fontFamily="ui-sans, sans-serif">
                  {b.pinyin} · {b.nature} · {elemAttr}
                </text>
                {/* 家庭角色（默认隐藏） */}
                <text data-layer="family" x={nx} y={ny + 18} textAnchor="middle" fontSize={11}
                  fill="var(--accent)" fontFamily="ui-serif, serif" opacity={0}>
                  {familyLabels[b.id]}
                </text>
                {/* 下方爻线 */}
                <g transform={`translate(${nx}, ${ny + boxH / 2 + 8})`}>
                  {drawYao(b.yao, 0, 0, 'var(--fg)')}
                </g>
              </g>
            )
          })}

          {/* ======= 太极中心 ======= */}
          <g transform={`translate(${cx}, ${cy})`}>
            <circle cx={0} cy={0} r={40} fill="none" stroke="var(--accent)" strokeWidth={1.5}/>
            <path d="M0,-40 A20,20 0 0,1 0,0 A20,20 0 0,0 0,40 A40,40 0 0,1 0,-40 Z" fill="#111"/>
            <path d="M0,-40 A20,20 0 0,0 0,0 A20,20 0 0,1 0,40 A40,40 0 0,0 0,-40 Z" fill="#f5f0e8"/>
            <circle cx={0} cy={-20} r={6} fill="#f5f0e8"/>
            <circle cx={0} cy={20}  r={6} fill="#111"/>
            <text x={0} y={58} textAnchor="middle" fontSize={14} fontWeight={650}
              fill="var(--accent)" fontFamily="ui-serif, serif">太极</text>
            <text x={0} y={72} textAnchor="middle" fontSize={10}
              fill="var(--muted)">阴阳两仪</text>
          </g>
        </svg>
      </div>

      {/* 说明区 */}
      <div className="max-w-[640px] mx-auto mt-6 text-center text-sm text-[var(--muted)] leading-relaxed">
        <p id="relation-info">
          <strong className="text-[var(--fg)]">先天八卦（伏羲八卦）</strong>：乾南坤北，离东坎西。
          四组对偶卦阴阳爻完全互补，是八卦体系最基本的对立统一关系。可点击上方按钮切换显示层次。
        </p>
      </div>

      {/* 图例 */}
      <div className="flex justify-center gap-6 mt-4 text-xs text-[var(--muted)] flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-6 h-[2px] bg-[var(--risk)]" style={{ height: 2 }}/> 阴阳对偶
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-6 h-[2px]" style={{ height: 2, background: 'var(--accent)', opacity: 0.5 }}/> 五行相生
        </span>
      </div>
    </>
  )
}
