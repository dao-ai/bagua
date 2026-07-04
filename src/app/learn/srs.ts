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
