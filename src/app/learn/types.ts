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
