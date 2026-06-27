'use client'

import { useState } from 'react'
import type { LiuyaoResult, YaoInfo } from '@/data/liuyao'
import {
  LIU_SHEN_ICON,
  LIU_QIN_COLOR,
  WUXING_COLOR,
  LIU_SHEN_COLOR,
} from '@/data/liuyao'

interface Props {
  result: LiuyaoResult
  /** 允许用户手动选日干 */
  dayStem?: string
  onDayStemChange?: (stem: string) => void
}

/** 单行爻线 SVG */
function YaoLineSVG({ yang, big }: { yang: boolean; big?: boolean }) {
  const w = big ? 80 : 56
  const h = big ? 8 : 6
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      {yang ? (
        <rect x="0" y="0" width={w} height={h} rx={2} fill="var(--yang, #f0c040)" />
      ) : (
        <>
          <rect x="0" y="0" width={w * 0.38} height={h} rx={2} fill="var(--yin, #555)" />
          <rect x={w * 0.62} y="0" width={w * 0.38} height={h} rx={2} fill="var(--yin, #555)" />
        </>
      )}
    </svg>
  )
}

export default function LiuyaoPan({ result }: Props) {
  const r = result
  // 从下到上显示：上爻在上，初爻在下
  const reversed = [...r.lines].toReversed()
  const [expandedLine, setExpandedLine] = useState<number | null>(null)

  return (
    <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden
      shadow-[0_4px_24px_rgba(0,0,0,0.08)]" data-mcp-component="liuyao-pan">

      {/* ── 表头 ── */}
      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg2)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-[var(--accent2)] tracking-wider">
            📋 六爻排盘
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold
            bg-[var(--accent)]/10 text-[var(--accent)]
            border border-[var(--accent)]/20">
            {r.palaceName}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px]
            bg-[var(--bg3)] text-[var(--muted)]">
            {r.generation}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
          <span>纳甲：内{ r.innerStem } 外{ r.outerStem }</span>
          <span className="w-px h-3 bg-[var(--border)]" />
          <span>五行：{ r.palaceWuxing }宫</span>
        </div>
      </div>

      {/* ── 爻线表（桌面宽屏版） ── */}
      <div className="hidden sm:block px-2 py-1">
        {/* 列标题 */}
        <div className="grid grid-cols-[44px_64px_52px_52px_56px_1fr_36px] gap-x-1 px-3 py-2
          text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold border-b border-[var(--border)]">
          <span>爻位</span>
          <span>六神</span>
          <span>天干</span>
          <span>地支</span>
          <span>五行</span>
          <span className="text-center">爻线</span>
          <span className="text-center">世应</span>
        </div>

        {/* 数据行 —— 从上爻到初爻 */}
        {reversed.map((yao, i) => (
          <YaoRowDesktop key={i} yao={yao} index={i} />
        ))}
      </div>

      {/* ── 爻线表（移动端紧凑版） ── */}
      <div className="sm:hidden">
        {reversed.map((yao, i) => (
          <YaoRowMobile
            key={i}
            yao={yao}
            index={i}
            expanded={expandedLine === i}
            onToggle={() => setExpandedLine(expandedLine === i ? null : i)}
          />
        ))}
      </div>

      {/* ── 图例 ── */}
      <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--bg2)] 
        flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[var(--muted)]">
        <span className="font-semibold text-[11px] text-[var(--fg)]">六亲：</span>
        {['父母','兄弟','妻财','官鬼','子孙'].map(q => (
          <span key={q} className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: LIU_QIN_COLOR[q] }} />
            {q}
          </span>
        ))}
        <span className="w-px h-3 bg-[var(--border)]" />
        <span className="font-semibold text-[11px] text-[var(--fg)]">世应：</span>
        <span><span className="inline-block w-3 h-3 rounded-full bg-[var(--accent)] mr-0.5 align-middle" />世</span>
        <span><span className="inline-block w-3 h-3 rounded-full bg-[#e74c3c] mr-0.5 align-middle" />应</span>
      </div>
    </div>
  )
}

/** 桌面版单行 */
function YaoRowDesktop({ yao, index }: { yao: YaoInfo; index: number }) {
  const bgEven = index % 2 === 1 ? 'bg-[var(--bg3)]/30' : ''
  return (
    <div className={`grid grid-cols-[44px_64px_52px_52px_56px_1fr_36px] gap-x-1 px-3 py-2.5
      items-center text-sm ${bgEven} hover:bg-[var(--bg3)]/60 transition-colors`}>
      {/* 爻位 */}
      <span className="text-[11px] text-[var(--muted)] font-medium">{yao.posName}</span>

      {/* 六神 */}
      <span className="flex items-center gap-1 text-xs" style={{ color: LIU_SHEN_COLOR[yao.liushen] }}>
        <span>{LIU_SHEN_ICON[yao.liushen] || '·'}</span>
        <span>{yao.liushen}</span>
      </span>

      {/* 天干 */}
      <span className="text-xs font-mono">{yao.stem}</span>

      {/* 地支 */}
      <span className="text-xs font-mono">{yao.branch}</span>

      {/* 五行 */}
      <span className="text-[11px] font-semibold" style={{ color: WUXING_COLOR[yao.wuxing] }}>
        {yao.wuxing}
      </span>

      {/* 爻线 */}
      <div className="flex justify-center">
        <YaoLineSVG yang={yao.yang} />
      </div>

      {/* 世应与六亲 */}
      <div className="flex items-center justify-center gap-1">
        {yao.isShi && (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full
            bg-[var(--accent)] text-[8px] font-bold text-white"
            title="世爻">世</span>
        )}
        {yao.isYing && (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full
            bg-[#e74c3c] text-[8px] font-bold text-white"
            title="应爻">应</span>
        )}
        <span className="text-[11px] font-medium whitespace-nowrap"
          style={{ color: LIU_QIN_COLOR[yao.liuqin] }}>
          {yao.liuqin}
        </span>
      </div>
    </div>
  )
}

/** 移动版单行（可展开） */
function YaoRowMobile({ yao, index, expanded, onToggle }: {
  yao: YaoInfo
  index: number
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`border-b border-[var(--border)] last:border-b-0 cursor-pointer transition-colors
        ${expanded ? 'bg-[var(--bg3)]/50' : index % 2 === 1 ? 'bg-[var(--bg3)]/20' : ''}`}
      onClick={onToggle}
    >
      {/* 折叠态主行 */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* 爻位 + 六神 */}
        <span className="text-[11px] text-[var(--muted)] font-medium w-10 shrink-0">{yao.posName}</span>
        <span className="text-xs shrink-0" style={{ color: LIU_SHEN_COLOR[yao.liushen] }}>
          {LIU_SHEN_ICON[yao.liushen]}{yao.liushen}
        </span>
        {/* 爻线 */}
        <div className="flex-1 flex justify-center">
          <YaoLineSVG yang={yao.yang} />
        </div>
        {/* 六亲 */}
        <span className="text-[11px] font-medium shrink-0" style={{ color: LIU_QIN_COLOR[yao.liuqin] }}>
          {yao.liuqin}
        </span>
        {/* 世应 */}
        <div className="flex items-center gap-0.5 shrink-0">
          {yao.isShi && <span className="w-3.5 h-3.5 rounded-full bg-[var(--accent)] text-[7px] font-bold text-white flex items-center justify-center">世</span>}
          {yao.isYing && <span className="w-3.5 h-3.5 rounded-full bg-[#e74c3c] text-[7px] font-bold text-white flex items-center justify-center">应</span>}
        </div>
        <span className="text-[10px] text-[var(--muted)]">{expanded ? '▲' : '▼'}</span>
      </div>

      {/* 展开详情 */}
      {expanded && (
        <div className="px-3 pb-3 grid grid-cols-4 gap-2 text-[11px] animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-col items-center p-1.5 rounded-lg bg-[var(--bg2)]">
            <span className="text-[9px] text-[var(--muted)] mb-0.5">天干</span>
            <span className="font-mono font-semibold">{yao.stem}</span>
          </div>
          <div className="flex flex-col items-center p-1.5 rounded-lg bg-[var(--bg2)]">
            <span className="text-[9px] text-[var(--muted)] mb-0.5">地支</span>
            <span className="font-mono font-semibold">{yao.branch}</span>
          </div>
          <div className="flex flex-col items-center p-1.5 rounded-lg bg-[var(--bg2)]">
            <span className="text-[9px] text-[var(--muted)] mb-0.5">五行</span>
            <span className="font-semibold" style={{ color: WUXING_COLOR[yao.wuxing] }}>{yao.wuxing}</span>
          </div>
          <div className="flex flex-col items-center p-1.5 rounded-lg bg-[var(--bg2)]">
            <span className="text-[9px] text-[var(--muted)] mb-0.5">阴阳</span>
            <span>{yao.yang ? '⚊ 阳' : '⚋ 阴'}</span>
          </div>
        </div>
      )}
    </div>
  )
}
