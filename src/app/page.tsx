'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { YaoDisplay } from '@/components/Yao'
import { baguaList, type Bagua } from '@/data/bagua'

function fmtInfo(b: Bagua) {
  return [
    ['自然', b.nature], ['属性', b.attribute], ['家庭', b.family],
    ['动物', b.animal], ['身体', b.body], ['方向', b.direction],
    ['季节', b.season], ['关键词', b.keywords.join(' · ')],
  ]
}

export default function HomePage() {
  const [modal, setModal] = useState<Bagua | null>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null) }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <>
      <div className="text-center pb-6">
        <h2 className="text-[26px] mb-1.5">认识八卦</h2>
        <p className="text-sm text-[var(--muted)] max-w-[520px] mx-auto">
          八卦不是符号，是一家八口。把每个卦当成一个人来认识，不用背也能记住。
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3.5">
        {baguaList.map(b => (
          <div
            key={b.id}
            onClick={() => setModal(b)}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 pb-4 text-center cursor-pointer transition-all duration-300 relative overflow-hidden hover:border-[var(--accent)] hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--shadow)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-transparent before:via-[var(--accent)] before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
          >
            <div className="text-[44px]">{b.symbol}</div>
            <h3 className="text-xl mt-1 mb-0.5">{b.name}</h3>
            <p className="text-xs text-[var(--muted)]">{b.pinyin}</p>
            <div className="flex gap-1.5 justify-center mt-2 flex-wrap">
              {b.keywords.map(k => (
                <span key={k} className="px-2.5 py-0.5 rounded-full text-xs bg-[var(--bg3)] text-[var(--accent2)]">{k}</span>
              ))}
            </div>
            <p className="text-sm text-[var(--muted)] mt-2.5 pt-2.5 border-t border-[var(--border)]">{b.short}</p>
          </div>
        ))}
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)}>
        {modal && (
          <div>
            <div className="text-[60px] text-center block">{modal.symbol}</div>
            <h2 className="text-center text-2xl mt-1.5 mb-0.5">{modal.name}</h2>
            <p className="text-center text-sm text-[var(--muted)]">{modal.pinyin}</p>
            <p className="text-center text-sm text-[var(--accent2)] my-3 leading-relaxed">{modal.description}</p>
            <YaoDisplay yao={modal.yao} big />
            <div className="grid grid-cols-2 gap-2 mt-4">
              {fmtInfo(modal).map(([k, v]) => (
                <div key={k} className="p-2.5 rounded-xl bg-[var(--bg3)] text-sm flex flex-col gap-0.5">
                  <span className="text-[11px] text-[var(--muted)]">{k}</span>
                  <span className="font-semibold text-[var(--fg)]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
