'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { baguaMap, getHexagramName, getHexagramSymbol } from '@/data/bagua'
import { getHexagramDetail, hexagramOrder } from '@/data/hexagrams'
import { HexagramDisplay } from '@/components/Yao'
import ShareCard from '@/components/ShareCard'
import { RubyText } from '@/components/Ruby'

const STORAGE_KEY = 'bagua-daily-seen'

// 简易种子随机数 (mulberry32)
function seededRandom(seed: number) {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 日期字符串 → 数值种子
function dateSeed(): number {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

// 中国农历/公历日期格式化
function todayDateStr(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${y}年${m}月${day}日 星期${weekdays[d.getDay()]}`
}

// 从 hexagramOrder 提取 keys
const ALL_KEYS = hexagramOrder.map(([u, l]) => u + '-' + l)

export default function DailyHexagram() {
  const [dailyKey, setDailyKey] = useState<string>('')
  const [seenKeys, setSeenKeys] = useState<Set<string>>(new Set())
  const [extra, setExtra] = useState<{ key: string; idx: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  // 加载已看记录
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const arr: string[] = JSON.parse(raw)
        setSeenKeys(new Set(arr))
      }
    } catch { /* ignore */ }
    setMounted(true)
  }, [])

  // 保存已看记录
  const markSeen = useCallback((k: string) => {
    setSeenKeys(prev => {
      if (prev.has(k)) return prev
      const next = new Set(prev)
      next.add(k)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch { /* ignore */ }
      return next
    })
  }, [])

  // 日期种子 → 今日卦
  useEffect(() => {
    if (!mounted) return
    const seed = dateSeed()
    const rng = seededRandom(seed)
    const idx = Math.floor(rng() * ALL_KEYS.length)
    const k = ALL_KEYS[idx]
    setDailyKey(k)
    markSeen(k)
  }, [mounted, markSeen])

  const [picking, setPicking] = useState(false)

  // 换一卦
  const pickAnother = useCallback(() => {
    if (picking) return
    setPicking(true)
    const seed = dateSeed() + (extra ? extra.idx + 1 : 1)
    const rng = seededRandom(seed)
    const idx = Math.floor(rng() * ALL_KEYS.length)
    const k = ALL_KEYS[idx]
    setExtra({ key: k, idx: seed })
    markSeen(k)
    setTimeout(() => setPicking(false), 400)
  }, [extra, markSeen, picking])

  // 当前展示的卦 key
  const displayKey = extra ? extra.key : dailyKey

  const [upperId, lowerId] = displayKey ? displayKey.split('-') : ['', '']

  const detail = displayKey ? getHexagramDetail(upperId, lowerId) : null
  const name = displayKey ? getHexagramName(upperId, lowerId) : ''
  const symbol = displayKey ? getHexagramSymbol(upperId, lowerId) : ''
  const ud = upperId ? baguaMap[upperId] : null
  const ld = lowerId ? baguaMap[lowerId] : null

  // 从未展示过的卦
  const unseenCount = useMemo(
    () => ALL_KEYS.filter(k => !seenKeys.has(k)).length,
    [seenKeys]
  )

  if (!mounted || !displayKey) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 mb-10 animate-pulse">
        <div className="h-4 w-24 bg-[var(--bg3)] rounded mx-auto mb-4" />
        <div className="h-16 w-16 bg-[var(--bg3)] rounded mx-auto mb-4" />
        <div className="h-6 w-32 bg-[var(--bg3)] rounded mx-auto mb-6" />
        <div className="h-48 bg-[var(--bg3)] rounded" />
      </div>
    )
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 mb-10 relative overflow-hidden animate-[fadeIn_0.6s_ease]">
      {/* 装饰顶部光晕 */}
      <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-[var(--accent)]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full bg-[var(--accent2)]/5 blur-3xl pointer-events-none" />

      <div className="relative">
        {/* 标题区 */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[11px] text-[var(--muted)] uppercase tracking-[0.15em]">——</span>
            <span className="text-[13px] text-[var(--accent2)] font-semibold tracking-[0.1em]">
              每日一卦
            </span>
            <span className="text-[11px] text-[var(--muted)] uppercase tracking-[0.15em]">——</span>
          </div>
          <time className="text-xs text-[var(--muted)] block">{todayDateStr()}</time>
        </div>

        {/* 卦象区 */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[28px] leading-none select-none">{symbol}</span>
            <h3 className="text-[28px] font-bold tracking-wider font-heading">
              <RubyText text={name} />
            </h3>
          </div>
          <HexagramDisplay yao6={
            (() => {
              if (!ud || !ld) return [1,1,1,1,1,1]
              // yao6 = [上卦倒序..., 下卦倒序...]
              const uy = [...ud.yao].reverse()
              const ly = [...ld.yao].reverse()
              return [...uy, ...ly]
            })()
          } />
        </div>

        {/* 卦辞 */}
        {detail && (
          <div className="mt-4 space-y-4">
            {/* 卦辞 */}
            <div className="p-5 rounded-xl bg-[var(--bg2)] border-l-[3px] border-[var(--accent)]">
              <div className="text-[10px] text-[var(--muted)] uppercase tracking-[0.12em] mb-1.5 font-semibold">卦辞</div>
              <div className="text-base font-semibold text-[var(--accent2)] leading-relaxed">
                <RubyText text={detail.judgment} />
              </div>
            </div>
            {/* 象辞 */}
            <div className="p-5 rounded-xl bg-[var(--bg2)] border-l-[3px] border-[var(--accent2)]">
              <div className="text-[10px] text-[var(--muted)] uppercase tracking-[0.12em] mb-1.5 font-semibold">象辞</div>
              <div className="text-sm italic text-[var(--fg)] leading-relaxed">
                <RubyText text={detail.image} />
              </div>
            </div>

            {/* 现代解读 */}
            <div className="p-5 rounded-xl bg-[var(--bg3)]">
              <div className="text-[10px] text-[var(--muted)] uppercase tracking-[0.12em] mb-1.5 font-semibold">现代解读</div>
              <div className="text-sm leading-[1.75] text-[var(--fg)]">
                <RubyText text={detail.meaning} />
              </div>
            </div>

            {/* 上下卦信息 */}
            {ud && ld && (
              <div className="flex justify-center gap-4 text-xs text-[var(--muted)] pt-1">
                <span>
                  上 <strong className="text-[var(--fg)]"><RubyText text={ud.name} /></strong>（{ud.symbol}）· {ud.nature}
                </span>
                <span className="text-[var(--border)]">|</span>
                <span>
                  下 <strong className="text-[var(--fg)]"><RubyText text={ld.name} /></strong>（{ld.symbol}）· {ld.nature}
                </span>
              </div>
            )}
          </div>
        )}

        {/* 操作区 */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-[var(--border)]">
          <button
            onClick={pickAnother}
            disabled={picking}
            className={`px-5 py-2 rounded-xl text-sm font-semibold border cursor-pointer transition-all duration-200 flex items-center gap-2 ${
              picking
                ? 'border-[var(--border)] bg-[var(--bg3)] text-[var(--muted)]'
                : 'border-[var(--border)] bg-[var(--bg2)] text-[var(--fg)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 hover:-translate-y-0.5'
            }`}
          >
            <span className={`inline-block transition-transform duration-300 ${picking ? 'animate-spin' : ''}`}>🔄</span>
            换一卦
          </button>

          {/* 探索进度 */}
          <div className="text-[11px] text-[var(--muted)]">
            {unseenCount === 0 ? (
              <span className="text-[var(--accent2)] font-semibold">🎉 六十四卦全阅！</span>
            ) : (
              <>
                已阅 <strong className="text-[var(--accent2)]">{seenKeys.size}</strong> / 64 卦
                <span className="ml-0.5">· 还有 <strong className="text-[var(--accent)]">{unseenCount}</strong> 卦未读</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
