// src/app/learn/components/QuizPanel.tsx
'use client'

import { useState, useMemo, useCallback } from 'react'
import type { Card, CardType } from '../types'
import { RubyText } from '@/components/Ruby'
import { Card as UICard, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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

const gradientBtn = 'font-semibold bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] border-none hover:from-[var(--accent2)] hover:to-[var(--accent)]'

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
        <Button
          onClick={() => {
            setCurrentLevelIdx(0)
            setStreak(0)
            setAllComplete(false)
            setQuestionIdx(0)
            setSelected(null)
            setShowResult(false)
            setLevelComplete(false)
          }}
          className={gradientBtn}
        >
          重新挑战
        </Button>
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
        <Button
          onClick={nextLevel}
          className={gradientBtn}
        >
          {currentLevelIdx + 1 >= levels.length ? '查看总成绩' : `下一关: ${levels[currentLevelIdx + 1].label}`}
        </Button>
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
      <UICard className="max-w-[360px] mx-auto mb-6">
        <CardContent className="p-6">
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
              <Button
                onClick={nextQuestion}
                size="sm"
                className={`mt-3 ${gradientBtn}`}
              >
                下一题
              </Button>
            </div>
          )}
        </CardContent>
      </UICard>
    </div>
  )
}
