'use client'
import usePageTitle from '@/hooks/usePageTitle'

import { useState, useMemo } from 'react'
import { RubyText } from '@/components/Ruby'
import glossary, { categories } from '@/data/glossary'

export default function GlossaryPage() {
  usePageTitle()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let items = glossary

    // 筛选分类
    if (activeCategory) {
      items = items.filter(t => t.category === activeCategory)
    }

    // 搜索过滤
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      items = items.filter(t =>
        t.term.toLowerCase().includes(q) ||
        t.brief.toLowerCase().includes(q) ||
        t.detail.toLowerCase().includes(q)
      )
    }

    return items
  }, [search, activeCategory])

  return (
    <>
      <div className="text-center pb-6">
        <h2 className="text-[26px] mb-1.5">易学术语解释</h2>
        <p className="text-sm text-[var(--muted)] max-w-[520px] mx-auto">
          爻位、卦象、断辞……遇到不懂的词，来这里查。
        </p>
      </div>

      {/* 搜索框 */}
      <div className="relative max-w-md mx-auto mb-5">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] text-sm pointer-events-none">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setActiveCategory(null) }}
          placeholder="搜索术语…"
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

      {/* 术语列表 */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--muted)]">
          <div className="text-3xl mb-3">🔎</div>
          <p className="text-sm">没有找到匹配的术语</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(term => {
            const isOpen = expandedTerm === term.term
            return (
              <div
                key={term.term}
                className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-200"
              >
                {/* 词条标题（可点击展开） */}
                <button
                  onClick={() => setExpandedTerm(isOpen ? null : term.term)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left cursor-pointer border-none bg-transparent hover:bg-[var(--bg2)] transition-colors"
                >
                  <span className="flex-1">
                    <span className="text-sm font-semibold text-[var(--fg)]">
                      {term.pinyin ? (
                        <RubyText text={term.term} />
                      ) : (
                        term.term
                      )}
                    </span>
                    <span className="text-xs text-[var(--muted)] ml-2">
                      {categories.find(c => c.id === term.category)?.label}
                    </span>
                  </span>
                  <span className="text-xs text-[var(--muted)] mr-2 hidden sm:block flex-shrink-0 max-w-[280px] truncate">
                    {term.brief}
                  </span>
                  <span className={`text-[var(--muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </button>

                {/* 展开详情 */}
                {isOpen && (
                  <div className="px-5 pb-4 pt-0 animate-[fadeIn_0.25s_ease]">
                    <div className="p-4 rounded-xl bg-[var(--bg2)]">
                      <div className="text-xs text-[var(--accent2)] font-semibold mb-1.5 tracking-wider">一句话</div>
                      <p className="text-sm text-[var(--fg)] mb-3 leading-relaxed">{term.brief}</p>

                      <div className="text-xs text-[var(--accent2)] font-semibold mb-1.5 tracking-wider">详解</div>
                      <p className="text-sm text-[var(--fg)] leading-relaxed whitespace-pre-line">{term.detail}</p>

                      {term.example && (
                        <>
                          <div className="text-xs text-[var(--accent2)] font-semibold mt-3 mb-1.5 tracking-wider">举例</div>
                          <div className="text-sm text-[var(--accent2)] italic leading-relaxed bg-[var(--bg3)] p-3 rounded-lg border-l-2 border-[var(--accent)]">
                            <RubyText text={term.example} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* 统计 */}
      <div className="text-center mt-6 text-xs text-[var(--muted)]">
        共 <strong className="text-[var(--accent2)]">{glossary.length}</strong> 条术语
        · {categories.length} 个分类
        {search.trim() && (
          <span> · 筛选出 <strong className="text-[var(--accent2)]">{filtered.length}</strong> 条</span>
        )}
      </div>
    </>
  )
}
