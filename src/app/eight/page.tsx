'use client'
import usePageTitle from '@/hooks/usePageTitle'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import PageHeader from '@/components/PageHeader'
import { RubyText, Ruby } from '@/components/Ruby'
import { YaoDisplay } from '@/components/Yao'
import { baguaList, type Bagua } from '@/data/bagua'

function fmtInfo(b: Bagua) {
  return [
    ['自然', b.nature], ['属性', b.attribute], ['家庭', b.family],
    ['动物', b.animal], ['身体', b.body], ['方向', b.direction],
    ['季节', b.season], ['关键词', b.keywords.join(' · ')],
  ]
}

export default function EightPage() {
  usePageTitle()
  const [modal, setModal] = useState<Bagua | null>(null)
  const [view, setView] = useState<'cards' | 'table'>('cards')

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null) }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const sorted = [...baguaList].sort((a, b) => b.decimal - a.decimal)

  return (
    <>
      <PageHeader title="认识八卦" subtitle="八卦不是符号，是一家八口。把每个卦当成一个人来认识，不用背也能记住。" />

      {/* 视图切换 */}
      <div className="flex justify-center gap-1.5 mb-6">
        <button onClick={() => setView('cards')}
          className={`px-4 py-1.5 rounded-lg text-xs border cursor-pointer transition-colors ${
            view === 'cards'
              ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
              : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
          }`}>
          ☰ 八卦卡片
        </button>
        <button onClick={() => setView('table')}
          className={`px-4 py-1.5 rounded-lg text-xs border cursor-pointer transition-colors ${
            view === 'table'
              ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
              : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
          }`}>
          01 二进制表格
        </button>
      </div>

      {view === 'cards' ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {baguaList.map(b => (
              <div key={b.id} onClick={() => setModal(b)}
                className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 pb-4 text-center cursor-pointer transition-all duration-300 relative overflow-hidden hover:border-[var(--accent)] hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--shadow)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-transparent before:via-[var(--accent)] before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
              >
                <div className="text-[44px]">{b.symbol}</div>
                <h3 className="text-xl mt-1 mb-0.5"><RubyText text={b.name} /></h3>
                <div className="flex gap-1.5 justify-center mt-2 flex-wrap">
                  {b.keywords.map(k => (
                    <span key={k} className="px-2.5 py-0.5 rounded-full text-xs bg-[var(--bg3)] text-[var(--accent2)]">{k}</span>
                  ))}
                </div>
                <p className="text-sm text-[var(--muted)] mt-2.5 pt-2.5 border-t border-[var(--border)]">{b.short}</p>
                <div className="text-[10px] text-[var(--muted)] mt-2 font-mono">{b.binary} · {b.decimal}</div>
              </div>
            ))}
          </div>

          <Modal open={!!modal} onClose={() => setModal(null)}>
            {modal && (
              <div>
                <div className="text-[60px] text-center block">{modal.symbol}</div>
                <h2 className="text-center text-2xl mt-1.5 mb-0.5"><RubyText text={modal.name} /></h2>
                <p className="text-center text-sm text-[var(--accent2)] my-3 leading-relaxed">{modal.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  {fmtInfo(modal).map(([k, v]) => (
                    <div key={k} className="p-2.5 rounded-xl bg-[var(--bg3)] text-sm flex flex-col gap-0.5">
                      <span className="text-[11px] text-[var(--muted)]">{k}</span>
                      <span className="font-semibold text-[var(--fg)]">{v}</span>
                    </div>
                  ))}
                </div>
                {/* 底部：爻线图标 + 二进制 + 十进制 */}
                <div className="mt-5 pt-4 border-t border-[var(--border)] text-center">
                  <YaoDisplay yao={modal.yao} big />
                  <div className="text-xs text-[var(--muted)] mt-2 font-mono">
                    二进制：<span className="text-[var(--accent2)]">{modal.binary}</span>
                    &nbsp;·&nbsp; 十进制：<span className="text-[var(--accent2)]">{modal.decimal}</span>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {['卦', '符号', '卦名', '二进制', '十进制', '关键词'].map(h => (
                  <th key={h} className="p-3.5 text-center text-[11px] uppercase tracking-widest text-[var(--muted)] border-b-2 border-[var(--border)] bg-[var(--bg3)]">{h}</th>
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
          <p className="text-xs text-center text-[var(--muted)] mt-3">
            💡 从 <strong className="text-[var(--accent2)]">7 → 0</strong>，步进 -1，正是八卦的先天数排列规律
          </p>
        </div>
      )}
    </>
  )
}
