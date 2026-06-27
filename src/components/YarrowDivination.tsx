'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { RubyText } from '@/components/Ruby'

// ─── 大衍揲蓍法 核心逻辑 ───

/** 一变的揲蓍过程 */
function yarrowBian(stalks: number): {
  taken: number
  remaining: number
  leftCount: number
  rightCount: number
  leftRemainder: number
  rightRemainder: number
  splitPoint: number
} {
  // 分二：随机分成两堆（左右至少各1）
  const splitPoint = Math.floor(Math.random() * (stalks - 2)) + 1
  const leftCount = splitPoint
  let rightCount = stalks - splitPoint

  // 挂一：从右堆取1根
  rightCount -= 1

  // 揲四（左）
  const leftRemainder = leftCount % 4 === 0 ? 4 : leftCount % 4

  // 揲四（右）
  const rightRemainder = rightCount % 4 === 0 ? 4 : rightCount % 4

  // 归奇：取走的总数 = 挂一(1) + 左余 + 右余
  const taken = 1 + leftRemainder + rightRemainder
  const remaining = stalks - taken

  return { taken, remaining, leftCount, rightCount, leftRemainder, rightRemainder, splitPoint }
}

/** 三变得一爻 */
function yarrowYao(): { value: number; label: string; bianRecords: BianRecord[] } {
  let remaining = 49
  const bianRecords: BianRecord[] = []
  for (let i = 0; i < 3; i++) {
    const r = yarrowBian(remaining)
    bianRecords.push(r)
    remaining = r.remaining
  }
  const yao = remaining / 4 // 24/4=6, 28/4=7, 32/4=8, 36/4=9
  const labels: Record<number, string> = { 6: '老阴⚋', 7: '少阳⚊', 8: '少阴⚋', 9: '老阳⚊' }
  return { value: yao, label: labels[yao] || `${yao}?`, bianRecords }
}

interface BianRecord {
  taken: number
  remaining: number
  leftCount: number
  rightCount: number
  leftRemainder: number
  rightRemainder: number
  splitPoint: number
}

// ─── 子组件：蓍草捆可视化 ───

function StalkBundle({ count, highlight, label }: {
  count: number
  highlight?: 'left' | 'right' | 'remainder' | 'selected'
  label?: string
}) {
  // 最多显示30根，超过显示数字
  const display = Math.min(count, 30)
  const overflow = count > 30 ? count - 30 : 0
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex flex-wrap justify-center gap-[2px]" style={{ maxWidth: 200 }}>
        {Array.from({ length: display }, (_, i) => {
          let bg = 'bg-[var(--yang)]'
          let opacity = 0.6
          if (highlight === 'left') { bg = 'bg-[var(--accent)]'; opacity = 0.9 }
          else if (highlight === 'right') { bg = 'bg-[var(--accent2)]'; opacity = 0.9 }
          else if (highlight === 'remainder') { bg = 'bg-[var(--accent)]'; opacity = 1 }
          else if (highlight === 'selected') { bg = 'bg-[var(--yang)]'; opacity = 1 }
          return (
            <div
              key={i}
              className={`w-[5px] h-[32px] rounded-full ${bg} transition-all duration-300`}
              style={{ opacity, transform: highlight ? 'scaleY(1.15)' : undefined }}
            />
          )
        })}
      </div>
      {overflow > 0 && (
        <span className="text-[10px] text-[var(--muted)]">+{overflow}</span>
      )}
      {label && <span className="text-[11px] text-[var(--muted)] mt-0.5">{label}</span>}
    </div>
  )
}

// ─── 主组件 ───

interface YarrowDivinationProps {
  onComplete: (yaoValues: number[]) => void
}

export default function YarrowDivination({ onComplete }: YarrowDivinationProps) {
  // ─── 状态 ───
  const [phase, setPhase] = useState<'大衍' | '用四十九' | '分二' | '挂一' | '揲左' | '归奇左' | '揲右' | '归奇右' | '变毕' | '爻成' | '爻显'>('大衍')
  const [round, setRound] = useState(0)        // 当前第几爻 (0-based)
  const [bian, setBian] = useState(0)          // 当前第几变 (0-based)
  const [remaining, setRemaining] = useState(50) // 当前剩多少根
  const [lastBianResult, setLastBianResult] = useState<BianRecord | null>(null)
  const [yaoValues, setYaoValues] = useState<number[]>([])
  const [allBianRecords, setAllBianRecords] = useState<BianRecord[][]>([])
  const [currentRoundBian, setCurrentRoundBian] = useState<BianRecord[]>([])
  const [currentYao, setCurrentYao] = useState<{ value: number; label: string } | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showStalks, setShowStalks] = useState(false)
  const [leftHighlight, setLeftHighlight] = useState(false)
  const [rightHighlight, setRightHighlight] = useState(false)
  const [remainderHighlight, setRemainderHighlight] = useState(false)
  const [doneYaoResults, setDoneYaoResults] = useState<{ value: number; label: string }[]>([])
  const [countAnimText, setCountAnimText] = useState('')
  const [stageLog, setStageLog] = useState<string[]>([])
  const divRef = useRef<HTMLDivElement>(null)
  const guaYiLockRef = useRef(false)

  const roundNames = ['初', '二', '三', '四', '五', '上']
  const bianNames = ['一', '二', '三']

  const addLog = useCallback((text: string) => {
    setStageLog(prev => [...prev, text])
  }, [])

  // 滚动到底部
  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight
    }
  }, [phase, stageLog])

  // 复位
  const doReset = useCallback(() => {
    setPhase('大衍')
    setRound(0)
    setBian(0)
    setRemaining(50)
    setLastBianResult(null)
    setYaoValues([])
    setAllBianRecords([])
    setCurrentRoundBian([])
    setCurrentYao(null)
    setIsAnimating(false)
    setShowStalks(false)
    setLeftHighlight(false)
    setRightHighlight(false)
    setRemainderHighlight(false)
    setDoneYaoResults([])
    setCountAnimText('')
    setStageLog([])
  }, [])

  // ─── 步骤推进 ───

  // 大衍之数五十
  const doStart = useCallback(() => {
    setShowStalks(true)
    setPhase('用四十九')
    addLog('🎯 大衍之数五十，其用四十有九。')
    addLog('└─ 取五十根蓍草，置一根于旁不用（象太极）。')
  }, [addLog])

  // 分而为二
  const doFenEr = useCallback(() => {
    if (remaining === 0) return
    setIsAnimating(true)
    setRemainderHighlight(false)
    setLeftHighlight(false)
    setRightHighlight(false)
    setCountAnimText('')
    addLog(`┌─ 第${bianNames[bian]}变：分而为二以象两`)

    // 分二后立即进入挂一阶段，显示分二结果
    setTimeout(() => {
      setPhase('挂一')
      addLog('├─ 挂一以象三 · 从右堆取一根置于左手小指间')
      setIsAnimating(false)
    }, 300)
  }, [bian, remaining, addLog])

  // 揲左（挂一之后）
  const doSheZuo = useCallback(() => {
    if (!lastBianResult) return
    setIsAnimating(true)
    setLeftHighlight(true)
    setPhase('归奇左')
    addLog(`├─ 揲之以四（左堆）… 左堆 ${lastBianResult.leftCount} 根`)
    setCountAnimText(`揲四…余 ${lastBianResult.leftRemainder} 根`)

    setTimeout(() => {
      addLog(`│  └─ 左堆归奇：${lastBianResult.leftRemainder} 根（象闰）`)
      setIsAnimating(false)
    }, 400)
  }, [lastBianResult, addLog])

  // 揲右
  const doSheYou = useCallback(() => {
    if (!lastBianResult) return
    setIsAnimating(true)
    setLeftHighlight(false)
    setRightHighlight(true)
    setPhase('归奇右')
    setCountAnimText(`揲四…余 ${lastBianResult.rightRemainder} 根`)
    addLog(`├─ 揲之以四（右堆剩 ${lastBianResult.rightCount} 根）…`)

    setTimeout(() => {
      addLog(`│  └─ 右堆归奇：${lastBianResult.rightRemainder} 根（象再闰）`)
      setIsAnimating(false)
    }, 400)
  }, [lastBianResult, addLog])

  // 一变完成
  const doBianDone = useCallback(() => {
    if (!lastBianResult) return
    setIsAnimating(true)
    setRightHighlight(false)
    setRemainderHighlight(true)
    setPhase('变毕')

    const taken = lastBianResult.taken
    const rem = lastBianResult.remaining
    addLog(`├─ 归奇于扐：挂一(1) + 左余(${lastBianResult.leftRemainder}) + 右余(${lastBianResult.rightRemainder}) = ${taken} 根`)

    setTimeout(() => {
      if (bian < 2) {
        // 下一变
        addLog(`└─ 第${bianNames[bian]}变毕，余 ${rem} 根（${rem}/4=${rem/4}）`)
        const nextBian = bian + 1
        setBian(nextBian)
        setRemaining(rem)
        setLastBianResult(null)
        setRemainderHighlight(false)
        setPhase('分二')
      } else {
        // 三变毕，得一爻
        const yao = rem / 4
        const labels: Record<number, string> = { 6: '老阴', 7: '少阳', 8: '少阴', 9: '老阳' }
        const yaoLabel = labels[yao]
        const yaoSymbol = yao === 6 || yao === 8 ? '⚋' : '⚊'
        addLog(`└─ ★ 三变毕：余 ${rem} 根 → ${rem}/4 = ${yao} → ${yaoLabel} ${yaoSymbol}`)
        setCurrentYao({ value: yao, label: `${yaoLabel} ${yaoSymbol}` })
        setPhase('爻成')
      }
      setIsAnimating(false)
    }, 700)
  }, [bian, lastBianResult, addLog])

  // 爻确定 → 下一爻
  const doYaoDone = useCallback(() => {
    if (!currentYao) return
    setIsAnimating(true)

    const newValues = [...yaoValues, currentYao.value]
    const newBianRecords = [...allBianRecords, [...currentRoundBian]]
    const newDoneResults = [...doneYaoResults, currentYao]

    setYaoValues(newValues)
    setAllBianRecords(newBianRecords)
    setDoneYaoResults(newDoneResults)
    setCurrentYao(null)
    setCurrentRoundBian([])
    setPhase('爻显')

    addLog(`── 第${roundNames[round]}爻得 ${currentYao.label} ──`)

    setTimeout(() => {
      if (round >= 5) {
        // 六爻全部完成
        addLog('═══════════════════════════')
        addLog('🏆 六爻皆备！卦象已成！')
        addLog(`${newValues.map(v => {
          const s = v === 6 || v === 8 ? '⚋' : '⚊'
          return v === 6 ? '⚋(老阴)' : v === 9 ? '⚊(老阳)' : v === 7 ? '⚊(少阳)' : '⚋(少阴)'
        }).join(' · ')}`)
        setTimeout(() => {
          onComplete(newValues)
        }, 600)
        return
      }

      // 下一爻
      const nextRound = round + 1
      setRound(nextRound)
      setBian(0)
      setRemaining(49)
      setLastBianResult(null)
      setPhase('分二')
      addLog(`\n── 起第${roundNames[nextRound]}爻 ──`)
      setIsAnimating(false)
    }, 1000)
  }, [currentYao, round, yaoValues, currentRoundBian, allBianRecords, doneYaoResults, addLog, onComplete, roundNames])

  // 挂一后 → 自动分二完成，准备揲左（带锁，防止无限循环）
  useEffect(() => {
    if (phase !== '挂一') {
      guaYiLockRef.current = false
      return
    }
    if (guaYiLockRef.current) return
    guaYiLockRef.current = true

    // 执行分二和挂一逻辑
    const result = yarrowBian(remaining)
    setLastBianResult(result)
    setRemaining(result.remaining)
    addLog(`├─ 分二：左 ${result.leftCount} 根，右 ${result.rightCount} 根（已挂一）`)
    setCurrentRoundBian(prev => [...prev, result])
    // 留在'挂一' 等用户点击「揲之以四（左）」，不再自动推进
  }, [phase, remaining, addLog])

  // ─── 阶段 UI（按钮固定在右上角） ───
  function phaseUI() {
    // 通用按钮样式
    const btnBase = 'px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)] active:translate-y-0 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0'

    // 大衍 — 居中展示
    if (phase === '大衍') {
      return (
        <div className="text-center p-6">
          <div className="text-5xl mb-3">🌿</div>
          <p className="text-lg font-heading text-[var(--fg)] mb-2"><RubyText text="大衍之数五十" /></p>
          <p className="text-sm text-[var(--muted)] mb-5"><RubyText text="五十根蓍草，象征天地万物之数。" /></p>
          <button onClick={doStart} className={btnBase}>
            开始揲蓍
          </button>
        </div>
      )
    }

    // 其余阶段：标题靠左，按钮右上
    const leftAttr = (title: React.ReactNode, desc: React.ReactNode) => (
      <div className="min-w-0">
        <p className="text-base font-heading text-[var(--accent2)] leading-tight">{title}</p>
        <p className="text-xs text-[var(--muted)] mt-0.5">{desc}</p>
      </div>
    )

    // 蓍草展示
    const stalksBlock = showStalks && remaining > 0 && phase !== '爻成' && phase !== '爻显' ? (
      <div className="flex justify-center py-3">
        <StalkBundle
          count={remaining}
          highlight={leftHighlight ? 'left' : rightHighlight ? 'right' : remainderHighlight ? 'remainder' : undefined}
          label={`${remaining} 根`}
        />
      </div>
    ) : null

    // 挂一展示左右两堆
    const splitBlock = lastBianResult && (phase === '挂一') ? (
      <div className="flex justify-center gap-6 mb-3">
        <div className="text-center text-xs">
          <StalkBundle count={lastBianResult.leftCount} highlight="left" label={`左堆 ${lastBianResult.leftCount}`} />
        </div>
        <div className="text-center text-xs">
          <StalkBundle count={lastBianResult.rightCount} highlight="right" label={`右堆 ${lastBianResult.rightCount}`} />
        </div>
      </div>
    ) : null

    // 操作日志
    const logBlock = stageLog.length > 0 ? (
      <div className="p-3 rounded-lg bg-[var(--bg3)] border border-[var(--border)]">
        <div className="text-[10px] text-[var(--muted)] font-semibold uppercase tracking-wider mb-1.5"><RubyText text="揲蓍录" /></div>
        <div className="space-y-0.5 max-h-[120px] overflow-y-auto thin-scroll">
          {stageLog.slice(-10).map((line, i) => (
            <div key={i} className="text-[11px] text-[var(--fg)] leading-relaxed">{line}</div>
          ))}
        </div>
      </div>
    ) : null

    // 各阶段：header bar + 内容
    const headerWithButton = (title: React.ReactNode, desc: React.ReactNode, btn: React.ReactNode) => (
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          {leftAttr(title, desc)}
          {btn}
        </div>
        {phase === '挂一' && splitBlock}
        {stalksBlock}
        {logBlock}
      </div>
    )

    const centerContent = (content: React.ReactNode) => (
      <div className="p-5 space-y-4">
        <div className="text-center">{content}</div>
        {stalksBlock}
        {logBlock}
      </div>
    )

    switch (phase) {
      case '用四十九':
        return headerWithButton(
          '其用四十有九',
          <RubyText text="置一根蓍草于旁，象征太极。" />,
          <button onClick={doFenEr} className={btnBase} disabled={isAnimating}>🌓 分而为二</button>
        )

      case '分二':
        return headerWithButton(
          <RubyText text="分而为二以象两" />,
          <RubyText text={`将 ${remaining} 根蓍草随意分成两堆，象征阴阳两仪。`} />,
          <button onClick={doFenEr} className={btnBase} disabled={isAnimating}>✋ 分二</button>
        )

      case '挂一':
        return headerWithButton(
          <RubyText text="挂一以象三" />,
          <RubyText text="从右堆取一根蓍草，夹在左手小指间。天地人三才之道。" />,
          <button onClick={doSheZuo} className={btnBase} disabled={isAnimating}>揲左</button>
        )

      case '归奇左':
        return headerWithButton(
          <RubyText text="归奇于扐以象闰" />,
          countAnimText,
          <button onClick={doSheYou} className={btnBase} disabled={isAnimating}>揲右</button>
        )

      case '归奇右':
        return headerWithButton(
          <RubyText text="再扐而后挂" />,
          countAnimText,
          <button onClick={doBianDone} className={btnBase} disabled={isAnimating}>归奇 · 定一变</button>
        )

      case '变毕':
        return lastBianResult ? centerContent(
          <p className="text-sm text-[var(--muted)]">
            取走 <span className="text-[var(--accent2)] font-semibold">{lastBianResult.taken}</span> 根，
            余 <span className="text-[var(--accent)] font-semibold">{lastBianResult.remaining}</span> 根
            {bian < 2 ? <RubyText text={`（第${bianNames[bian]}变毕）`} /> : ''}
          </p>
        ) : null

      case '爻成':
        return currentYao ? (() => {
          const btnText = round < 5 ? `定爻 · 起${roundNames[round + 1]}爻` : '六爻齐备 · 成卦！'
          return (
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                {leftAttr(<RubyText text={`${roundNames[round]}爻：${currentYao.label}`} />, <RubyText text="三变而成爻，十有八变而成卦。" />)}
                <button onClick={doYaoDone} className={btnBase} disabled={isAnimating}>{btnText}</button>
              </div>
              <div className="text-center">
                <div className="text-4xl">{currentYao.label.includes('阳') ? '⚊' : '⚋'}</div>
              </div>
              {logBlock}
            </div>
          )
        })() : null

      case '爻显':
        return centerContent(<p className="text-sm text-[var(--muted)]">爻已定 · 请稍候⋯</p>)

      default:
        return null
    }
  }

  // ─── 渲染 ───

  const isDone = yaoValues.length >= 6

  return (
    <div className="yarrow-container">
      {/* 仪式感顶栏 */}
      <div className="text-center mb-5">
        <h3 className="text-xl font-heading text-[var(--accent2)] mb-1">🌿 <RubyText text="大衍揲蓍法" /></h3>
        <p className="text-xs text-[var(--muted)] italic leading-relaxed">
          《<RubyText text="系辞" />》<RubyText text="大衍之数五十，其用四十有九。分而为二以象两，挂一以象三，揲之以四以象四时，归奇于扐以象闰，五岁再闰，故再扐而后挂。" />
        </p>
      </div>

      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-[var(--muted)] mb-1.5">
          <span><RubyText text={`第${roundNames[round]}爻 · 第${bianNames[bian]}变`} /></span>
          <span><RubyText text={`${yaoValues.length}/6 爻`} /></span>
        </div>
        <div className="flex gap-0.5 h-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-500 ${
                i < yaoValues.length
                  ? 'bg-[var(--accent)]'
                  : i === round
                    ? 'bg-[var(--accent)] opacity-50 animate-pulse'
                    : 'bg-[var(--border)]'
              }`}
            />
          ))}
        </div>
        {/* 已得爻结果 */}
        <div className="flex gap-1.5 justify-center mt-2">
          {doneYaoResults.map((y, i) => (
            <div key={i} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--bg3)] text-[10px] text-[var(--muted)]">
              <span>{roundNames[i]}</span>
              <span className="text-xs">{y.label}</span>
            </div>
          ))}
          {currentYao && (
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--accent)] text-[var(--bg)] text-[10px] font-semibold">
              <span>{roundNames[round]}</span>
              <span className="text-xs">{currentYao.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* 主交互区 */}
      <div
        ref={divRef}
        className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-h-[520px] overflow-y-auto thin-scroll"
      >
        {phaseUI()}
      </div>

      {/* 重来 */}
      {!isDone && (
        <div className="text-center mt-3">
          <button
            onClick={doReset}
            className="px-3 py-1 text-[11px] text-[var(--muted)] border border-[var(--border)] rounded-lg bg-[var(--bg2)] cursor-pointer hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors"
          >
            🔄 <RubyText text="重新开始" />
          </button>
        </div>
      )}
    </div>
  )
}
