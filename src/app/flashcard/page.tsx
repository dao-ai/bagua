'use client'

import { useState, useMemo, useCallback } from 'react'
import usePageTitle from '@/hooks/usePageTitle'
import PageHeader from '@/components/PageHeader'
import CardFace from '@/components/CardFace'
import { RubyText } from '@/components/Ruby'
import { baguaList, getHexagramName, getHexagramSymbol } from '@/data/bagua'
import { hexagramOrder, getHexagramDetail } from '@/data/hexagrams'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

type CardMode = 'bagua' | 'hexagram'
type BrowseMode = 'sequential' | 'random'

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

  const cards = useMemo(() =>
    cardMode === 'bagua' ? buildBaguaCards() : buildHexagramCards(),
  [cardMode])

  const currentCard = useMemo(() => {
    if (cards.length === 0) return null
    if (browseMode === 'random') {
      return cards[randomIndex % cards.length]
    }
    return cards[currentIndex % cards.length]
  }, [cards, currentIndex, browseMode, randomIndex])

  const next = useCallback(() => {
    setFlipped(false)
    if (browseMode === 'random') {
      setRandomIndex(Math.floor(Math.random() * cards.length))
    } else {
      setCurrentIndex(i => i + 1)
    }
  }, [browseMode, cards.length])

  const switchMode = useCallback((m: string) => {
    setCardMode(m as CardMode)
    setCurrentIndex(0)
    setRandomIndex(0)
    setFlipped(false)
  }, [])

  const switchBrowse = useCallback((m: string) => {
    setBrowseMode(m as BrowseMode)
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
      <div className="text-center mb-4">
        <a
          href="/learn"
          className="inline-flex items-center gap-1.5 text-[12px] text-[var(--accent)] hover:underline transition-all"
        >
          🆕 升级到综合学习系统 — 间隔复习 + 闯关测验
        </a>
      </div>
      <PageHeader title="闪卡复习" subtitle="点击卡片翻转 · 看卦符猜卦名" />

      {/* 卡组切换 */}
      <div className="flex justify-center mb-4">
        <Tabs value={cardMode} onValueChange={switchMode}>
          <TabsList>
            <TabsTrigger value="bagua">八卦（8张）</TabsTrigger>
            <TabsTrigger value="hexagram">六十四卦（64张）</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 浏览方式 */}
      <div className="flex justify-center mb-6">
        <Tabs value={browseMode} onValueChange={switchBrowse}>
          <TabsList variant="line">
            <TabsTrigger value="sequential">顺序</TabsTrigger>
            <TabsTrigger value="random">随机</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 闪卡 */}
      <div className="max-w-[360px] mx-auto mb-6">
        <div className="text-center text-[11px] text-[var(--muted)] mb-3">
          {browseMode === 'sequential' ? `${currentIndex % total + 1} / ${total}` : '🎲 随机'}
        </div>

        <CardFace
          flipped={flipped}
          onFlip={() => setFlipped(f => !f)}
          front={
            currentCard.type === 'bagua' ? (
              <>
                <div className="text-[80px] mb-3">{currentCard.symbol}</div>
                <div className="text-[13px] font-mono text-[var(--muted)] tracking-wider">
                  {currentCard.binary}
                </div>
              </>
            ) : (
              <>
                <div className="text-[80px] mb-4">{currentCard.symbol}</div>
              </>
            )
          }
          back={
            currentCard.type === 'bagua' ? (
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
              </div>
            )
          }
        />
      </div>

      {/* 下一张按钮 */}
      <div className="text-center">
        <Button
          onClick={next}
          size="lg"
          className="font-semibold tracking-wider bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] border-none hover:from-[var(--accent2)] hover:to-[var(--accent)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)] transition-all"
        >
          {browseMode === 'random' ? '🎲 下一张随机' : '→ 下一张'}
        </Button>
      </div>
    </>
  )
}
