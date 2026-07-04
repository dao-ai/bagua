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
