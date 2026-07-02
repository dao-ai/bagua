'use client'
import usePageTitle from '@/hooks/usePageTitle'
import { useState, useMemo } from 'react'
import PageHeader from '@/components/PageHeader'
import { cardBase } from '@/constants'
import { allWords, categories, categoryEmoji } from '@/data/yijingLanguage'

export default function YijingLanguagePage() {
  usePageTitle()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let items = allWords
    if (activeCategory) {
      items = items.filter(w => w.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      items = items.filter(w =>
        w.word.includes(q) || w.modern.includes(q) || w.source.includes(q)
      )
    }
    return items
  }, [search, activeCategory])

  return (
    <>
      <PageHeader
        title="易经·语言"
        subtitle="现代汉语中有大量词汇和成语出自《易经》。粗略统计超过200条，日常高频使用的也有三四十个。"
      />

      {/* 统计概览卡片 */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {[
          { label: '收录词条', value: allWords.length, highlight: true },
          ...categories.map(c => ({
            label: c.label,
            value: allWords.filter(w => w.category === c.id).length,
            highlight: false,
          })),
        ].map(s => (
          <div key={s.label} className={`px-4 py-2 rounded-xl border border-[var(--border)] text-center min-w-[80px] ${s.highlight ? 'bg-[var(--glow)]' : ''}`}>
            <div className="text-lg font-bold text-[var(--accent)]">{s.value}</div>
            <div className="text-[11px] text-[var(--muted)] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 搜索框 */}
      <div className="relative max-w-md mx-auto mb-5">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] text-sm pointer-events-none">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setActiveCategory(null) }}
          placeholder="搜索词汇…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg2)] border border-[var(--border)] text-sm text-[var(--fg)] outline-none transition-colors focus:border-[var(--accent)] placeholder:text-[var(--muted)]"
        />
      </div>

      {/* 分类标签 */}
      <div className="flex justify-center gap-1.5 mb-6 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3.5 py-1.5 rounded-lg text-xs border cursor-pointer transition-colors ${
            !activeCategory
              ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
              : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
          }`}
        >
          全部
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs border cursor-pointer transition-colors ${
              activeCategory === cat.id
                ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
                : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 词条表格 */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg2)]">
              <th scope="col" className="text-left px-4 py-3 font-semibold text-[var(--fg)] text-xs uppercase tracking-wider w-[110px]">词汇</th>
              <th scope="col" className="text-left px-4 py-3 font-semibold text-[var(--muted)] text-xs uppercase tracking-wider w-[120px]">出处</th>
              <th scope="col" className="text-left px-4 py-3 font-semibold text-[var(--muted)] text-xs uppercase tracking-wider hidden md:table-cell w-[160px]">原典原文</th>
              <th scope="col" className="text-left px-4 py-3 font-semibold text-[var(--muted)] text-xs uppercase tracking-wider">现代含义</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-[var(--muted)] text-sm">没有匹配的结果</td>
              </tr>
            ) : (
              filtered.map(w => (
                <tr key={w.word} className="border-t border-[var(--border)] hover:bg-[var(--glow)] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-base font-semibold">{w.word}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)] text-xs">
                    {categoryEmoji[w.category]} {w.source}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)] text-xs italic hidden md:table-cell max-w-[200px] truncate" title={w.original}>
                    {w.original.length > 30 ? w.original.slice(0, 28) + '…' : w.original}
                  </td>
                  <td className="px-4 py-3 text-[var(--fg)] text-sm">{w.modern}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 底部统计 */}
      <div className={`mt-8 p-5 rounded-xl ${cardBase} bg-[var(--bg2)] text-center`}>
        <p className="text-sm text-[var(--muted)] mb-2">
          据《成语探源辞典》等统计，直接出自《周易》经传的成语约 <strong className="text-[var(--fg)]">200~300条</strong>，
          现代人无意识脱口而出的核心词约 <strong className="text-[var(--fg)]">30~40个</strong>。
        </p>
        <p className="text-xs text-[var(--muted)]">
          本页收录了最常见、最有代表性的 <strong className="text-[var(--fg)]">{allWords.length}</strong> 条。
        </p>
      </div>
    </>
  )
}
