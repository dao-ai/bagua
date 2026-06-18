'use client'
import usePageTitle from '@/hooks/usePageTitle'

import { useState, useCallback } from 'react'
import { HexagramDisplay } from '@/components/Yao'
import { baguaList, baguaMap, numToBagua, getHexagramName, getHexagramSymbol, type HexagramDetail } from '@/data/bagua'
import { getHexagramDetail } from '@/data/hexagrams'

export default function DivinePage() {
  usePageTitle()
  const [n1, setN1] = useState('')
  const [n2, setN2] = useState('')
  const [n3, setN3] = useState('')
  const [result, setResult] = useState<{
    hexName: string; changedHexName: string
    upperName: string; lowerName: string
    changedUpperName: string; changedLowerName: string
    nowDetail?: HexagramDetail; changedDetail?: HexagramDetail
    nowSymbol: string; changedSymbol: string
    movingName: string; movingChange: string
    yao6: number[]; changedYao6: number[]
    movingIndex: number
  } | null>(null)

  const doDivine = useCallback(() => {
    const a = parseInt(n1), b = parseInt(n2), c = parseInt(n3)
    if (isNaN(a) || isNaN(b) || isNaN(c)) { setResult(null); return }

    const uk = a % 8, lk = b % 8, mk = c % 6 || 6
    const ui = numToBagua[uk], li = numToBagua[lk]
    if (!ui || !li) { setResult(null); return }

    const ub = baguaMap[ui], lb = baguaMap[li]
    const hn = getHexagramName(ui, li)
    const nd = getHexagramDetail(ui, li)
    const y6 = [...ub.yao.slice().reverse(), ...lb.yao.slice().reverse()]
    const mi = 6 - mk
    const cy6 = [...y6]; cy6[mi] = cy6[mi] === 1 ? 0 : 1
    const cuy = cy6.slice(0, 3).reverse(), cly = cy6.slice(3, 6).reverse()
    const cui = baguaList.find(b => b.yao[0]===cuy[0] && b.yao[1]===cuy[1] && b.yao[2]===cuy[2])?.id
    const cli = baguaList.find(b => b.yao[0]===cly[0] && b.yao[1]===cly[1] && b.yao[2]===cly[2])?.id
    if (!cui || !cli) return
    const chn = getHexagramName(cui, cli)
    const cd = getHexagramDetail(cui, cli)
    const cub = baguaMap[cui], clb = baguaMap[cli]
    const ns = getHexagramSymbol(ui, li), cs = getHexagramSymbol(cui, cli)
    const mn = ['初爻','二爻','三爻','四爻','五爻','上爻'][mk-1]
    const mc = y6[mi] === 1 ? '阳变阴' : '阴变阳'

    setResult({
      hexName: hn, changedHexName: chn,
      upperName: ub.name, lowerName: lb.name,
      changedUpperName: cub.name, changedLowerName: clb.name,
      nowDetail: nd, changedDetail: cd,
      nowSymbol: ns, changedSymbol: cs,
      movingName: mn, movingChange: mc,
      yao6: y6, changedYao6: cy6, movingIndex: mi,
    })
  }, [n1, n2, n3])

  const handleKeyDown = (i: number) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const inputs = document.querySelectorAll('.divine-input')
      if (i < 2) (inputs[i+1] as HTMLInputElement)?.focus()
      else doDivine()
    }
  }

  return (
    <>
      <div className="text-center pb-6">
        <h2 className="text-[26px] mb-1.5">起卦 · 数字法</h2>
        <p className="text-sm text-[var(--muted)] max-w-[520px] mx-auto">心里想一件事，输入三个数字，看看卦象怎么说。</p>
      </div>

      <div className="max-w-[500px] mx-auto bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8">
        <h3 className="text-center text-lg mb-1">✍️ 输入三个数字</h3>
        <p className="text-center text-sm text-[var(--muted)] mb-5">第一个数定上卦 · 第二个数定下卦 · 第三个数定动爻</p>
        <div className="flex gap-3 justify-center mb-5">
          {[n1, n2, n3].map((v, i) => (
            <input
              key={i}
              type="number"
              value={v}
              onChange={e => [setN1, setN2, setN3][i](e.target.value)}
              onKeyDown={handleKeyDown(i)}
              placeholder={['如 3', '如 5', '如 8'][i]}
              className="divine-input w-20 p-2.5 text-center bg-[var(--bg3)] border border-[var(--border)] rounded-xl text-[var(--fg)] text-xl font-semibold outline-none transition-all duration-300 caret-[var(--accent)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--glow)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          ))}
        </div>
        <button onClick={doDivine} className="w-full py-3.5 text-base font-semibold tracking-wider bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)] active:translate-y-0">
          ☰ 起 卦
        </button>

        {result && <DivineResultComponent result={result} />}

        <p className="text-xs text-center text-[var(--muted)] mt-3">⚠️ 易学是思维模型，不是算命。卦象是参考，不是宿命。</p>
      </div>
    </>
  )
}

function DivineResultComponent({ result }: {
  result: {
    hexName: string; changedHexName: string
    upperName: string; lowerName: string
    changedUpperName: string; changedLowerName: string
    nowDetail?: HexagramDetail; changedDetail?: HexagramDetail
    nowSymbol: string; changedSymbol: string
    movingName: string; movingChange: string
    yao6: number[]; changedYao6: number[]
    movingIndex: number
  }
}) {
  const [animating, setAnimating] = useState(false)
  const [showChanged, setShowChanged] = useState(false)
  const r = result

  const handleDemo = () => {
    if (animating) return
    setAnimating(true)
    const el = document.querySelector<HTMLDivElement>('#hex-now .yl-moving')
    if (!el) { setAnimating(false); return }
    el.classList.remove('animate-pulse')
    el.classList.add('animate-[fl_0.15s_ease-in-out_6]')
    setTimeout(() => {
      el.classList.remove('animate-[fl_0.15s_ease-in-out_6]')
      el.style.animation = 'none'
      el.classList.add(r.movingChange === '阳变阴' ? 'animate-[fy_0.7s_ease-in-out_forwards]' : 'animate-[fn_0.7s_ease-in-out_forwards]')
      setTimeout(() => {
        el.classList.remove('animate-[fy_0.7s_ease-in-out_forwards]', 'animate-[fn_0.7s_ease-in-out_forwards]')
        el.style.animation = ''
        el.className = 'rounded-sm transition-all duration-300 ' + (r.changedYao6[r.movingIndex] === 1 ? 'bg-[var(--yang)]' : '')
        if (r.changedYao6[r.movingIndex] !== 1) {
          el.style.backgroundImage = 'linear-gradient(to right, var(--yin) 0, var(--yin) 30px, transparent 30px, transparent 50px, var(--yin) 50px, var(--yin) 80px)'
        } else el.style.backgroundImage = ''
        el.style.boxShadow = '0 0 8px var(--accent)'
        setTimeout(() => el.style.boxShadow = '', 600)
        setShowChanged(true)
        setAnimating(false)
      }, 750)
    }, 1000)
  }

  return (
    <div className="mt-6 p-6 bg-[var(--bg2)] rounded-xl animate-[fadeIn_0.4s_ease]">
      <div className="flex justify-center gap-8 items-center text-center max-sm:flex-col max-sm:gap-4">
        <div className="flex-1">
          <h4 className="text-[11px] uppercase tracking-widest text-[var(--muted)] mb-2.5">本卦</h4>
          <div id="hex-now"><HexagramDisplay yao6={r.yao6} movingIndex={r.movingIndex} /></div>
          <div className="text-[22px] font-bold mt-1.5">{r.nowSymbol} {r.hexName}<br /><span className="text-sm font-normal text-[var(--muted)]">上{r.upperName} 下{r.lowerName}</span></div>
          {r.nowDetail && (
            <div className="mt-2.5 p-3 rounded-lg bg-[var(--bg3)] text-left">
              <div className="text-base font-semibold mb-1.5 text-[var(--accent2)]">{r.nowDetail.judgment}</div>
              <div className="text-xs italic text-[var(--muted)] mb-1.5">{r.nowDetail.image}</div>
              <div className="text-sm leading-relaxed">{r.nowDetail.meaning}</div>
            </div>
          )}
        </div>
        <div className="text-[28px] text-[var(--accent2)] max-sm:rotate-90">→</div>
        <div className="flex-1" style={{ opacity: showChanged ? 1 : 0.6, transition: 'opacity 0.4s ease' }}>
          <h4 className="text-[11px] uppercase tracking-widest text-[var(--muted)] mb-2.5">变卦</h4>
          <div id="hex-changed"><HexagramDisplay yao6={r.changedYao6} /></div>
          <div className="text-[22px] font-bold mt-1.5">{r.changedSymbol} {r.changedHexName}<br /><span className="text-sm font-normal text-[var(--muted)]">上{r.changedUpperName} 下{r.changedLowerName}</span></div>
          {r.changedDetail && (
            <div className="mt-2.5 p-3 rounded-lg bg-[var(--bg3)] text-left">
              <div className="text-base font-semibold mb-1.5 text-[var(--accent2)]">{r.changedDetail.judgment}</div>
              <div className="text-xs italic text-[var(--muted)] mb-1.5">{r.changedDetail.image}</div>
              <div className="text-sm leading-relaxed">{r.changedDetail.meaning}</div>
            </div>
          )}
        </div>
      </div>
      <div className="text-center mt-4 p-3 bg-[var(--bg3)] rounded-xl text-sm">
        ⚡ <strong className="text-[var(--accent2)]">{r.movingName}</strong> {r.movingChange}
        <button onClick={handleDemo} disabled={animating}
          className="inline-block ml-2 px-4 py-1 text-xs font-semibold bg-[var(--bg3)] text-[var(--accent2)] border border-[var(--border)] rounded-lg cursor-pointer transition-all duration-300 hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed align-middle"
        >
          {animating ? '⋯ 变爻中' : showChanged ? '▶ 再演一次' : '▶ 演示变爻'}
        </button>
      </div>
    </div>
  )
}
