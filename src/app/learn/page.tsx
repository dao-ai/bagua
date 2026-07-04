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
