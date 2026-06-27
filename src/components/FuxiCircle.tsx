'use client'

import { useState, useCallback } from 'react'
import { fuxiOrderedHexagrams, type FuxiHexagram, getYangRatio } from '@/data/fuxi'
import HexagramDetailModal from '@/components/HexagramDetailModal'

interface FuxiCircleProps {
  highlightKey?: string
}

/**
 * 伏羲六十四卦方圆图 - 圆图
 *
 * 64卦按伏羲序沿圆周排列，卦符头朝外、底朝里径向排列，
 * 鼠标悬停时弹出卦名标签，点击打开详请弹窗。
 *
 * 排列规则：
 * - 坤(0)在底部(6点方向)，乾(63)在顶部(12点方向)
 * - 左下：坤→复，阳升的半圈
 * - 右下：姤→乾，阴降的半圈
 */
export default function FuxiCircle({ highlightKey }: FuxiCircleProps) {
  const [modalKey, setModalKey] = useState<string | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const size = 660
  const cx = size / 2
  const cy = size / 2
  const radius = 260     // 卦符分布半径
  const centerRadius = 70 // 内圈标签半径
  const totalCount = 64

  const getPosition = useCallback((index: number) => {
    // 从底部(6点/180°)开始逆时针排列
    // 坤(0)在底部，乾(63)在顶部
    const angle = (Math.PI * (index / totalCount)) * 2 + Math.PI / 2
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    return { x, y, angle }
  }, [cx, cy, radius])

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="select-none"
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        {/* 外圈圆 */}
        <circle
          cx={cx} cy={cy} r={radius + 18}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
          opacity="0.2"
        />

        {/* 内圈虚线圆 */}
        <circle
          cx={cx} cy={cy} r={centerRadius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="0.5"
          opacity="0.15"
          strokeDasharray="4,4"
        />

        {/* 中心标签 */}
        <text
          x={cx} y={cy - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--muted)"
          fontSize="15"
          fontWeight="600"
          fontFamily="serif"
          opacity="0.7"
        >
          伏羲
        </text>
        <text
          x={cx} y={cy + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--muted)"
          fontSize="12"
          opacity="0.5"
          fontFamily="serif"
        >
          六十四卦
        </text>

        {/* 乾坤标签 */}
        <text
          x={cx} y={cy - radius - 24}
          textAnchor="middle"
          fill="var(--accent)"
          fontSize="16"
          fontWeight="700"
          fontFamily="serif"
        >
          乾 ☰
        </text>
        <text
          x={cx} y={cy + radius + 34}
          textAnchor="middle"
          fill="var(--muted)"
          fontSize="16"
          fontWeight="600"
          fontFamily="serif"
        >
          坤 ☷
        </text>

        {/* 方位标记 */}
        <text x={cx} y={cy - radius - 52} textAnchor="middle" fill="var(--muted)" fontSize="13" fontWeight="500" opacity="0.7" fontFamily="serif">南</text>
        <text x={cx} y={cy + radius + 62} textAnchor="middle" fill="var(--muted)" fontSize="13" fontWeight="500" opacity="0.7" fontFamily="serif">北</text>
        <text x={cx - radius - 22} y={cy + 4} textAnchor="middle" fill="var(--muted)" fontSize="13" fontWeight="500" opacity="0.7" fontFamily="serif">东</text>
        <text x={cx + radius + 22} y={cy + 4} textAnchor="middle" fill="var(--muted)" fontSize="13" fontWeight="500" opacity="0.7" fontFamily="serif">西</text>

        {/* 卦符 — 头朝外、底朝里径向排列 */}
        {fuxiOrderedHexagrams.map((hex) => {
          const pos = getPosition(hex.fuxiIndex)
          const isHovered = hoveredIndex === hex.fuxiIndex
          const isHighlighted = highlightKey === hex.key
          const ratio = getYangRatio(hex.yaoLines)

          // 按阴阳比例给卦符上色
          let textColor: string
          if (ratio === 0) textColor = '#4a5a7a'       // 纯阴
          else if (ratio === 1) textColor = '#d97706'   // 纯阳
          else if (ratio > 0.5) textColor = '#b8860b'   // 多阳
          else if (ratio < 0.33) textColor = '#6b7b9b'  // 多阴
          else textColor = 'var(--fg)'                   // 中

          // 计算旋转角度：卦符头朝外（径向对齐）
          // angle 是标准数学角（0=右, π/2=下）
          // SVG rotate 度：0°=上=12点，顺时针增加
          // 将文本的"上"方向对齐径向向外 = angle + 90°
          const svgDeg = (pos.angle * 180 / Math.PI) + 90

          return (
            <g
              key={`node-${hex.fuxiIndex}`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIndex(hex.fuxiIndex)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setModalKey(hex.key)}
            >
              {/* 高亮/悬停背景圈（不旋转） */}
              {(isHovered || isHighlighted) && (
                <circle
                  cx={pos.x} cy={pos.y}
                  r={13}
                  fill={isHighlighted ? 'var(--accent)' : 'var(--glow)'}
                  opacity={isHighlighted ? 0.2 : 0.35}
                />
              )}

              {/* 卦符（旋转，使头朝外） */}
              <g transform={`rotate(${svgDeg}, ${pos.x}, ${pos.y})`}>
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isHighlighted ? 'var(--accent)' : textColor}
                  fontSize="16"
                  fontFamily="serif"
                  opacity={isHovered ? 1 : 0.78}
                  style={{ transition: 'opacity 0.12s' }}
                >
                  {hex.symbol}
                </text>
              </g>

              {/* 悬停时显示卦名标签（不旋转，始终水平） */}
              {isHovered && (
                <g>
                  <rect
                    x={pos.x - 16}
                    y={pos.y + (pos.y >= cy ? 20 : -28)}
                    width={32}
                    height={18}
                    rx="4"
                    ry="4"
                    fill="var(--bg2)"
                    stroke="var(--border)"
                    strokeWidth="0.5"
                    opacity="0.95"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + (pos.y >= cy ? 28 : -19)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="var(--fg)"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="serif"
                  >
                    {hex.name}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>

      <HexagramDetailModal
        hexagramKey={modalKey}
        onClose={() => setModalKey(null)}
      />
    </div>
  )
}
