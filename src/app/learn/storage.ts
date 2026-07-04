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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // quota exceeded or private browsing — silently ignore
  }
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
