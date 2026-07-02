'use client'

import { useState, useCallback } from 'react'
import {
  fuxiSquareGrid,
  fuxiSquareRowLabels,
  fuxiSquareColLabels,
  getYangRatio,
  type FuxiSquareCell,
} from '@/data/fuxi'
import HexagramDetailModal from '@/components/HexagramDetailModal'

interface FuxiSquareProps {
  highlightKey?: string
}

/**
 * 伏羲六十四卦方圆图 - 方图
 *
 * 8×8 网格表格：
 * - 行标题（左侧）：下卦符号+卦名（先天八卦序：坤艮坎巽震离兑乾，从下到上）
 * - 列标题（顶部）：上卦符号+卦名（先天八卦序：乾兑离震巽坎艮坤，从左到右）
 * - 每个单元格：卦名（大字）+ 卦符（小字）
 */
export default function FuxiSquare({ highlightKey }: FuxiSquareProps) {
  const [modalKey, setModalKey] = useState<string | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)

  const getCellColor = useCallback((cell: FuxiSquareCell) => {
    const ratio = getYangRatio(cell.yaoLines)
    if (ratio === 0) return 'rgba(74,90,122,0.15)'     // 纯阴
    if (ratio === 1) return 'rgba(217,119,6,0.15)'     // 纯阳
    if (ratio > 0.5) return 'rgba(184,134,11,0.12)'     // 多阳
    if (ratio < 0.33) return 'rgba(107,123,155,0.12)'   // 多阴
    return 'rgba(150,130,90,0.08)'                       // 中
  }, [])

  const getCellTextColor = useCallback((cell: FuxiSquareCell) => {
    const ratio = getYangRatio(cell.yaoLines)
    if (ratio === 0) return 'var(--yin)'
    if (ratio === 1) return 'var(--yang)'
    if (ratio > 0.5) return '#b8860b'
    if (ratio < 0.33) return '#6b7b9b'
    return 'var(--fg)'
  }, [])

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-center mx-auto" style={{ fontSize: '13px' }}>
        <thead>
          <tr>
            {/* 左上角空白 */}
            <th
              className="p-2 text-[11px] text-[var(--muted)] border border-[var(--border)]"
              style={{ minWidth: '38px', width: '38px' }}
            >
              下\上
            </th>
            {/* 列标题：上卦（乾兑离震巽坎艮坤，从左到右） */}
            {fuxiSquareColLabels.map((col, ci) => (
              <th
                key={`col-${col.id}`}
                className={`p-1.5 border border-[var(--border)] transition-colors ${
                  hoveredCol === ci ? 'bg-[var(--glow)]' : ''
                }`}
                onMouseEnter={() => setHoveredCol(ci)}
                onMouseLeave={() => setHoveredCol(null)}
                style={{ minWidth: '64px' }}
              >
                <div className="text-[18px] leading-none">{col.symbol}</div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5 font-serif">{col.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fuxiSquareGrid.map((row, ri) => {
            // 行从下到上显示，所以从数组末尾开始遍历
            // fuxiSquareGrid[0] = 坤(行), fuxiSquareGrid[7] = 乾(行)
            // 显示时行从上到下 = 乾→坤
            const displayRowIndex = 7 - ri
            const rowLabel = fuxiSquareRowLabels[displayRowIndex]

            return (
              <tr key={`row-${displayRowIndex}`}>
                {/* 行标题 */}
                <td
                  className={`p-1.5 border border-[var(--border)] transition-colors ${
                    hoveredRow === displayRowIndex ? 'bg-[var(--glow)]' : ''
                  }`}
                  onMouseEnter={() => setHoveredRow(displayRowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <div className="text-[18px] leading-none">{rowLabel.symbol}</div>
                  <div className="text-[11px] text-[var(--muted)] mt-0.5 font-serif">{rowLabel.name}</div>
                </td>

                {/* 单元格 */}
                {row.map((cell, ci) => {
                  const colDisplayIndex = ci // fuxiSquareColLabels[ci] 对应
                  const isHighlighted = highlightKey === cell.key
                  const isRowHovered = hoveredRow === displayRowIndex
                  const isColHovered = hoveredCol === colDisplayIndex

                  return (
                    <td
                      key={`cell-${displayRowIndex}-${colDisplayIndex}`}
                      className="p-1 border border-[var(--border)] cursor-pointer transition-all duration-150"
                      style={{
                        backgroundColor: isHighlighted
                          ? 'var(--accent)'
                          : isRowHovered || isColHovered
                          ? 'var(--glow)'
                          : getCellColor(cell),
                        color: isHighlighted ? 'var(--bg)' : getCellTextColor(cell),
                        opacity: isRowHovered || isColHovered || hoveredRow === null ? 1 : 0.85,
                        minWidth: '64px',
                        height: '62px',
                      }}
                      onMouseEnter={() => {
                        setHoveredRow(displayRowIndex)
                        setHoveredCol(colDisplayIndex)
                      }}
                      onMouseLeave={() => {
                        setHoveredRow(null)
                        setHoveredCol(null)
                      }}
                      onClick={() => setModalKey(cell.key)}
                      title={`${cell.name} (${cell.symbol})`}
                    >
                      <div
                        className="font-serif font-medium leading-tight"
                        style={{
                          fontSize: isHighlighted ? '17px' : '15px',
                        }}
                      >
                        {cell.name}
                      </div>
                      <div
                        className="leading-none mt-0.5"
                        style={{
                          fontSize: isHighlighted ? '16px' : '13px',
                          opacity: isHighlighted ? 0.9 : 0.6,
                        }}
                      >
                        {cell.symbol}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      <HexagramDetailModal
        hexagramKey={modalKey}
        onClose={() => setModalKey(null)}
      />
    </div>
  )
}
