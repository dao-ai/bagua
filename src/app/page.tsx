'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import Modal from '@/components/Modal'
import { YaoDisplay, HexagramDisplay } from '@/components/Yao'
import { baguaList, baguaMap, numToBagua, getHexagramName, getHexagramSymbol, type Bagua, type HexagramDetail } from '@/data/bagua'
import { getHexagramDetail, hexagramOrder } from '@/data/hexagrams'

// ===== 工具函数 =====
function fmtBaguaInfo(b: Bagua) {
  return [
    ['自然', b.nature], ['属性', b.attribute], ['家庭', b.family],
    ['动物', b.animal], ['身体', b.body], ['方向', b.direction],
    ['季节', b.season], ['关键词', b.keywords.join(' · ')],
  ]
}

// ===== 主页面 =====
export default function Home() {
  const [tab, setTab] = useState('home')
  const [modal, setModal] = useState<React.ReactNode | null>(null)

  // ===== 八卦详情弹窗 =====
  const openBagua = useCallback((b: Bagua) => {
    setModal(
      <div>
        <div className="text-[60px] text-center block">{b.symbol}</div>
        <h2 className="text-center text-2xl mt-1.5 mb-0.5">{b.name}</h2>
        <p className="text-center text-sm text-[var(--muted)]">{b.pinyin}</p>
        <p className="text-center text-sm text-[var(--accent2)] my-3 leading-relaxed">{b.description}</p>
        <YaoDisplay yao={b.yao} big />
        <div className="grid grid-cols-2 gap-2 mt-4">
          {fmtBaguaInfo(b).map(([k, v]) => (
            <div key={k} className="p-2.5 rounded-xl bg-[var(--bg3)] text-sm flex flex-col gap-0.5">
              <span className="text-[11px] text-[var(--muted)]">{k}</span>
              <span className="font-semibold text-[var(--fg)]">{v}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }, [])

  // ===== 六十四卦详情弹窗 =====
  const openHexagram = useCallback((upperId: string, lowerId: string) => {
    const name = getHexagramName(upperId, lowerId)
    const detail = getHexagramDetail(upperId, lowerId)
    const u = baguaMap[upperId], l = baguaMap[lowerId]
    const sym = getHexagramSymbol(upperId, lowerId)
    setModal(
      <div>
        <div className="text-[60px] text-center block">{sym}</div>
        <h2 className="text-center text-2xl mt-1.5 mb-0.5">{name}</h2>
        <p className="text-center text-sm text-[var(--muted)]">上{u.name}（{u.symbol}）· 下{l.name}（{l.symbol}）</p>
        {detail ? (
          <div className="mt-6 p-5 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--accent)]">
            <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">卦辞</div>
            <div className="text-base font-semibold mb-2 text-[var(--accent2)]">{detail.judgment}</div>
            <div className="text-sm italic text-[var(--muted)] mb-2">{detail.image}</div>
            <div className="text-sm leading-relaxed">{detail.meaning}</div>
          </div>
        ) : <p className="text-center text-[var(--muted)] mt-6">解读待补充</p>}
      </div>
    )
  }, [])

  // ===== 关闭弹窗 =====
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null) }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <div className="max-w-[960px] mx-auto px-5">
      <Header activeTab={tab} onTabChange={setTab} />

      {/* ===== 八卦页 ===== */}
      {tab === 'home' && (
        <div className="py-8">
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
                onClick={() => openBagua(b)}
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
        </div>
      )}

      {/* ===== 二进制页 ===== */}
      {tab === 'binary' && (
        <div className="py-8">
          <div className="text-center pb-6">
            <h2 className="text-[26px] mb-1.5">二进制 · 八卦对照</h2>
            <p className="text-sm text-[var(--muted)] max-w-[520px] mx-auto">阳为 1，阴为 0，从下往上读。莱布尼茨受此启发发明了二进制。</p>
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
                {[...baguaList].sort((a, b) => b.decimal - a.decimal).map(b => (
                  <tr key={b.id} className="hover:bg-[var(--bg2)] transition-colors">
                    <td className="p-3.5 text-center border-b border-[var(--border)]"><YaoDisplay yao={b.yao} /></td>
                    <td className="p-3.5 text-center text-[28px] border-b border-[var(--border)]">{b.symbol}</td>
                    <td className="p-3.5 text-center font-semibold text-base border-b border-[var(--border)]">{b.name} <span className="text-xs font-normal text-[var(--muted)]">{b.pinyin}</span></td>
                    <td className="p-3.5 text-center font-mono text-base tracking-widest text-[var(--accent2)] border-b border-[var(--border)]">{b.binary}</td>
                    <td className="p-3.5 text-center font-bold text-lg border-b border-[var(--border)]">{b.decimal}</td>
                    <td className="p-3.5 text-center text-[13px] text-[var(--muted)] border-b border-[var(--border)]">{b.keywords.join(' · ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-center text-[var(--muted)] mt-3">💡 从 <strong className="text-[var(--accent2)]">7 → 0</strong>，步进 -1，正是八卦的先天数排列规律</p>
        </div>
      )}

      {/* ===== 六十四卦页 ===== */}
      {tab === 'hexagrams' && (
        <div className="py-8">
          <div className="text-center pb-6">
            <h2 className="text-[26px] mb-1.5">六十四卦</h2>
            <p className="text-sm text-[var(--muted)] max-w-[520px] mx-auto">八卦两两相叠，成六十四卦。点击任一卦，查看卦辞与解读。</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-2.5">
            {hexagramOrder.map(([u, l]) => {
              const name = getHexagramName(u, l)
              const detail = getHexagramDetail(u, l)
              const sym = getHexagramSymbol(u, l)
              const ud = baguaMap[u], ld = baguaMap[l]
              return (
                <div
                  key={u + l}
                  onClick={() => openHexagram(u, l)}
                  className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 cursor-pointer transition-all duration-300 flex items-center gap-2.5 hover:border-[var(--accent)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_var(--shadow)]"
                >
                  <div className="text-[26px] shrink-0">{sym}</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm">{name} <span className="font-normal text-[11px] text-[var(--muted)]">上{ud.name}下{ld.name}</span></div>
                    <div className="text-[11px] text-[var(--accent2)] mt-0.5 truncate">{detail?.judgment}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ===== 起卦页 ===== */}
      {tab === 'divine' && <DivinePage />}

      {/* ===== 弹窗 ===== */}
      <Modal open={!!modal} onClose={() => setModal(null)}>
        {modal}
      </Modal>
    </div>
  )
}

// ===== 起卦页面组件 =====
function DivinePage() {
  const [n1, setN1] = useState('')
  const [n2, setN2] = useState('')
  const [n3, setN3] = useState('')

  // 起卦逻辑
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

  const [animating, setAnimating] = useState(false)

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
    const cy6 = [...y6]
    cy6[mi] = cy6[mi] === 1 ? 0 : 1
    const cuy = cy6.slice(0, 3).reverse(), cly = cy6.slice(3, 6).reverse()
    const cui = baguaList.find(b => b.yao[0]===cuy[0] && b.yao[1]===cuy[1] && b.yao[2]===cuy[2])?.id
    const cli = baguaList.find(b => b.yao[0]===cly[0] && b.yao[1]===cly[1] && b.yao[2]===cly[2])?.id
    if (!cui || !cli) return
    const chn = getHexagramName(cui, cli)
    const cd = getHexagramDetail(cui, cli)
    const cub = baguaMap[cui], clb = baguaMap[cli]
    const ns = getHexagramSymbol(ui, li)
    const cs = getHexagramSymbol(cui, cli)
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
    setAnimating(false)
  }, [n1, n2, n3])

  return (
    <div className="py-8">
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
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const inputs = document.querySelectorAll('.divine-input')
                  if (i < 2) (inputs[i+1] as HTMLInputElement)?.focus()
                  else doDivine()
                }
              }}
              placeholder={['如 3', '如 5', '如 8'][i]}
              className="divine-input w-20 p-2.5 text-center bg-[var(--bg3)] border border-[var(--border)] rounded-xl text-[var(--fg)] text-xl font-semibold outline-none transition-all duration-300 caret-[var(--accent)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--glow)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          ))}
        </div>
        <button
          onClick={doDivine}
          className="w-full py-3.5 text-base font-semibold tracking-wider bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)] active:translate-y-0"
        >
          ☰ 起 卦
        </button>

        {/* 结果 */}
        {result && <DivineResult result={result} />}

        <p className="text-xs text-center text-[var(--muted)] mt-3">⚠️ 易学是思维模型，不是算命。卦象是参考，不是宿命。</p>
      </div>
    </div>
  )
}

// ===== 起卦结果 =====
interface DivineResultData {
  hexName: string; changedHexName: string
  upperName: string; lowerName: string
  changedUpperName: string; changedLowerName: string
  nowDetail?: HexagramDetail; changedDetail?: HexagramDetail
  nowSymbol: string; changedSymbol: string
  movingName: string; movingChange: string
  yao6: number[]; changedYao6: number[]
  movingIndex: number
}

function DivineResult({ result }: { result: DivineResultData }) {
  const [animating, setAnimating] = useState(false)
  const r = result
  const [showChanged, setShowChanged] = useState(false)

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
        } else {
          el.style.backgroundImage = ''
        }
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
            <div className="mt-2.5 p-3 rounded-lg bg-[var(--bg2)] border-none text-left">
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
            <div className="mt-2.5 p-3 rounded-lg bg-[var(--bg2)] border-none text-left">
              <div className="text-base font-semibold mb-1.5 text-[var(--accent2)]">{r.changedDetail.judgment}</div>
              <div className="text-xs italic text-[var(--muted)] mb-1.5">{r.changedDetail.image}</div>
              <div className="text-sm leading-relaxed">{r.changedDetail.meaning}</div>
            </div>
          )}
        </div>
      </div>
      <div className="text-center mt-4 p-3 bg-[var(--bg3)] rounded-xl text-sm">
        ⚡ <strong className="text-[var(--accent2)]">{r.movingName}</strong> {r.movingChange}
        <button
          onClick={handleDemo}
          disabled={animating}
          className="inline-block ml-2 px-4 py-1 text-xs font-semibold bg-[var(--bg3)] text-[var(--accent2)] border border-[var(--border)] rounded-lg cursor-pointer transition-all duration-300 hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed align-middle"
        >
          {animating ? '⋯ 变爻中' : showChanged ? '▶ 再演一次' : '▶ 演示变爻'}
        </button>
      </div>
    </div>
  )
}
