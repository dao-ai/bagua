'use client'

import { useState, useMemo, useCallback } from 'react'
import usePageTitle from '@/hooks/usePageTitle'
import PageHeader from '@/components/PageHeader'
import { RubyText } from '@/components/Ruby'
import { baguaList, getHexagramName, getHexagramSymbol } from '@/data/bagua'
import { hexagramOrder, getHexagramDetail } from '@/data/hexagrams'

type CardMode = 'bagua' | 'hexagram'
type BrowseMode = 'sequential' | 'random'

/** 生成八卦模式的闪卡 */
interface BaguaCard {
  type: 'bagua'
  symbol: string
  name: string
  pinyin: string
  binary: string
  attribute: string
  nature: string
  keywords: string[]
  short: string
}

/** 生成64卦模式的闪卡 */
interface HexagramCard {
  type: 'hexagram'
  symbol: string
  name: string
  detail: NonNullable<ReturnType<typeof getHexagramDetail>>
  upperName: string
  lowerName: string
}

type FlashCard = BaguaCard | HexagramCard

function buildBaguaCards(): BaguaCard[] {
  return baguaList.map(b => ({
    type: 'bagua' as const,
    symbol: b.symbol,
    name: b.name,
    pinyin: b.pinyin,
    binary: b.binary,
    attribute: b.attribute,
    nature: b.nature,
    keywords: b.keywords,
    short: b.short,
  }))
}

function buildHexagramCards(): HexagramCard[] {
  return hexagramOrder
    .map(([u, l]) => {
      const detail = getHexagramDetail(u, l)
      if (!detail) return null
      return {
        type: 'hexagram' as const,
        symbol: getHexagramSymbol(u, l),
        name: getHexagramName(u, l),
        detail,
        upperName: baguaList.find(b => b.id === u)?.name || '',
        lowerName: baguaList.find(b => b.id === l)?.name || '',
      }
    })
    .filter((c): c is HexagramCard => c !== null)
}

export default function FlashcardPage() {
  usePageTitle()

  const [cardMode, setCardMode] = useState<CardMode>('bagua')
  const [browseMode, setBrowseMode] = useState<BrowseMode>('sequential')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [randomIndex, setRandomIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  // 卡片数据
  const cards = useMemo(() =>
    cardMode === 'bagua' ? buildBaguaCards() : buildHexagramCards(),
  [cardMode])

  // 当前卡片 — 翻转不换卡
  const currentCard = useMemo(() => {
    if (cards.length === 0) return null
    if (browseMode === 'random') {
      return cards[randomIndex % cards.length]
    }
    return cards[currentIndex % cards.length]
  }, [cards, currentIndex, browseMode, randomIndex])

  // 下一张
  const next = useCallback(() => {
    setFlipped(false)
    if (browseMode === 'random') {
      setRandomIndex(Math.floor(Math.random() * cards.length))
    } else {
      setCurrentIndex(i => i + 1)
    }
  }, [browseMode, cards.length])

  // 切换卡组时重置
  const switchMode = useCallback((m: CardMode) => {
    setCardMode(m)
    setCurrentIndex(0)
    setRandomIndex(0)
    setFlipped(false)
  }, [])

  const switchBrowse = useCallback((m: BrowseMode) => {
    setBrowseMode(m)
    setCurrentIndex(0)
    setRandomIndex(0)
    setFlipped(false)
  }, [])

  if (!currentCard) {
    return <div className="text-center py-12 text-[var(--muted)]">暂无卡片数据</div>
  }

  const total = cards.length

  return (
    <>
      <PageHeader title="闪卡复习" subtitle="点击卡片翻转 · 看卦符猜卦名" />

      {/* 模式切换 */}
      <div className="flex justify-center gap-2 mb-4">
        <div className="flex gap-1.5 p-1 rounded-xl bg-[var(--bg2)] border border-[var(--border)]">
          <button
            onClick={() => switchMode('bagua')}
            className={`px-4 py-1.5 text-xs rounded-lg cursor-pointer transition-colors ${
              cardMode === 'bagua'
                ? 'bg-[var(--accent)] text-[var(--bg)] font-semibold'
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >八卦（8张）</button>
          <button
            onClick={() => switchMode('hexagram')}
            className={`px-4 py-1.5 text-xs rounded-lg cursor-pointer transition-colors ${
              cardMode === 'hexagram'
                ? 'bg-[var(--accent)] text-[var(--bg)] font-semibold'
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >六十四卦（64张）</button>
        </div>
      </div>

      {/* 浏览方式 */}
      <div className="flex justify-center gap-2 mb-6">
        <div className="flex gap-1.5 p-1 rounded-xl bg-[var(--bg2)] border border-[var(--border)]">
          <button
            onClick={() => switchBrowse('sequential')}
            className={`px-3 py-1 text-[11px] rounded-lg cursor-pointer transition-colors ${
              browseMode === 'sequential'
                ? 'bg-[var(--bg3)] text-[var(--fg)] font-semibold'
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >📋 顺序</button>
          <button
            onClick={() => switchBrowse('random')}
            className={`px-3 py-1 text-[11px] rounded-lg cursor-pointer transition-colors ${
              browseMode === 'random'
                ? 'bg-[var(--bg3)] text-[var(--fg)] font-semibold'
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >🎲 随机</button>
        </div>
      </div>

      {/* 闪卡 */}
      <div className="max-w-[360px] mx-auto mb-6">
        {/* 进度 */}
        <div className="text-center text-[11px] text-[var(--muted)] mb-3">
          {browseMode === 'sequential' ? `${currentIndex % total + 1} / ${total}` : '🎲 随机'}
        </div>

        {/* 卡片容器 — 点击切换翻转 */}
        <div
          className="perspective-[1000px] cursor-pointer"
          onClick={() => setFlipped(f => !f)}
        >
          <div
            className={`relative w-full aspect-[3/4] transition-transform duration-500 preserve-3d ${
              flipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* 正面 */}
            <div className="absolute inset-0 backface-hidden bg-[var(--card)] border border-[var(--border)] rounded-2xl flex flex-col items-center justify-center p-8">
              {currentCard.type === 'bagua' ? (
                <>
                  <div className="text-[80px] mb-3">{currentCard.symbol}</div>
                  <div className="text-[13px] font-mono text-[var(--muted)] tracking-wider">
                    {currentCard.binary}
                  </div>
                  <div className="mt-4 text-[11px] text-[var(--muted)]">点击翻转</div>
                </>
              ) : (
                <>
                  <div className="text-[80px] mb-4">{currentCard.symbol}</div>
                  <div className="text-[11px] text-[var(--muted)]">点击翻转</div>
                </>
              )}
            </div>

            {/* 背面 */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex flex-col items-center justify-center p-6 overflow-y-auto">
              {currentCard.type === 'bagua' ? (
                <div className="text-center w-full">
                  <div className="text-[36px] mb-2">{currentCard.symbol}</div>
                  <div className="text-[22px] font-bold mb-0.5">
                    <RubyText text={currentCard.name} />
                  </div>
                  <div className="text-[12px] text-[var(--accent)] mb-1">{currentCard.pinyin}</div>
                  <div className="text-[11px] text-[var(--muted)] mb-3">
                    {currentCard.attribute} · {currentCard.nature}
                  </div>
                  <div className="flex justify-center gap-1.5 flex-wrap mb-3">
                    {currentCard.keywords.map(k => (
                      <span key={k} className="px-2 py-0.5 rounded-md bg-[var(--bg3)] text-[11px] text-[var(--accent2)]">
                        {k}
                      </span>
                    ))}
                  </div>
                  <div className="text-[12px] leading-relaxed text-[var(--fg)] px-2">
                    {currentCard.short}
                  </div>
                  <div className="mt-4 text-[10px] text-[var(--muted)]">点击翻回</div>
                </div>
              ) : (
                <div className="text-center w-full">
                  <div className="text-[48px] mb-2">{currentCard.symbol}</div>
                  <div className="text-[22px] font-bold mb-1">
                    <RubyText text={currentCard.name} />
                  </div>
                  <div className="text-[11px] text-[var(--muted)] mb-3">
                    {currentCard.upperName} · {currentCard.lowerName}
                  </div>
                  <div className="space-y-2 text-left px-2">
                    <div>
                      <div className="text-[10px] text-[var(--accent)] font-semibold tracking-wider mb-0.5">卦辞</div>
                      <div className="text-[13px] font-semibold text-[var(--accent2)]">
                        <RubyText text={currentCard.detail.judgment} />
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[var(--accent)] font-semibold tracking-wider mb-0.5">象曰</div>
                      <div className="text-[11px] italic text-[var(--muted)]">
                        <RubyText text={currentCard.detail.image} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-[var(--muted)]">点击翻回</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 下一张按钮 */}
      <div className="text-center">
        <button
          onClick={next}
          className="px-8 py-3 text-sm font-semibold tracking-wider bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)] active:translate-y-0"
        >
          {browseMode === 'random' ? '🎲 下一张随机' : '→ 下一张'}
        </button>
      </div>
    </>
  )
}
