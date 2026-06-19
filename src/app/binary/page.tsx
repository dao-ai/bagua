'use client'
import usePageTitle from '@/hooks/usePageTitle'

import { YaoDisplay } from '@/components/Yao'
import { RubyText } from '@/components/Ruby'
import { baguaList } from '@/data/bagua'

export default function BinaryPage() {
  usePageTitle()
  const sorted = [...baguaList].sort((a, b) => b.decimal - a.decimal)

  return (
    <>
      <div className="text-center pb-6">
        <h2 className="text-[26px] mb-1.5 font-heading">二进制 · 八卦对照</h2>
        <p className="text-sm text-[var(--muted)] max-w-[520px] mx-auto">
          阳为 1，阴为 0，从下往上读。莱布尼茨受此启发发明了二进制。
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {['卦', '符号', '卦名', '二进制', '十进制', '关键词'].map(h => (
                <th key={h} className="p-3.5 text-center text-[11px] uppercase tracking-widest text-[var(--muted)] border-b-2 border-[var(--border)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(b => (
              <tr key={b.id} className="hover:bg-[var(--bg2)] transition-colors">
                <td className="p-3.5 text-center border-b border-[var(--border)]"><YaoDisplay yao={b.yao} /></td>
                <td className="p-3.5 text-center text-[28px] border-b border-[var(--border)]">{b.symbol}</td>
                <td className="p-3.5 text-center font-semibold text-base border-b border-[var(--border)]"><RubyText text={b.name} /></td>
                <td className="p-3.5 text-center font-mono text-base tracking-widest text-[var(--accent2)] border-b border-[var(--border)]">{b.binary}</td>
                <td className="p-3.5 text-center font-bold text-lg border-b border-[var(--border)]">{b.decimal}</td>
                <td className="p-3.5 text-center text-[13px] text-[var(--muted)] border-b border-[var(--border)]">{b.keywords.join(' · ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-center text-[var(--muted)] mt-3">
        💡 从 <strong className="text-[var(--accent2)]">7 → 0</strong>，步进 -1，正是八卦的先天数排列规律
      </p>
    </>
  )
}
