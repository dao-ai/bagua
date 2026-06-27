'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { baguaMap, getHexagramName, getHexagramSymbol } from '@/data/bagua'
import { hexagramDetail } from '@/data/hexagrams'
import { fuxiOrderedHexagrams } from '@/data/fuxi'

interface SearchItem {
  key: string        // "upperId-lowerId"
  name: string       // 卦名
  symbol: string     // 卦符
  judgment: string   // 卦辞
  image: string      // 象辞
  meaning: string    // 现代解读
  upperName: string  // 上卦名
  lowerName: string  // 下卦名
}

/**
 * 构建搜索索引（所有64卦 + 其文字内容）
 */
function buildSearchIndex(): SearchItem[] {
  return fuxiOrderedHexagrams.map(hex => {
    const detailKey = `${hex.upperId}-${hex.lowerId}`
    const detail = hexagramDetail[detailKey]
    const ud = baguaMap[hex.upperId]
    const ld = baguaMap[hex.lowerId]
    return {
      key: hex.key,
      name: hex.name,
      symbol: hex.symbol,
      judgment: detail?.judgment || '',
      image: detail?.image || '',
      meaning: detail?.meaning || '',
      upperName: ud?.name || '',
      lowerName: ld?.name || '',
    }
  })
}

const searchIndex = buildSearchIndex()

interface Props {
  open: boolean
  onClose: () => void
  onOpenDetail: (key: string) => void
}

export default function SearchOverlay({ open, onClose, onOpenDetail }: Props) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // 过滤结果
  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.trim().toLowerCase()
    return searchIndex.filter(item => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.judgment.toLowerCase().includes(q) ||
        item.image.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.upperName.toLowerCase().includes(q) ||
        item.lowerName.toLowerCase().includes(q)
      )
    })
  }, [query])

  // 高亮匹配关键词
  const highlight = (text: string, keyword: string) => {
    if (!keyword.trim()) return text
    const idx = text.toLowerCase().indexOf(keyword.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-[var(--accent)] font-medium">{text.slice(idx, idx + keyword.length)}</span>
        {text.slice(idx + keyword.length)}
      </>
    )
  }

  // 选中结果、打开详情弹窗
  const openDetail = (key: string) => {
    onOpenDetail(key)
  }

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      openDetail(results[selectedIndex].key)
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  // 打开时自动聚焦 + 重置
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // 选中索引随结果变化重置
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!open) return null

  return (
    <>
      {/* 半透明遮罩 */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 搜索弹窗 */}
      <div
        className="fixed inset-x-4 top-[15vh] z-[70] mx-auto max-w-[560px] animate-[slideUp_0.2s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-[0_16px_48px_var(--shadow)]">
          {/* 搜索输入 */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
            <span className="text-[var(--muted)] text-lg shrink-0">🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="搜索卦名、卦辞、解读…"
              className="flex-1 bg-transparent border-none outline-none text-base text-[var(--fg)] placeholder-[var(--muted)]"
              autoComplete="off"
            />
            <button
              onClick={onClose}
              className="text-[var(--muted)] text-xl hover:text-[var(--fg)] bg-transparent border-none cursor-pointer shrink-0"
            >
              &times;
            </button>
          </div>

          {/* 结果列表 */}
          <div className="max-h-[60vh] overflow-y-auto thin-scroll">
            {query.trim() && results.length === 0 && (
              <div className="p-8 text-center text-sm text-[var(--muted)]">
                没有找到与「{query}」相关的卦象
              </div>
            )}

            {!query.trim() && (
              <div className="p-8 text-center text-sm text-[var(--muted)]">
                输入卦名、卦辞或现代解读的关键词搜索
              </div>
            )}

            {results.map((item, i) => (
              <div
                key={item.key}
                className={`flex items-start gap-4 px-5 py-3.5 cursor-pointer transition-colors ${
                  i === selectedIndex ? 'bg-[var(--glow)]' : 'hover:bg-[var(--bg3)]'
                } ${i !== results.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
                onClick={() => openDetail(item.key)}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                {/* 卦符 */}
                <div className="text-[28px] leading-none shrink-0 pt-0.5">{item.symbol}</div>

                {/* 文字 */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-[15px] text-[var(--fg)] font-serif">
                      {highlight(item.name, query)}
                    </span>
                    <span className="text-[11px] text-[var(--muted)]">
                      {item.upperName}·{item.lowerName}
                    </span>
                  </div>

                  {item.judgment && (
                    <div className="text-[12px] text-[var(--accent2)] mt-0.5 truncate">
                      {highlight(item.judgment, query)}
                    </div>
                  )}

                  {item.meaning && (
                    <div className="text-[11px] text-[var(--muted)] mt-0.5 line-clamp-2 leading-relaxed">
                      {highlight(item.meaning, query)}
                    </div>
                  )}
                </div>

                {/* 选中态指示 */}
                {i === selectedIndex && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>

          {/* 快捷键提示 */}
          <div className="flex items-center justify-between px-5 py-2.5 border-t border-[var(--border)] bg-[var(--bg3)]">
            <span className="text-[10px] text-[var(--muted)]">
              ↑↓ 导航 · Enter 查看 · Esc 关闭
            </span>
            <span className="text-[10px] text-[var(--muted)] font-mono">Ctrl+K</span>
          </div>
        </div>
      </div>

    </>
  )
}
