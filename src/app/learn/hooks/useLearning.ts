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
      const isNewDay = prev.stats.lastStudyDate !== today
      const stats = {
        ...computeStats(cards, prev.stats),
        todayReviewed: isNewDay ? 1 : prev.stats.todayReviewed + 1,
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
