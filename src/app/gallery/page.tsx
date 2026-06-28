'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { fuxiOrderedHexagrams } from '@/data/fuxi'
import {
  baguaMap,
  getHexagramName,
  getHexagramSymbol,
} from '@/data/bagua'
import { getHexagramDetail } from '@/data/hexagrams'
import type { FuxiHexagram } from '@/data/fuxi'
import type { YaoLine } from '@/data/bagua'
import usePageTitle from '@/hooks/usePageTitle'

// ─── 太极阴阳鱼 SVG ─────────────────────────────────────────────
function TaiChi({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="tcHalf">
          <rect x="60" y="0" width="60" height="120" />
        </clipPath>
      </defs>
      {/* 外圈 */}
      <circle cx="60" cy="60" r="58" fill="none" stroke="var(--yang)" strokeWidth="1.5" opacity="0.3" />
      {/* 大圆黑白 */}
      <circle cx="60" cy="60" r="58" fill="#0b1120" />
      <circle cx="60" cy="60" r="58" fill="var(--yang)" clipPath="url(#tcHalf)" opacity="0.3" />
      {/* S 形分割 */}
      <path d="M 60 2 A 29 29 0 0 1 60 60 A 29 29 0 0 0 60 118" fill="var(--yang)" opacity="0.3" />
      {/* 两点 */}
      <circle cx="60" cy="30" r="7" fill="#0b1120" />
      <circle cx="60" cy="90" r="7" fill="var(--yang)" opacity="0.3" />
    </svg>
  )
}

// ─── 爻线组件（大号） ────────────────────────────────────────────
function YaoBar({ yang, index }: { yang: boolean; index: number }) {
  return (
    <div
      className="yao-bar rounded-sm"
      style={{
        width: 'clamp(160px, 30vw, 360px)',
        height: 'clamp(6px, 1.2vw, 12px)',
        background: yang
          ? 'var(--yang)'
          : `linear-gradient(to right, var(--yin) 0, var(--yin) calc(37.5%), transparent calc(37.5%), transparent calc(62.5%), var(--yin) calc(62.5%), var(--yin) 100%)`,
        animationDelay: `${(5 - index) * 0.09}s`,
      }}
    />
  )
}

// ─── 六爻展示 ────────────────────────────────────────────────────
function YaoHexagram({ yao6 }: { yao6: number[] }) {
  return (
    <div className="flex flex-col items-center gap-[clamp(4px,0.8vw,8px)] my-6 sm:my-8">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <YaoBar key={i} yang={yao6[i] === 1} index={i} />
      ))}
    </div>
  )
}

// ─── 卦名显示（带拼音） ──────────────────────────────────────────
function HexagramName({ name, pinyin }: { name: string; pinyin: string }) {
  return (
    <div className="text-center mb-3 sm:mb-4">
      <div className="text-[clamp(28px,5vw,56px)] font-heading font-bold tracking-wider text-[var(--yang)] nama-glow">
        {name}
      </div>
      <div className="text-[clamp(12px,2vw,20px)] text-[var(--muted)] font-heading italic tracking-[0.15em] opacity-60">
        {pinyin}
      </div>
    </div>
  )
}

// ─── 包含上下八卦的标注 ────────────────────────────────────────────
function BaguaLabels({ upperId, lowerId }: { upperId: string; lowerId: string }) {
  const u = baguaMap[upperId]
  const l = baguaMap[lowerId]
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5 text-[clamp(11px,1.5vw,15px)] text-[var(--muted)] opacity-50">
      <span>上{l.symbol}{l.name} · {l.nature}</span>
      <span className="text-[var(--yang)] opacity-30">↓</span>
      <span>下{u.symbol}{u.name} · {u.nature}</span>
    </div>
  )
}

// ─── 卦辞/象辞/义理解读 ───────────────────────────────────────────
function HexagramTexts({ upperId, lowerId }: { upperId: string; lowerId: string }) {
  const detail = getHexagramDetail(upperId, lowerId)
  if (!detail) return null
  return (
    <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 max-w-[520px] mx-auto px-4">
      <div className="p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest mb-0.5 opacity-60">卦辞</div>
        <div className="text-[clamp(13px,1.8vw,17px)] font-heading font-semibold text-[var(--accent2)] leading-relaxed">
          {detail.judgment}
        </div>
      </div>
      <div className="p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest mb-0.5 opacity-60">象辞</div>
        <div className="text-[clamp(12px,1.6vw,15px)] italic text-[var(--fg)] leading-relaxed opacity-80">
          {detail.image}
        </div>
      </div>
      <div className="p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest mb-0.5 opacity-60">释义</div>
        <div className="text-[clamp(12px,1.5vw,14px)] leading-relaxed text-[var(--fg)] opacity-70">
          {detail.meaning}
        </div>
      </div>
    </div>
  )
}

// ─── 爻辞列表 ────────────────────────────────────────────────────
function YaoList({ upperId, lowerId }: { upperId: string; lowerId: string }) {
  const detail = getHexagramDetail(upperId, lowerId)
  if (!detail?.yaoLines) return null
  const positions = ['初', '二', '三', '四', '五', '上']
  return (
    <div className="mt-3 sm:mt-4 max-w-[520px] mx-auto px-4">
      <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest mb-2 text-center opacity-50">爻辞</div>
      <div className="flex flex-col gap-1.5">
        {detail.yaoLines.map((yl, i) => (
          <div key={i} className="flex items-start gap-2 text-[clamp(11px,1.3vw,13px)] leading-relaxed opacity-60 hover:opacity-90 transition-opacity">
            <span className="text-[var(--yang)] font-semibold shrink-0 w-[clamp(28px,3vw,36px)] text-right">
              {positions[i]}{yl.pos.includes('九') ? '九' : '六'}
            </span>
            <span className="text-[var(--fg)]">{yl.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 主页面 ──────────────────────────────────────────────────────
export default function GalleryPage() {
  usePageTitle('卦象画廊 · 禅意模式')

  const hexagrams = fuxiOrderedHexagrams // 64 卦，伏羲序

  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [showInfo, setShowInfo] = useState(true)
  const [entering, setEntering] = useState(false)
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartRef = useRef<number | null>(null)

  const current: FuxiHexagram = hexagrams[currentIndex]

  // 计算卦的序号显示（文王序 1-64）
  const wangOrder = currentIndex + 1

  // 切换卦象
  const goTo = useCallback((index: number) => {
    setEntering(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCurrentIndex(((index % 64) + 64) % 64)
        setEntering(false)
      })
    })
  }, [])

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])

  // 自动轮播
  useEffect(() => {
    if (!autoPlay) {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current)
        autoTimerRef.current = null
      }
      return
    }
    autoTimerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % 64)
    }, 8000)
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current)
    }
  }, [autoPlay])

  // 键盘事件
  // 锁定body滚动（画廊全屏）
  useEffect(() => {
    const orig = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    return () => {
      document.body.style.overflow = orig
      document.body.style.overscrollBehavior = ''
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prev()
      } else if (e.key === ' ') {
        e.preventDefault()
        setShowInfo(s => !s)
      } else if (e.key === 'a' || e.key === 'A') {
        setAutoPlay(a => !a)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  // 触摸滑动
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return
    const diff = e.changedTouches[0].clientX - touchStartRef.current
    touchStartRef.current = null
    if (Math.abs(diff) > 50) {
      if (diff > 0) prev()
      else next()
    }
  }

  // 点击切换信息/自动
  const toggleAuto = () => setAutoPlay(a => !a)
  const toggleInfo = () => setShowInfo(s => !s)

  if (!current) return null

  const hexagramName = getHexagramName(current.upperId, current.lowerId)
  const hexagramSym = getHexagramSymbol(current.upperId, current.lowerId)

  return (
    <div
      className="gallery-root fixed inset-0 overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ background: '#060a18' }}
    >
      {/* ─── 背景光晕 ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, var(--yang) 0%, transparent 70%)',
            transition: 'all 1.5s ease',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, var(--accent2) 0%, transparent 70%)',
            transition: 'all 1.5s ease',
          }}
        />
      </div>

      {/* ─── 太极阴阳鱼 ─── */}
      <div className="absolute top-6 right-6 sm:top-10 sm:right-10 opacity-[0.07] pointer-events-none">
        <TaiChi className="w-[clamp(48px,8vw,100px)] h-[clamp(48px,8vw,100px)] tai-chi-spin" />
      </div>

      <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 opacity-[0.05] pointer-events-none">
        <TaiChi className="w-[clamp(36px,6vw,80px)] h-[clamp(36px,6vw,80px)] tai-chi-spin-reverse" />
      </div>

      {/* ─── 主内容（可滚动 + 底部避开导航栏）─── */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 pt-16 pb-[200px] overflow-y-auto transition-opacity duration-600 ${
          entering ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* 序号 */}
        <div className="text-[clamp(10px,1.2vw,14px)] text-[var(--muted)] opacity-30 tracking-[0.3em] mb-2 sm:mb-3 font-mono">
          #{wangOrder.toString().padStart(2, '0')} — {hexagramSym}
        </div>

        {/* 卦名 + 拼音 */}
        <HexagramName name={hexagramName} pinyin={current.name} />

        {/* 六爻 */}
        <YaoHexagram yao6={current.yaoLines} />

        {/* 上下卦提示 */}
        <BaguaLabels upperId={current.upperId} lowerId={current.lowerId} />

        {/* 详细文字信息（可折叠） */}
        {showInfo && (
          <div className="gallery-info-enter w-full">
            <HexagramTexts upperId={current.upperId} lowerId={current.lowerId} />
            <YaoList upperId={current.upperId} lowerId={current.lowerId} />
          </div>
        )}
      </div>

      {/* ─── 导航控件 ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-4 sm:gap-6 pb-[env(safe-area-inset-bottom,12px)] pb-4 pt-4 sm:pb-6 sm:pt-6 bg-gradient-to-t from-[#060a18] via-[#060a18]/90 to-transparent pointer-events-none">
        {/* 左翻页 */}
        <button
          onClick={prev}
          className="pointer-events-auto w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[var(--muted)] hover:text-[var(--yang)] hover:border-[var(--yang)] hover:bg-white/10 flex items-center justify-center cursor-pointer transition-all text-lg sm:text-xl active:scale-90"
          aria-label="上一卦"
        >
          ◀
        </button>

        {/* 自动播放切换 */}
        <button
          onClick={toggleAuto}
          className={`pointer-events-auto px-4 sm:px-6 h-11 sm:h-13 rounded-full border backdrop-blur-md flex items-center justify-center cursor-pointer transition-all text-xs sm:text-sm tracking-wider gap-2 ${
            autoPlay
              ? 'border-[var(--yang)]/30 bg-[var(--yang)]/10 text-[var(--yang)]'
              : 'border-white/10 bg-white/5 text-[var(--muted)]'
          }`}
          aria-label="切换自动播放"
        >
          <span>{autoPlay ? '⏸' : '▶'}</span>
          <span className="hidden sm:inline">{autoPlay ? '自动' : '手动'}</span>
        </button>

        {/* 信息切换 */}
        <button
          onClick={toggleInfo}
          className={`pointer-events-auto px-4 sm:px-6 h-11 sm:h-13 rounded-full border backdrop-blur-md flex items-center justify-center cursor-pointer transition-all text-xs sm:text-sm tracking-wider gap-2 ${
            showInfo
              ? 'border-white/10 bg-white/5 text-[var(--muted)]'
              : 'border-white/10 bg-white/5 text-[var(--muted)] opacity-50'
          }`}
          aria-label="切换文字信息"
        >
          <span>{showInfo ? '📖' : '📖'}</span>
          <span className="hidden sm:inline">{showInfo ? '收起' : '详解'}</span>
        </button>

        {/* 右翻页 */}
        <button
          onClick={next}
          className="pointer-events-auto w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[var(--muted)] hover:text-[var(--yang)] hover:border-[var(--yang)] hover:bg-white/10 flex items-center justify-center cursor-pointer transition-all text-lg sm:text-xl active:scale-90"
          aria-label="下一卦"
        >
          ▶
        </button>
      </div>

      {/* ─── 指示器（小点） ─── */}
      <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1 pointer-events-none">
        {Array.from({ length: 64 }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`pointer-events-auto w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === currentIndex
                ? 'bg-[var(--yang)] scale-150'
                : 'bg-white/10 hover:bg-white/30'
            }`}
            aria-label={`跳转到第${i + 1}卦`}
          />
        ))}
      </div>

      {/* ─── 快捷键提示 ─── */}
      <div className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-10 text-[10px] text-[var(--muted)] opacity-20 tracking-wider pointer-events-none whitespace-nowrap">
        ←→ 翻页 · 空格 切换文字 · A 自动播放
      </div>
    </div>
  )
}
