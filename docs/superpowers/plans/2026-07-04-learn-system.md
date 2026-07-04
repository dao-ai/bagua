# Learn System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive learning system at `/learn` with free browsing, SM-2 spaced repetition review, and quiz/testing modes covering 八卦, 六十四卦, 爻辞, and 卦关系.

**Architecture:** Single-page app at `/learn` with tab-based mode switching. Core logic lives in a `useLearning` hook backed by localStorage, using SM-2 algorithm for spaced repetition. Card data is generated from existing `src/data/` static definitions. The existing `/flashcard` card-flip component is extracted into a shared `CardFace` component.

**Tech Stack:** Next.js 16 (static export), React 19, Tailwind CSS v4, TypeScript, localStorage

## Global Constraints

- All pages are `'use client'` — no Server Components in this project
- No external dependencies beyond existing ones (no new npm packages)
- Static export only — no server-side routes
- localStorage persistence, same pattern as `useDivineHistory`
- Follow existing visual patterns: CSS custom properties (`--bg`, `--fg`, `--accent`, `--border`, etc.), rounded-2xl cards, the existing gradient button style
- Chinese-first UI with ruby/pinyin support via `<RubyText>`

---

### Task 1: Foundation modules — types, SM-2 algorithm, storage

**Files:**
- Create: `src/app/learn/types.ts`
- Create: `src/app/learn/srs.ts`
- Create: `src/app/learn/storage.ts`

**Produces:**
- `Card`, `CardType`, `LearnStats`, `LearnState` types
- `sm2(card: Card, quality: number): Card` pure function
- `loadState(): LearnState`, `saveState(state: LearnState): void`, `exportState(state: LearnState): string`, `importState(json: string): { state: LearnState; warnings: string[] }`, `getTodayStr(): string`

- [ ] **Step 1: Write `types.ts`**

```ts
// src/app/learn/types.ts

export type CardType = 'trigram' | 'hexagram' | 'yao' | 'relation'

export interface Card {
  id: string           // "trigram:qian" | "hex:qian-qian" | "yao:qian-qian-0" | "rel:qian-qian-opposite"
  type: CardType
  front: string        // question side — symbol/position description
  back: string         // answer side — name/text/meaning
  ease: number         // SM-2 ease factor, default 2.5, min 1.3
  interval: number     // days until next review
  repetitions: number  // consecutive correct reviews
  nextReview: string   // ISO date string "YYYY-MM-DD"
  lastReview: string | null
  learned: boolean     // user has seen this at least once
  createdAt: string    // ISO date string
}

export interface LearnStats {
  totalCards: number
  learnedCards: number
  masteredCards: number    // interval >= 21 days
  todayReviewed: number
  todayDue: number
  streak: number           // consecutive days with at least one review
  lastStudyDate: string | null
  totalReviews: number
}

export interface LearnState {
  version: number
  cards: Card[]
  stats: LearnStats
}
```

- [ ] **Step 2: Write `srs.ts`**

```ts
// src/app/learn/srs.ts
import type { Card } from './types'
import { getTodayStr } from './storage'

/**
 * SM-2 spaced repetition algorithm.
 * quality: 0-5 rating of recall quality.
 * Returns a new Card object with updated SRS fields.
 */
export function sm2(card: Card, quality: number): Card {
  const today = getTodayStr()
  const next = { ...card, lastReview: today }

  if (quality < 2) {
    // Failed — reset
    next.interval = 1
    next.repetitions = 0
  } else if (quality < 4) {
    // Recalled with difficulty
    next.repetitions += 1
    next.interval = 1 + next.repetitions * 2
  } else {
    // Recalled easily
    next.repetitions += 1
    if (next.repetitions === 1) {
      next.interval = 1
    } else if (next.repetitions === 2) {
      next.interval = 6
    } else {
      next.interval = Math.round(card.interval * card.ease)
    }
  }

  // Update ease factor
  next.ease = card.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  next.ease = Math.max(1.3, +(next.ease.toFixed(2)))

  // Set next review date
  const d = new Date(today)
  d.setDate(d.getDate() + next.interval)
  next.nextReview = d.toISOString().slice(0, 10)

  return next
}

/** Create a fresh card with default SRS values */
export function createCard(
  id: string,
  type: Card['type'],
  front: string,
  back: string,
): Card {
  return {
    id,
    type,
    front,
    back,
    ease: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: getTodayStr(), // due immediately
    lastReview: null,
    learned: false,
    createdAt: getTodayStr(),
  }
}
```

- [ ] **Step 3: Write `storage.ts`**

```ts
// src/app/learn/storage.ts
import type { Card, LearnState, LearnStats } from './types'

const STORAGE_KEY = 'bagua-learning'
const CURRENT_VERSION = 1

export function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Load state from localStorage, return null if missing or corrupt */
export function loadState(): LearnState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && parsed.version === CURRENT_VERSION && Array.isArray(parsed.cards)) {
      return parsed as LearnState
    }
    return null
  } catch {
    return null
  }
}

/** Save state to localStorage */
export function saveState(state: LearnState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

/** Export state as JSON string for download */
export function exportState(state: LearnState): string {
  const exportData = {
    ...state,
    exportedAt: new Date().toISOString(),
  }
  return JSON.stringify(exportData, null, 2)
}

/** Import state from JSON string, merging with optional existing */
export function importState(
  json: string,
  existing: LearnState | null,
): { state: LearnState; warnings: string[] } {
  const warnings: string[] = []

  let parsed: any
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('JSON 格式无效')
  }

  if (!parsed || parsed.version !== CURRENT_VERSION || !Array.isArray(parsed.cards)) {
    throw new Error('数据格式不兼容，请检查文件版本')
  }

  const importedCards = parsed.cards as Card[]
  const existingMap = new Map((existing?.cards ?? []).map(c => [c.id, c]))

  const merged: Card[] = importedCards.map(ic => {
    const ec = existingMap.get(ic.id)
    if (!ec) return ic
    // Merge: take the more advanced state
    return {
      ...ic,
      ease: Math.max(ic.ease, ec.ease),
      interval: Math.max(ic.interval, ec.interval),
      repetitions: Math.max(ic.repetitions, ec.repetitions),
      nextReview: ic.nextReview < ec.nextReview ? ic.nextReview : ec.nextReview,
      lastReview: [ic.lastReview, ec.lastReview].filter(Boolean).sort().pop() ?? null,
      learned: ic.learned || ec.learned,
    }
  })

  // Add any cards that exist locally but not in import
  for (const ec of existing?.cards ?? []) {
    if (!importedCards.find(ic => ic.id === ec.id)) {
      merged.push(ec)
      warnings.push(`本地卡片 "${ec.id}" 在导入文件中不存在，已保留`)
    }
  }

  const stats = computeStats(merged, existing?.stats ?? null)

  return { state: { version: CURRENT_VERSION, cards: merged, stats }, warnings }
}

/** Compute fresh stats from card array */
export function computeStats(cards: Card[], prevStats: LearnStats | null): LearnStats {
  const today = getTodayStr()
  const learnedCards = cards.filter(c => c.learned).length
  const masteredCards = cards.filter(c => c.interval >= 21).length
  const todayDue = cards.filter(c => c.nextReview <= today).length

  // Streak calculation
  let streak = prevStats?.streak ?? 0
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  if (prevStats?.lastStudyDate === yesterdayStr) {
    streak += 1
  } else if (prevStats?.lastStudyDate !== today) {
    streak = 1
  }

  return {
    totalCards: cards.length,
    learnedCards,
    masteredCards,
    todayReviewed: 0, // reset each day
    todayDue,
    streak,
    lastStudyDate: prevStats?.lastStudyDate ?? null,
    totalReviews: prevStats?.totalReviews ?? 0,
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/learn/types.ts src/app/learn/srs.ts src/app/learn/storage.ts
git commit -m "feat(learn): add foundation — types, SM-2 algorithm, storage"
```

---

### Task 2: Card deck generation from existing data

**Files:**
- Create: `src/app/learn/data/decks.ts`

**Consumes:**
- `Card`, `CardType`, `createCard` from Task 1
- `baguaList`, `Bagua` from `@/data/bagua`
- `hexagramOrder`, `hexagramDetail` from `@/data/hexagrams`
- `yao_lines.ts` yao lines data
- `getInterlocking`, `getOpposite`, `getInverted` from `@/data/hexagramRelations`

**Produces:**
- `buildAllCards(): Card[]`

- [ ] **Step 1: Write `decks.ts`**

```ts
// src/app/learn/data/decks.ts
import { createCard } from '../srs'
import type { Card } from '../types'
import { baguaList, getHexagramName, getHexagramSymbol, baguaMap } from '@/data/bagua'
import { hexagramOrder, getHexagramDetail } from '@/data/hexagrams'
import { getYaoLines } from '@/data/yao_lines'
import { getInterlocking, getOpposite, getInverted } from '@/data/hexagramRelations'

export function buildAllCards(): Card[] {
  return [
    ...buildTrigramCards(),
    ...buildHexagramCards(),
    ...buildYaoCards(),
    ...buildRelationCards(),
  ]
}

function buildTrigramCards(): Card[] {
  return baguaList.map(b => {
    const front = `${b.symbol} (${b.binary})`
    const back = [
      `卦名: ${b.name} (${b.pinyin})`,
      `属性: ${b.attribute}`,
      `自然: ${b.nature}`,
      `方位: ${b.direction}`,
      `五行: ${b.keywords[0]}`,
    ].join('\n')
    return createCard(`trigram:${b.id}`, 'trigram', front, back)
  })
}

function buildHexagramCards(): Card[] {
  return hexagramOrder.map(([upperId, lowerId]) => {
    const name = getHexagramName(upperId, lowerId)
    const symbol = getHexagramSymbol(upperId, lowerId)
    const detail = getHexagramDetail(upperId, lowerId)
    const upper = baguaMap[upperId]
    const lower = baguaMap[lowerId]

    const front = symbol
    const back = detail
      ? [
          `卦名: ${name}`,
          `上卦: ${upper.name} · 下卦: ${lower.name}`,
          `卦辞: ${detail.judgment}`,
          `象曰: ${detail.image}`,
        ].join('\n')
      : `卦名: ${name}\n上卦: ${upper.name} · 下卦: ${lower.name}`

    return createCard(`hex:${upperId}-${lowerId}`, 'hexagram', front, back)
  })
}

function buildYaoCards(): Card[] {
  const cards: Card[] = []
  for (const [upperId, lowerId] of hexagramOrder) {
    const lines = getYaoLines(`${upperId}-${lowerId}`)
    if (!lines) continue
    const hexName = getHexagramName(upperId, lowerId)
    lines.forEach((line, i) => {
      const front = `${hexName} · ${line.pos}`
      const back = `${line.text}\n\n${line.meaning}`
      cards.push(createCard(`yao:${upperId}-${lowerId}-${i}`, 'yao', front, back))
    })
  }
  return cards
}

function buildRelationCards(): Card[] {
  const cards: Card[] = []
  const relations = [
    { key: 'interlocking' as const, fn: getInterlocking, label: '互卦' },
    { key: 'opposite' as const, fn: getOpposite, label: '错卦' },
    { key: 'inverted' as const, fn: getInverted, label: '综卦' },
  ]

  for (const [upperId, lowerId] of hexagramOrder) {
    const sourceName = getHexagramName(upperId, lowerId)
    for (const { key, fn, label } of relations) {
      const result = fn(upperId, lowerId)
      if (!result) continue
      const front = `${sourceName} 的${label}是？`
      const back = `${label}: ${result.name}\n${result.symbol}`
      cards.push(createCard(`rel:${upperId}-${lowerId}-${key}`, 'relation', front, back))
    }
  }
  return cards
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/learn/data/decks.ts
git commit -m "feat(learn): add card deck generation from existing data"
```

---

### Task 3: useLearning hook

**Files:**
- Create: `src/app/learn/hooks/useLearning.ts`

**Consumes:**
- `Card`, `LearnState`, `LearnStats` from types.ts
- `sm2`, `createCard` from srs.ts
- `loadState`, `saveState`, `exportState`, `importState`, `getTodayStr`, `computeStats` from storage.ts
- `buildAllCards` from decks.ts

**Produces:**
- `useLearning(): { cards, stats, reviewDue, reviewCard(card, quality), markLearned(cardId), getCardsByType(type), isQuizUnlocked(levelKey), exportData(), importData(json), todayStr }`

- [ ] **Step 1: Write `useLearning.ts`**

```ts
// src/app/learn/hooks/useLearning.ts
'use client'

import { useState, useCallback, useMemo } from 'react'
import type { Card, LearnState, LearnStats, CardType } from '../types'
import { sm2 } from '../srs'
import { loadState, saveState, exportState, importState, getTodayStr, computeStats } from '../storage'
import { buildAllCards } from '../data/decks'

export function useLearning() {
  const [state, setState] = useState<LearnState>(() => {
    const saved = loadState()
    if (saved) return saved
    // First-time initialization
    const cards = buildAllCards()
    const stats = computeStats(cards, null)
    return { version: 1, cards, stats }
  })

  const persist = useCallback((s: LearnState) => {
    saveState(s)
    setState(s)
  }, [])

  /** Rate a card after review (quality 0-5) and update SRS */
  const reviewCard = useCallback((cardId: string, quality: number) => {
    setState(prev => {
      const cards = prev.cards.map(c => {
        if (c.id !== cardId) return c
        const updated = sm2({ ...c, learned: true }, quality)
        return updated
      })
      const today = getTodayStr()
      const stats = {
        ...computeStats(cards, prev.stats),
        todayReviewed: prev.stats.todayReviewed + 1,
        lastStudyDate: today,
        totalReviews: prev.stats.totalReviews + 1,
      }
      const next = { ...prev, cards, stats }
      saveState(next)
      return next
    })
  }, [])

  /** Mark a card as seen/learned without SRS rating (browse mode) */
  const markLearned = useCallback((cardId: string) => {
    setState(prev => {
      const cards = prev.cards.map(c =>
        c.id === cardId ? { ...c, learned: true } : c
      )
      const stats = computeStats(cards, prev.stats)
      const next = { ...prev, cards, stats }
      saveState(next)
      return next
    })
  }, [])

  /** Cards due for review today, sorted by most overdue first */
  const reviewDue = useMemo(() => {
    const today = getTodayStr()
    return state.cards
      .filter(c => c.nextReview <= today)
      .sort((a, b) => a.nextReview.localeCompare(b.nextReview))
  }, [state.cards])

  /** Filter cards by type */
  const getCardsByType = useCallback((type: CardType) => {
    return state.cards.filter(c => c.type === type)
  }, [state.cards])

  /** Reset a card to "new" state (mark as needing review) */
  const markForReview = useCallback((cardId: string) => {
    setState(prev => {
      const cards = prev.cards.map(c =>
        c.id === cardId
          ? { ...c, nextReview: getTodayStr(), interval: 0, repetitions: 0 }
          : c
      )
      const stats = computeStats(cards, prev.stats)
      const next = { ...prev, cards, stats }
      saveState(next)
      return next
    })
  }, [])

  /** Export all data as JSON string */
  const exportData = useCallback(() => exportState(state), [state])

  /** Import JSON data, merging with current state */
  const importData = useCallback((json: string) => {
    const result = importState(json, state)
    persist(result.state)
    return result.warnings
  }, [state, persist])

  const todayStr = useMemo(() => getTodayStr(), [])

  return {
    cards: state.cards,
    stats: state.stats,
    reviewDue,
    reviewCard,
    markLearned,
    markForReview,
    getCardsByType,
    exportData,
    importData,
    todayStr,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/learn/hooks/useLearning.ts
git commit -m "feat(learn): add useLearning hook with SRS, stats, import/export"
```

---

### Task 4: Extract shared CardFace component

**Files:**
- Create: `src/components/CardFace.tsx`
- Modify: `src/app/flashcard/page.tsx` — use shared CardFace

**Produces:**
- `CardFace` component with `front`, `back`, `flipped`, `onFlip`, `status` props
- Updated flashcard page using shared component

- [ ] **Step 1: Write `CardFace.tsx`**

```tsx
// src/components/CardFace.tsx
'use client'

import type { ReactNode } from 'react'

export interface CardFaceProps {
  front: ReactNode
  back: ReactNode
  flipped: boolean
  onFlip: () => void
  status?: 'new' | 'due' | 'learned' | 'mastered'
}

const statusLabels: Record<string, string> = {
  new: '新卡片',
  due: '待复习',
  learned: '已学',
  mastered: '已掌握',
}

export default function CardFace({ front, back, flipped, onFlip, status }: CardFaceProps) {
  return (
    <div className="perspective-[1000px] cursor-pointer" onClick={onFlip}>
      <div
        className={`relative w-full aspect-[3/4] transition-transform duration-500 preserve-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-[var(--card)] border border-[var(--border)] rounded-2xl flex flex-col items-center justify-center p-8">
          {front}
          {status && (
            <div className={`mt-4 text-[11px] px-2 py-0.5 rounded-md ${
              status === 'due' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' :
              status === 'mastered' ? 'bg-green-500/10 text-green-400' :
              'text-[var(--muted)]'
            }`}>
              {statusLabels[status]}
            </div>
          )}
          <div className="mt-3 text-[11px] text-[var(--muted)]">点击翻转</div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex flex-col items-center justify-center p-6 overflow-y-auto">
          {back}
          <div className="mt-3 text-[10px] text-[var(--muted)]">点击翻回</div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update flashcard page to use shared CardFace**

Replace the card rendering section in `src/app/flashcard/page.tsx` (lines 179-258) — the `<div className="perspective-[1000px]...">` block — with:

```tsx
import CardFace from '@/components/CardFace'

// ... inside the return, replace the card JSX block with:
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
```

Remove the old card div block entirely (the outer `<div className="perspective...">` through its closing `</div>`).

- [ ] **Step 3: Verify flashcard still works**

```bash
npm run dev
# Open /flashcard, verify cards flip, next button works, mode switching works
```

- [ ] **Step 4: Commit**

```bash
git add src/components/CardFace.tsx src/app/flashcard/page.tsx
git commit -m "refactor(flashcard): extract shared CardFace component"
```

---

### Task 5: LearnTabs and BrowsePanel components

**Files:**
- Create: `src/app/learn/components/LearnTabs.tsx`
- Create: `src/app/learn/components/BrowsePanel.tsx`

**Consumes:**
- `Card`, `CardType` from types.ts
- `useLearning` hook return type

- [ ] **Step 1: Write `LearnTabs.tsx`**

```tsx
// src/app/learn/components/LearnTabs.tsx
'use client'

export type LearnMode = 'browse' | 'review' | 'quiz'

interface LearnTabsProps {
  mode: LearnMode
  onChange: (mode: LearnMode) => void
  reviewCount: number
}

const tabs: { key: LearnMode; label: string; emoji: string }[] = [
  { key: 'browse', label: '浏览', emoji: '📖' },
  { key: 'review', label: '复习', emoji: '🔄' },
  { key: 'quiz', label: '测验', emoji: '🎯' },
]

export default function LearnTabs({ mode, onChange, reviewCount }: LearnTabsProps) {
  return (
    <div className="flex justify-center gap-2 mb-6">
      <div className="flex gap-1.5 p-1 rounded-xl bg-[var(--bg2)] border border-[var(--border)]">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`relative px-4 py-1.5 text-xs rounded-lg cursor-pointer transition-colors ${
              mode === t.key
                ? 'bg-[var(--accent)] text-[var(--bg)] font-semibold'
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >
            {t.emoji} {t.label}
            {t.key === 'review' && reviewCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
                {reviewCount > 99 ? '99+' : reviewCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write `BrowsePanel.tsx`**

```tsx
// src/app/learn/components/BrowsePanel.tsx
'use client'

import { useState, useMemo } from 'react'
import type { Card, CardType } from '../types'
import CardFace from '@/components/CardFace'
import { RubyText } from '@/components/Ruby'

interface BrowsePanelProps {
  cards: Card[]
  markLearned: (id: string) => void
  markForReview: (id: string) => void
  todayStr: string
}

const typeLabels: Record<CardType, string> = {
  trigram: '八卦',
  hexagram: '六十四卦',
  yao: '爻辞',
  relation: '卦关系',
}

function getCardStatus(card: Card, todayStr: string): 'new' | 'due' | 'learned' | 'mastered' {
  if (card.interval >= 21) return 'mastered'
  if (card.nextReview <= todayStr) return card.learned ? 'due' : 'new'
  return 'learned'
}

export default function BrowsePanel({ cards, markLearned, markForReview, todayStr }: BrowsePanelProps) {
  const [filter, setFilter] = useState<CardType | 'all'>('all')
  const [search, setSearch] = useState('')
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const filtered = useMemo(() => {
    let list = filter === 'all' ? cards : cards.filter(c => c.type === filter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(c =>
        c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q)
      )
    }
    return list
  }, [cards, filter, search])

  const current = filtered[index % filtered.length] ?? null

  const goTo = (i: number) => {
    setFlipped(false)
    setIndex(i)
  }

  const next = () => goTo(index + 1)
  const prev = () => goTo(index - 1)

  // Progress per type
  const typeProgress = useMemo(() => {
    const result: Record<string, { total: number; learned: number }> = {}
    for (const t of ['trigram', 'hexagram', 'yao', 'relation'] as CardType[]) {
      const ofType = cards.filter(c => c.type === t)
      result[t] = {
        total: ofType.length,
        learned: ofType.filter(c => c.learned).length,
      }
    }
    return result
  }, [cards])

  if (!current) {
    return (
      <div className="text-center py-12 text-[var(--muted)]">
        <div className="text-4xl mb-3">🔍</div>
        <p>没有匹配的卡片</p>
        {search && <button onClick={() => setSearch('')} className="mt-2 text-xs text-[var(--accent)] underline cursor-pointer">清除搜索</button>}
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center mb-4">
        <div className="flex gap-1 p-1 rounded-lg bg-[var(--bg3)] border border-[var(--border)] mx-auto">
          {(['all', 'trigram', 'hexagram', 'yao', 'relation'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setFilter(t); goTo(0) }}
              className={`px-2.5 py-1 text-[11px] rounded-md cursor-pointer transition-colors ${
                filter === t
                  ? 'bg-[var(--accent)] text-[var(--bg)] font-semibold'
                  : 'text-[var(--muted)] hover:text-[var(--fg)]'
              }`}
            >
              {t === 'all' ? '全部' : typeLabels[t]}
              {t !== 'all' && (
                <span className="ml-1 opacity-60">
                  {typeProgress[t].learned}/{typeProgress[t].total}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); goTo(0) }}
          placeholder="搜索卦名..."
          className="w-full max-w-xs px-3 py-1.5 text-[12px] rounded-lg bg-[var(--bg2)] border border-[var(--border)] text-[var(--fg)] placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]"
        />
      </div>

      {/* Progress bar */}
      <div className="max-w-[360px] mx-auto mb-3">
        <div className="text-center text-[11px] text-[var(--muted)] mb-1">
          {filtered.length > 0 ? `${((index % filtered.length) + 1)} / ${filtered.length}` : '0 / 0'}
        </div>
        <div className="h-1 bg-[var(--bg3)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
            style={{ width: `${filtered.length > 0 ? (((index % filtered.length) + 1) / filtered.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="max-w-[360px] mx-auto mb-4">
        <CardFace
          flipped={flipped}
          onFlip={() => {
            setFlipped(f => !f)
            if (!flipped) markLearned(current.id)
          }}
          status={getCardStatus(current, todayStr)}
          front={
            <div className="text-center">
              <div className="text-[12px] text-[var(--muted)] mb-2">{typeLabels[current.type]}</div>
              <div className="text-[56px] mb-3 whitespace-pre-wrap">{current.front}</div>
            </div>
          }
          back={
            <div className="text-center w-full">
              <div className="text-[12px] text-[var(--muted)] mb-2">{typeLabels[current.type]}</div>
              <div className="text-[14px] leading-relaxed whitespace-pre-wrap">
                <RubyText text={current.back} />
              </div>
            </div>
          }
        />
        {/* Action buttons */}
        <div className="flex justify-center gap-2 mt-3">
          <button
            onClick={() => markForReview(current.id)}
            className="px-3 py-1 text-[11px] rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] cursor-pointer transition-colors"
          >
            标记复习
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center items-center gap-3">
        <button
          onClick={prev}
          className="px-4 py-2 text-sm rounded-xl bg-[var(--bg3)] border border-[var(--border)] text-[var(--fg)] cursor-pointer hover:bg-[var(--bg2)] transition-colors disabled:opacity-30"
          disabled={filtered.length <= 1}
        >← 上一张</button>
        <span className="text-[11px] text-[var(--muted)] min-w-[40px] text-center">
          {filtered.length > 0 ? `${((index % filtered.length) + 1)}/${filtered.length}` : '0'}
        </span>
        <button
          onClick={next}
          className="px-4 py-2 text-sm rounded-xl bg-[var(--bg3)] border border-[var(--border)] text-[var(--fg)] cursor-pointer hover:bg-[var(--bg2)] transition-colors disabled:opacity-30"
          disabled={filtered.length <= 1}
        >下一张 →</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/learn/components/LearnTabs.tsx src/app/learn/components/BrowsePanel.tsx
git commit -m "feat(learn): add LearnTabs and BrowsePanel"
```

---

### Task 6: ReviewPanel component

**Files:**
- Create: `src/app/learn/components/ReviewPanel.tsx`

**Consumes:**
- `Card` from types.ts
- `CardFace` from shared component
- `reviewCard(cardId, quality)` from useLearning
- `reviewDue` from useLearning

- [ ] **Step 1: Write `ReviewPanel.tsx`**

```tsx
// src/app/learn/components/ReviewPanel.tsx
'use client'

import { useState } from 'react'
import type { Card } from '../types'
import CardFace from '@/components/CardFace'
import { RubyText } from '@/components/Ruby'

interface ReviewPanelProps {
  dueCards: Card[]
  reviewCard: (cardId: string, quality: number) => void
}

const qualityLabels = [
  { q: 0, label: '忘了', emoji: '😵', short: '完全忘了' },
  { q: 1, label: '模糊', emoji: '🤔', short: '很模糊' },
  { q: 2, label: '困难', emoji: '😅', short: '想起但难' },
  { q: 3, label: '犹豫', emoji: '🤨', short: '有点犹豫' },
  { q: 4, label: '顺利', emoji: '😊', short: '轻松想起' },
  { q: 5, label: '秒答', emoji: '⚡', short: '毫不费力' },
]

export default function ReviewPanel({ dueCards, reviewCard }: ReviewPanelProps) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)

  const current = dueCards[index] ?? null
  const total = dueCards.length

  const handleRate = (q: number) => {
    if (!current) return
    reviewCard(current.id, q)
    setFlipped(false)
    if (index + 1 >= total) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
    }
  }

  // Empty state
  if (total === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎉</div>
        <p className="text-[var(--fg)] text-lg font-semibold mb-2">今日任务完成！</p>
        <p className="text-[var(--muted)] text-sm mb-4">
          没有需要复习的卡片了，去浏览模式看看新内容吧
        </p>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-[var(--fg)] text-lg font-semibold mb-2">本轮复习完成！</p>
        <p className="text-[var(--muted)] text-sm mb-4">
          已复习 {total} 张卡片，明天继续加油
        </p>
        <button
          onClick={() => { setIndex(0); setDone(false); setFlipped(false) }}
          className="px-6 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] cursor-pointer"
        >
          再来一轮
        </button>
      </div>
    )
  }

  if (!current) return null

  return (
    <div>
      {/* Progress */}
      <div className="max-w-[360px] mx-auto mb-3">
        <div className="text-center text-[12px] font-semibold text-[var(--accent)] mb-1">
          复习 {index + 1} / {total}
        </div>
        <div className="h-1.5 bg-[var(--bg3)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="max-w-[360px] mx-auto mb-4">
        <CardFace
          flipped={flipped}
          onFlip={() => setFlipped(f => !f)}
          front={
            <div className="text-center">
              <div className="text-[56px] mb-3 whitespace-pre-wrap">{current.front}</div>
            </div>
          }
          back={
            <div className="text-center w-full">
              <div className="text-[16px] leading-relaxed whitespace-pre-wrap">
                <RubyText text={current.back} />
              </div>
            </div>
          }
        />
      </div>

      {/* Rating buttons — only show after flip */}
      {flipped && (
        <div className="max-w-[420px] mx-auto">
          <p className="text-center text-[11px] text-[var(--muted)] mb-2">你的记忆程度？</p>
          <div className="flex gap-1.5 justify-center flex-wrap">
            {qualityLabels.map(({ q, label, emoji }) => (
              <button
                key={q}
                onClick={() => handleRate(q)}
                className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5 bg-[var(--bg3)] border border-[var(--border)] text-[var(--fg)] hover:border-[var(--accent)]"
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-[10px]">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/learn/components/ReviewPanel.tsx
git commit -m "feat(learn): add ReviewPanel with SM-2 rating"
```

---

### Task 7: QuizPanel component

**Files:**
- Create: `src/app/learn/components/QuizPanel.tsx`

**Consumes:**
- `Card`, `CardType` from types.ts
- `getCardsByType(type)`, `reviewCard(cardId, quality)` from useLearning

- [ ] **Step 1: Write `QuizPanel.tsx`**

```tsx
// src/app/learn/components/QuizPanel.tsx
'use client'

import { useState, useMemo, useCallback } from 'react'
import type { Card, CardType } from '../types'
import { RubyText } from '@/components/Ruby'

interface QuizPanelProps {
  getCardsByType: (type: CardType) => Card[]
  reviewCard: (cardId: string, quality: number) => void
}

interface QuizLevel {
  key: string
  label: string
  type: CardType
  required: number  // consecutive correct answers to pass
}

const levels: QuizLevel[] = [
  { key: 'trigram', label: '八卦', type: 'trigram', required: 8 },
  { key: 'hexagram-1', label: '六十四卦 (1-16)', type: 'hexagram', required: 10 },
  { key: 'hexagram-2', label: '六十四卦 (17-32)', type: 'hexagram', required: 10 },
  { key: 'hexagram-3', label: '六十四卦 (33-48)', type: 'hexagram', required: 10 },
  { key: 'hexagram-4', label: '六十四卦 (49-64)', type: 'hexagram', required: 10 },
  { key: 'yao', label: '爻辞', type: 'yao', required: 10 },
  { key: 'relation', label: '卦关系', type: 'relation', required: 8 },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Generate 3 wrong answers from the same card type, excluding the correct answer */
function generateOptions(correct: Card, pool: Card[]): string[] {
  const others = pool.filter(c => c.id !== correct.id)
  const wrongs = shuffle(others).slice(0, 3).map(c => c.back.split('\n')[0])
  const options = shuffle([correct.back.split('\n')[0], ...wrongs])
  return options
}

export default function QuizPanel({ getCardsByType, reviewCard }: QuizPanelProps) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0)
  const [streak, setStreak] = useState(0)    // consecutive correct in current level
  const [questionIdx, setQuestionIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [levelComplete, setLevelComplete] = useState(false)
  const [allComplete, setAllComplete] = useState(false)
  const [startTime] = useState(() => Date.now())
  const [levelStartTime, setLevelStartTime] = useState(() => Date.now())

  const level = levels[currentLevelIdx]
  const pool = useMemo(() => getCardsByType(level.type), [getCardsByType, level.type])

  // Generate a question
  const question = useMemo(() => {
    if (pool.length === 0) return null
    // Pick based on question index (not random each render)
    const idx = questionIdx % pool.length
    const correct = pool[idx]
    const options = generateOptions(correct, pool)
    return { correct, options }
  }, [pool, questionIdx])

  const handleSelect = useCallback((answer: string) => {
    if (selected) return // already answered
    setSelected(answer)
    setShowResult(true)

    if (!question) return

    const isCorrect = answer === question.correct.back.split('\n')[0]
    if (isCorrect) {
      reviewCard(question.correct.id, 4) // mark as good recall
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak >= level.required) {
        // Level passed!
        setLevelComplete(true)
      }
    } else {
      reviewCard(question.correct.id, 0) // mark as forgotten
      setStreak(0)
    }
  }, [selected, question, streak, level.required, reviewCard])

  const nextQuestion = () => {
    setSelected(null)
    setShowResult(false)
    setQuestionIdx(i => i + 1)
  }

  const nextLevel = () => {
    const next = currentLevelIdx + 1
    if (next >= levels.length) {
      setAllComplete(true)
    } else {
      setCurrentLevelIdx(next)
      setStreak(0)
      setSelected(null)
      setShowResult(false)
      setLevelComplete(false)
      setQuestionIdx(0)
      setLevelStartTime(Date.now())
    }
  }

  // All levels complete
  if (allComplete) {
    const totalTime = Math.floor((Date.now() - startTime) / 1000)
    const mins = Math.floor(totalTime / 60)
    const secs = totalTime % 60
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <p className="text-[var(--fg)] text-xl font-bold mb-2">全部通关！</p>
        <p className="text-[var(--muted)] text-sm mb-4">
          完成全部 {levels.length} 关，总用时 {mins}分{secs}秒
        </p>
        <button
          onClick={() => {
            setCurrentLevelIdx(0)
            setStreak(0)
            setAllComplete(false)
            setQuestionIdx(0)
            setSelected(null)
            setShowResult(false)
            setLevelComplete(false)
          }}
          className="mt-2 px-6 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] cursor-pointer"
        >
          重新挑战
        </button>
      </div>
    )
  }

  // Level complete
  if (levelComplete) {
    const levelTime = Math.floor((Date.now() - levelStartTime) / 1000)
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎉</div>
        <p className="text-[var(--fg)] text-lg font-bold mb-2">{level.label} — 通关！</p>
        <p className="text-[var(--muted)] text-sm mb-2">
          连续答对 {level.required} 题，用时 {levelTime} 秒
        </p>
        <p className="text-[var(--muted)] text-xs mb-4">
          总进度: {currentLevelIdx + 1} / {levels.length}
        </p>
        <button
          onClick={nextLevel}
          className="px-6 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] cursor-pointer"
        >
          {currentLevelIdx + 1 >= levels.length ? '查看总成绩' : `下一关: ${levels[currentLevelIdx + 1].label}`}
        </button>
      </div>
    )
  }

  if (!question || pool.length === 0) {
    return <div className="text-center py-12 text-[var(--muted)]">暂无题目数据</div>
  }

  const isCorrect = selected === question.correct.back.split('\n')[0]

  return (
    <div>
      {/* Level info */}
      <div className="text-center mb-4">
        <div className="text-[14px] font-semibold text-[var(--fg)] mb-1">{level.label}</div>
        <div className="text-[11px] text-[var(--muted)]">
          连续正确: {streak} / {level.required}
          <span className="mx-2">·</span>
          第 {levels.indexOf(level) + 1}/{levels.length} 关
        </div>
        <div className="mt-2 h-1.5 bg-[var(--bg3)] rounded-full overflow-hidden max-w-[200px] mx-auto">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] rounded-full transition-all duration-500"
            style={{ width: `${(streak / level.required) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-[360px] mx-auto mb-6 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
        <div className="text-[12px] text-[var(--muted)] mb-3 text-center">
          以下哪个是？
        </div>
        <div className="text-center text-[48px] mb-4">
          {question.correct.front}
        </div>
        <div className="flex flex-col gap-2">
          {question.options.map((opt, i) => {
            let btnClass = 'bg-[var(--bg3)] border-[var(--border)] text-[var(--fg)] hover:border-[var(--accent)]'
            if (showResult) {
              const correctAnswer = question.correct.back.split('\n')[0]
              if (opt === correctAnswer) {
                btnClass = 'bg-green-500/20 border-green-500 text-green-400'
              } else if (opt === selected && opt !== correctAnswer) {
                btnClass = 'bg-red-500/20 border-red-500 text-red-400'
              } else {
                btnClass = 'bg-[var(--bg3)] border-[var(--border)] text-[var(--muted)] opacity-50'
              }
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={!!selected}
                className={`px-4 py-3 text-sm rounded-xl border cursor-pointer transition-all text-left ${btnClass}`}
              >
                <RubyText text={opt} />
              </button>
            )
          })}
        </div>

        {showResult && (
          <div className="mt-4 text-center">
            <p className={`text-sm font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✅ 正确！' : '❌ 错误'}
            </p>
            {!isCorrect && (
              <p className="text-[11px] text-[var(--muted)] mt-1">
                正确答案: {question.correct.back.split('\n')[0]}
              </p>
            )}
            <button
              onClick={nextQuestion}
              className="mt-3 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] cursor-pointer"
            >
              下一题
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/learn/components/QuizPanel.tsx
git commit -m "feat(learn): add QuizPanel with level-based testing"
```

---

### Task 8: StatsDashboard component

**Files:**
- Create: `src/app/learn/components/StatsDashboard.tsx`

- [ ] **Step 1: Write `StatsDashboard.tsx`**

```tsx
// src/app/learn/components/StatsDashboard.tsx
'use client'

import { useState } from 'react'
import type { LearnStats } from '../types'

interface StatsDashboardProps {
  stats: LearnStats
  exportData: () => string
  importData: (json: string) => string[]
}

export default function StatsDashboard({ stats, exportData, importData }: StatsDashboardProps) {
  const [open, setOpen] = useState(false)
  const [importMsg, setImportMsg] = useState<string | null>(null)

  const pct = stats.totalCards > 0
    ? Math.round((stats.learnedCards / stats.totalCards) * 100)
    : 0

  const handleExport = () => {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const dateStr = new Date().toISOString().slice(0, 10)
    a.download = `bagua-learning-${dateStr}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const warnings = importData(text)
        if (warnings.length > 0) {
          setImportMsg(`导入成功（${warnings.length} 条提示）\n${warnings.slice(0, 3).join('\n')}`)
        } else {
          setImportMsg('导入成功')
        }
        setTimeout(() => setImportMsg(null), 4000)
      } catch (err: any) {
        setImportMsg(`导入失败: ${err.message}`)
        setTimeout(() => setImportMsg(null), 4000)
      }
    }
    input.click()
  }

  return (
    <div className="mt-8 border-t border-[var(--border)]">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full py-3 text-[12px] text-[var(--muted)] hover:text-[var(--fg)] cursor-pointer transition-colors flex items-center justify-center gap-2"
      >
        📊 学习统计 {open ? '▲' : '▼'}
      </button>

      {open && (
        <div className="pb-6 animate-[fadeIn_0.3s_ease]">
          {/* Overall progress */}
          <div className="text-center mb-6">
            <div className="text-[40px] font-bold text-[var(--accent)]">{pct}%</div>
            <div className="text-[12px] text-[var(--muted)]">
              已学 {stats.learnedCards} / 共 {stats.totalCards} 张卡片
              {stats.masteredCards > 0 && ` · 掌握 ${stats.masteredCards} 张`}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-[480px] mx-auto mb-6">
            <StatBox label="今日复习" value={`${stats.todayReviewed}`} sub={`到期 ${stats.todayDue}`} />
            <StatBox label="连续天数" value={`${stats.streak} 天`} sub={stats.streak > 0 ? '🔥 坚持!' : '今天开始'} />
            <StatBox label="总复习次数" value={`${stats.totalReviews}`} sub="" />
            <StatBox label="最近学习" value={stats.lastStudyDate ?? '—'} sub="" />
          </div>

          {/* Import / Export */}
          <div className="flex justify-center gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 text-[11px] rounded-xl bg-[var(--bg3)] border border-[var(--border)] text-[var(--fg)] cursor-pointer hover:bg-[var(--bg2)] transition-colors"
            >
              📤 导出进度
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 text-[11px] rounded-xl bg-[var(--bg3)] border border-[var(--border)] text-[var(--fg)] cursor-pointer hover:bg-[var(--bg2)] transition-colors"
            >
              📥 导入进度
            </button>
          </div>
          {importMsg && (
            <p className="text-center mt-2 text-[11px] text-[var(--accent)] whitespace-pre-wrap">{importMsg}</p>
          )}
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center">
      <div className="text-[18px] font-bold text-[var(--fg)]">{value}</div>
      <div className="text-[11px] text-[var(--muted)]">{label}</div>
      {sub && <div className="text-[10px] text-[var(--muted)] opacity-70">{sub}</div>}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/learn/components/StatsDashboard.tsx
git commit -m "feat(learn): add StatsDashboard with import/export"
```

---

### Task 9: Main learn page assembly

**Files:**
- Create: `src/app/learn/page.tsx`

- [ ] **Step 1: Write `page.tsx`**

```tsx
// src/app/learn/page.tsx
'use client'

import { useState } from 'react'
import usePageTitle from '@/hooks/usePageTitle'
import PageHeader from '@/components/PageHeader'
import { useLearning } from './hooks/useLearning'
import LearnTabs, { type LearnMode } from './components/LearnTabs'
import BrowsePanel from './components/BrowsePanel'
import ReviewPanel from './components/ReviewPanel'
import QuizPanel from './components/QuizPanel'
import StatsDashboard from './components/StatsDashboard'

export default function LearnPage() {
  usePageTitle('学习 · 八卦入门')

  const [mode, setMode] = useState<LearnMode>('browse')
  const {
    cards,
    stats,
    reviewDue,
    reviewCard,
    markLearned,
    markForReview,
    getCardsByType,
    exportData,
    importData,
    todayStr,
  } = useLearning()

  return (
    <>
      <PageHeader
        title="学习中心"
        subtitle={
          mode === 'browse'
            ? '自由浏览 · 看卦认名'
            : mode === 'review'
            ? '间隔复习 · 科学记忆'
            : '闯关测验 · 挑战自己'
        }
      />

      <LearnTabs mode={mode} onChange={setMode} reviewCount={reviewDue.length} />

      {mode === 'browse' && (
        <BrowsePanel
          cards={cards}
          markLearned={markLearned}
          markForReview={markForReview}
          todayStr={todayStr}
        />
      )}

      {mode === 'review' && (
        <ReviewPanel
          dueCards={reviewDue}
          reviewCard={reviewCard}
        />
      )}

      {mode === 'quiz' && (
        <QuizPanel
          getCardsByType={getCardsByType}
          reviewCard={reviewCard}
        />
      )}

      <StatsDashboard
        stats={stats}
        exportData={exportData}
        importData={importData}
      />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/learn/page.tsx
git commit -m "feat(learn): add main learn page with tab routing"
```

---

### Task 10: Navigation updates — Header, Footer, Flashcard

**Files:**
- Modify: `src/components/Header.tsx` — add `/learn` to tabs, add footer link
- Modify: `src/app/layout.tsx` — add `/learn` to footer links
- Modify: `src/app/flashcard/page.tsx` — add link to `/learn`

- [ ] **Step 1: Add `/learn` to Header tabs**

In `src/components/Header.tsx`, add to the `tabs` array:

```ts
{ href: '/learn', label: '学习', exact: true, group: '学习' },
```

Insert it after the `/flashcard` entry (or nearby in the 学习 group). Also add to `visibleTabs` or keep it in `moreTabs` — add to `visibleTabs` by updating the filter:

```ts
const visibleTabs = tabs.filter(t => ['/', '/eight', '/relations', '/hexagrams', '/divine', '/learn'].includes(t.href))
```

- [ ] **Step 2: Add `/learn` to Footer**

In `src/app/layout.tsx`, in the 学习 section of the footer links, add:

```tsx
<a href="/learn" className="text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline">学习中心</a>
```

Place it near `/flashcard` in the 学习 group.

- [ ] **Step 3: Add link from flashcard to learn**

In `src/app/flashcard/page.tsx`, add a link banner above the PageHeader or below it:

```tsx
<div className="text-center mb-4">
  <a
    href="/learn"
    className="inline-flex items-center gap-1.5 text-[12px] text-[var(--accent)] hover:underline transition-all"
  >
    🆕 升级到综合学习系统 — 间隔复习 + 闯关测验
  </a>
</div>
```

- [ ] **Step 4: Verify navigation**

```bash
npm run dev
# Verify /learn appears in header nav
# Verify /learn appears in footer links
# Verify flashcard page shows link to /learn
# Navigate to /learn and verify all three tabs work
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx src/app/layout.tsx src/app/flashcard/page.tsx
git commit -m "feat(learn): add navigation links to learn system"
```

---

### Task 11: Final verification

- [ ] **Step 1: Build and verify**

```bash
npm run build
```

Expected: build succeeds with no errors.

- [ ] **Step 2: Manual smoke test checklist**

Run `npm run dev` and verify:

1. Open `/learn` — page loads, tabs switch between browse/review/quiz
2. Browse mode: filter by all 4 types, search works, card flip works, prev/next work, "标记复习" button works
3. Review mode: shows "今日任务完成" if no cards due, or shows card + rating buttons after flip
4. Quiz mode: shows level selector, questions with 4 options, correct/incorrect feedback, level progression
5. Stats dashboard: expands/collapses, shows progress, export downloads JSON, import uploads JSON
6. Header: `/learn` tab visible and active when on page
7. Footer: `/learn` link in 学习 section
8. `/flashcard`: shows banner link to `/learn`, cards still work correctly with shared CardFace

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "chore(learn): final fixes from smoke test"
```
