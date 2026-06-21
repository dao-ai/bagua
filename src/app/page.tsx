'use client'
import usePageTitle from '@/hooks/usePageTitle'
import Link from 'next/link'
import DailyHexagram from '@/components/DailyHexagram'

const features = [
  {
    icon: '📖',
    title: '学习',
    desc: '八卦 · 64卦 · 术语 · 闪卡',
    links: [
      { href: '/eight', label: '八卦' },
      { href: '/hexagrams', label: '64卦' },
      { href: '/glossary', label: '术语' },
      { href: '/flashcard', label: '闪卡' },
    ],
  },
  {
    icon: '🔧',
    title: '工具',
    desc: '起卦 · 解卦 · 对比 · 本命卦',
    links: [
      { href: '/divine', label: '起卦' },
      { href: '/simulator', label: '变爻模拟' },
      { href: '/compare', label: '卦对比' },
      { href: '/ai-reading', label: 'AI解卦' },
      { href: '/lifegua', label: '本命卦' },
    ],
  },
  {
    icon: '📊',
    title: '探索',
    desc: '先后天对照 · 起卦历史',
    links: [
      { href: '/contrast', label: '先后天' },
      { href: '/history', label: '占卜记录' },
    ],
  },
]

export default function HomePage() {
  usePageTitle()

  return (
    <div className="animate-[fadeIn_0.5s_ease]">
      {/* 欢迎区 */}
      <div className="text-center pb-8 mb-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-5xl">☯</span>
        </div>
        <h1 className="text-[30px] md:text-[36px] font-heading font-bold mb-2 leading-tight">
          每天15分钟，搞懂八卦
        </h1>
        <p className="text-sm text-[var(--muted)] max-w-[440px] mx-auto leading-relaxed">
          交互式《易经》学习网站——认识八卦、浏览六十四卦、起卦占卜、AI 解卦，从入门到深入。
        </p>
      </div>

      {/* 功能入口 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {features.map(cat => (
          <div
            key={cat.title}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 transition-all duration-300 hover:border-[var(--accent)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_var(--shadow)]"
          >
            <div className="text-2xl mb-2">{cat.icon}</div>
            <h3 className="text-base font-semibold mb-1">{cat.title}</h3>
            <p className="text-xs text-[var(--muted)] mb-3">{cat.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {cat.links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2.5 py-1 rounded-lg text-[11px] border border-[var(--border)] bg-[var(--bg2)] text-[var(--muted)] no-underline transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 每日一卦 */}
      <DailyHexagram />
    </div>
  )
}
