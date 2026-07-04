'use client'

import { useState, useMemo, useEffect } from 'react'
import { baguaMap } from '@/data/bagua'
import { hexagramDetail } from '@/data/hexagrams'
import { fuxiOrderedHexagrams } from '@/data/fuxi'
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from '@/components/ui/command'

interface SearchItem {
  key: string
  name: string
  symbol: string
  judgment: string
  image: string
  meaning: string
  upperName: string
  lowerName: string
}

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

function highlight(text: string, keyword: string) {
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

export default function SearchOverlay({ open, onClose, onOpenDetail }: Props) {
  const [query, setQuery] = useState('')

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

  useEffect(() => {
    if (open) setQuery('')
  }, [open])

  return (
    <CommandDialog
      open={open}
      onOpenChange={(isOpen) => { if (!isOpen) onClose() }}
      title="搜索卦象"
      description="搜索卦名、卦辞、解读…"
      className="max-w-[560px]"
    >
      <Command shouldFilter={false} className="rounded-none!">
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="搜索卦名、卦辞、解读…"
        />
        <CommandList>
          {!query.trim() && (
            <CommandEmpty>输入卦名、卦辞或现代解读的关键词搜索</CommandEmpty>
          )}
          {query.trim() && results.length === 0 && (
            <CommandEmpty>没有找到与「{query}」相关的卦象</CommandEmpty>
          )}
          {results.length > 0 && (
            <CommandGroup heading="卦象">
              {results.map(item => (
                <CommandItem
                  key={item.key}
                  onSelect={() => onOpenDetail(item.key)}
                  className="flex items-start gap-3 py-3 cursor-pointer"
                >
                  <span className="text-[28px] leading-none shrink-0 pt-0.5">{item.symbol}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-[15px] font-serif">
                        {highlight(item.name, query)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {item.upperName}·{item.lowerName}
                      </span>
                    </div>
                    {item.judgment && (
                      <div className="text-[12px] text-[var(--accent2)] mt-0.5 truncate">
                        {highlight(item.judgment, query)}
                      </div>
                    )}
                    {item.meaning && (
                      <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                        {highlight(item.meaning, query)}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
        <div className="flex items-center justify-between px-3 py-2 border-t border-border">
          <span className="text-[10px] text-muted-foreground">
            ↑↓ 导航 · Enter 查看 · Esc 关闭
          </span>
          <CommandShortcut>Ctrl+K</CommandShortcut>
        </div>
      </Command>
    </CommandDialog>
  )
}
