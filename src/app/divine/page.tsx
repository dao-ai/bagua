'use client'
import usePageTitle from '@/hooks/usePageTitle'

import { useState, useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import PageHeader from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const YarrowDivination = dynamic(() => import('@/components/YarrowDivination'), {
  loading: () => <Card className="h-40 animate-pulse" />,
})
import Coin from '@/components/Coin'
import { baguaMap, numToBagua, computeHexagramChange, computeHexagramChangeMulti } from '@/data/bagua'
import { movingKeysFromSums } from '@/data/divination'
import { getHexagramDetail } from '@/data/hexagrams'
import type { DivineResult } from '@/hooks/divineTypes'
import { useDivineHistory, resultToRecord } from '@/hooks/useDivineHistory'
import DivineResultView from '@/components/DivineResult'

interface CoinToss {
  values: number[]
  sum: number
  yao: number
  changing: boolean
}

function tossCoins(): CoinToss {
  const values = Array.from({length: 3}, () => Math.random() < 0.5 ? 3 : 2)
  const sum = values.reduce((a, b) => a + b, 0)
  const yao = sum === 6 || sum === 8 ? 0 : 1
  const changing = sum === 6 || sum === 9
  return { values, sum, yao, changing }
}

export default function DivinePage() {
  usePageTitle()
  const { addRecord } = useDivineHistory()
  const savedRef = useRef(false)
  const [method, setMethod] = useState<'number' | 'coin' | 'yarrow'>('coin')
  const [n1, setN1] = useState('')
  const [n2, setN2] = useState('')
  const [n3, setN3] = useState('')
  const [result, setResult] = useState<DivineResult | null>(null)
  const [tosses, setTosses] = useState<CoinToss[]>([])
  const [tossing, setTossing] = useState(false)

  const doNumberDivine = useCallback(() => {
    const a = parseInt(n1), b = parseInt(n2), c = parseInt(n3)
    if (isNaN(a) || isNaN(b) || isNaN(c)) { setResult(null); return }
    const uk = a % 8, lk = b % 8, mk = c % 6 || 6
    const ui = numToBagua[uk], li = numToBagua[lk]
    if (!ui || !li) { setResult(null); return }
    const ub = baguaMap[ui], lb = baguaMap[li]
    const y6 = [...ub.yao.slice().reverse(), ...lb.yao.slice().reverse()]
    try { setResult(computeHexagramChange(y6, mk, getHexagramDetail)) } catch { setResult(null) }
  }, [n1, n2, n3])

  const doCoinToss = useCallback(() => {
    if (tossing) return
    setTossing(true)
    setTimeout(() => {
      setTosses(prev => [...prev, tossCoins()])
      setTossing(false)
    }, 400)
  }, [tossing])

  useEffect(() => {
    if (tosses.length === 6) {
      const y6 = tosses.map(t => t.yao).reverse()
      // 收集全部变爻：六爻皆静时不强行造变卦
      const keys = movingKeysFromSums(tosses.map(t => t.sum))
      try { setResult(computeHexagramChangeMulti(y6, keys, getHexagramDetail)) } catch {}
    }
  }, [tosses])

  // 自动保存起卦历史
  useEffect(() => {
    if (result && !savedRef.current) {
      savedRef.current = true
      addRecord(resultToRecord(result, method))
    }
    if (!result) savedRef.current = false
  }, [result, method, addRecord])

  const resetCoins = () => { setTosses([]); setResult(null) }

  const handleMethodChange = (v: string) => {
    setMethod(v as typeof method)
    setResult(null)
  }

  return (
    <>
      <PageHeader title="起卦" subtitle="心里想一件事，选择一种方式起卦。" />

      <Tabs value={method} onValueChange={handleMethodChange}
        className="max-w-[500px] mx-auto"
        data-mcp-action="select-divination-method"
        data-mcp-description="选择起卦方式：金钱起卦（抛6次铜钱）、数字起卦（输入3个数字）、或大衍揲蓍法（18步蓍草交互）"
        data-mcp-params='{"required": ["method"]}'
      >
        <TabsList className="w-full mb-5">
          <TabsTrigger value="coin"
            data-mcp-param="method"
            data-mcp-description="金钱起卦：抛6次铜钱，每次三枚，正面3反面2，累计得出卦象"
            data-mcp-param-value="coin"
          >🪙 金钱起卦</TabsTrigger>
          <TabsTrigger value="number"
            data-mcp-param="method"
            data-mcp-description="数字起卦：输入3个数字，第一个定上卦，第二个定下卦，第三个定动爻"
            data-mcp-param-value="number"
          >🔢 数字起卦</TabsTrigger>
          <TabsTrigger value="yarrow"
            data-mcp-param="method"
            data-mcp-description="大衍揲蓍法：用50根蓍草，经过「分二·挂一·揲四·归奇」三变得一爻，六爻共十八变后成卦。最古老的筮法，载于《系辞》。"
            data-mcp-param-value="yarrow"
          >🌿 大衍揲蓍</TabsTrigger>
        </TabsList>

        {/* ===== 金钱起卦 ===== */}
        <TabsContent value="coin">
          <Card
            data-mcp-action="divine-by-coins"
            data-mcp-description="金钱起卦：点击抛铜钱按钮，每次抛3枚。共需抛6次（初爻到上爻），完成后自动生成卦象。正面=3反面=2，老阳/老阴为变爻。"
            data-mcp-params='{"required": [], "optional": []}'
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base mb-0.5">🪙 抛铜钱</h3>
                  <p className="text-xs text-[var(--muted)]">正=3 反=2 · 共抛六次</p>
                </div>
                {tosses.length < 6 ? (
                  <Button onClick={doCoinToss} disabled={tossing}
                    data-mcp-action="toss-coins"
                    data-mcp-description="抛一次铜钱，三枚。需要连续抛6次完成起卦。"
                    className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] border-none hover:from-[var(--accent2)] hover:to-[var(--accent)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)] transition-all shrink-0"
                  >
                    {tossing ? '⋯ 抛掷中' : `抛第${['一','二','三','四','五','六'][tosses.length]}爻`}
                  </Button>
                ) : (
                  <Button variant="outline" onClick={resetCoins}
                    data-mcp-action="reset-coin-divination"
                    data-mcp-description="清空当前抛铜钱结果，重新起卦"
                    className="shrink-0"
                  >
                    🔄 重来
                  </Button>
                )}
              </div>

              {/* 进度点 */}
              <div className="flex gap-1 justify-center mb-4"
                data-mcp-param="divination-progress"
                data-mcp-description="起卦进度：6个爻位，已完成数和当前步骤"
              >
                {Array.from({length: 6}, (_, i) => (
                  <div key={i}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-all ${
                      i < tosses.length
                        ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]'
                        : i === tosses.length
                          ? 'bg-[var(--bg3)] text-[var(--accent2)] border-[var(--accent)] animate-pulse'
                          : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)]'
                    }`}>
                    {['初','二','三','四','五','上'][i]}
                  </div>
                ))}
              </div>

              {/* 铜钱展示 */}
              {tosses.length < 6 && (
                <div className="flex justify-center gap-4 mb-4">
                  {tosses.length === 0
                    ? [0,1,2].map(i => <Coin key={i} face="back" size={72} />)
                    : tossing
                      ? [0,1,2].map(i => <Coin key={i} face={i % 2 === 0 ? 'front' : 'back'} size={72} flipping />)
                      : (() => {
                          const last = tosses[tosses.length - 1]
                          return last.values.map((v, i) => (
                            <Coin key={i} face={v === 3 ? 'front' : 'back'} size={72} />
                          ))
                        })()
                  }
                </div>
              )}

              {/* 已抛结果 */}
              {tosses.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-2">
                  {tosses.map((t, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg3)]"
                      data-mcp-param={`result-yao-${i}`}
                      data-mcp-description={`第${['初','二','三','四','五','上'][i]}爻结果`}
                    >
                      <span className="text-[10px] text-[var(--muted)]">{['初','二','三','四','五','上'][i]}</span>
                      <div className={`w-12 h-1.5 rounded-sm ${t.yao === 1 ? 'bg-[var(--yang)]' : ''}`}
                        style={{ backgroundImage: t.yao === 1 ? undefined :
                          'linear-gradient(to right, var(--yin) 0, var(--yin) 18px, transparent 18px, transparent 30px, var(--yin) 30px, var(--yin) 48px)'}}
                      />
                      <span className="text-[10px] text-[var(--muted)]">
                        {t.changing ? (t.yao === 1 ? '老阳' : '老阴') : (t.yao === 1 ? '少阳' : '少阴')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== 数字起卦 ===== */}
        <TabsContent value="number">
          <Card
            data-mcp-action="divine-by-numbers"
            data-mcp-description="用三个数字起卦。输入3个数字，第一个定上卦（余数0=坤），第二个定下卦，第三个数定动爻（余数0=上爻）。"
            data-mcp-params='{"required": ["num1", "num2", "num3"]}'
          >
            <CardContent className="p-8">
              <h3 className="text-center text-lg mb-1">✍️ 输入三个数字</h3>
              <p className="text-center text-sm text-[var(--muted)] mb-5">第一个数定上卦 · 第二个数定下卦 · 第三个数定动爻</p>
              <div className="flex gap-3 justify-center mb-5">
                {[n1, n2, n3].map((v, i) => (
                  <Input key={i} type="number" value={v}
                    data-mcp-param={['num1', 'num2', 'num3'][i]}
                    data-mcp-description={['第一个数定上卦', '第二个数定下卦', '第三个数定动爻'][i]}
                    onChange={e => [setN1, setN2, setN3][i](e.target.value)}
                    placeholder={['如 3', '如 5', '如 8'][i]}
                    className="w-20 text-center text-xl font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                ))}
              </div>
              <Button onClick={doNumberDivine}
                data-mcp-action="divine-by-numbers-submit"
                data-mcp-description="点击按钮用三个数字起卦，自动生成本卦和变卦。"
                size="lg"
                className="w-full font-semibold tracking-wider bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] border-none hover:from-[var(--accent2)] hover:to-[var(--accent)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)] transition-all"
              >
                ☰ 起 卦
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== 大衍揲蓍法 ===== */}
        <TabsContent value="yarrow"
          data-mcp-action="divine-by-yarrow"
          data-mcp-description="大衍揲蓍法：最古老的起卦方法。点击「开始揲蓍」进入交互流程，依次进行分二、挂一、揲四、归奇，三变得一爻，六爻共十八变后自动生成本卦和变卦。"
        >
          <YarrowDivination
            onComplete={(yaoValues) => {
              const y6: number[] = []
              yaoValues.forEach(v => {
                y6.unshift(v === 6 || v === 8 ? 0 : 1)
              })
              const keys = movingKeysFromSums(yaoValues)
              try { setResult(computeHexagramChangeMulti(y6, keys, getHexagramDetail)) } catch { setResult(null) }
            }}
          />
        </TabsContent>
      </Tabs>

      {/* ===== 卦象结果 ===== */}
      {result && (
        <div className="max-w-[700px] mx-auto">
          <DivineResultView result={result} />
        </div>
      )}

      <p className="text-xs text-center text-[var(--muted)] mt-5">⚠️ 易学是思维模型，不是算命。卦象是参考，不是宿命。</p>
    </>
  )
}
