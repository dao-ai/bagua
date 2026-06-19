'use client'
import usePageTitle from '@/hooks/usePageTitle'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RubyText } from '@/components/Ruby'
import { YaoDisplay } from '@/components/Yao'
import { baguaMap } from '@/data/bagua'
import { calculateLifeGua, type LifeGuaResult } from '@/data/lifegua'

export default function LifeGuaPage() {
  usePageTitle()
  const [year, setYear] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [result, setResult] = useState<LifeGuaResult | null>(null)
  const [error, setError] = useState('')
  const [recent, setRecent] = useState<{ year: number; gender: 'male' | 'female'; baguaId: string }[]>([])

  // 从 localStorage 读取最近查询
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('lifegua-recent') || '[]')
      setRecent(saved)
    } catch {}
  }, [])

  const handleCalculate = () => {
    const y = parseInt(year)
    if (isNaN(y) || y < 1900 || y > 2099) {
      setError('请输入有效的出生年份（1900-2099）')
      setResult(null)
      return
    }
    setError('')
    const r = calculateLifeGua(y, gender)
    setResult(r)

    // 保存到最近记录
    const entry = { year: y, gender, baguaId: r.baguaId }
    const updated = [entry, ...recent.filter(e => e.year !== y || e.gender !== gender)].slice(0, 5)
    setRecent(updated)
    localStorage.setItem('lifegua-recent', JSON.stringify(updated))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCalculate()
  }

  const target = result ? baguaMap[result.baguaId] : null

  return (
    <>
      <div className="text-center pb-6">
        <h2 className="text-[26px] mb-1.5">本命卦</h2>
        <p className="text-sm text-[var(--muted)] max-w-[520px] mx-auto">
          输入出生年份，推算你的本命卦。这不是算命，而是一面了解自己的镜子。
        </p>
      </div>

      {/* ===== 输入区 ===== */}
      <div className="max-w-[480px] mx-auto bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8">
        {/* 性别切换 */}
        <h3 className="text-center text-lg mb-3">📅 出生年份</h3>
        <div className="flex justify-center gap-1.5 mb-5">
          <button
            onClick={() => setGender('male')}
            className={`px-5 py-1.5 rounded-lg text-sm border cursor-pointer transition-colors ${
              gender === 'male'
                ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
                : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
            }`}
          >
            ♂ 男
          </button>
          <button
            onClick={() => setGender('female')}
            className={`px-5 py-1.5 rounded-lg text-sm border cursor-pointer transition-colors ${
              gender === 'female'
                ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
                : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
            }`}
          >
            ♀ 女
          </button>
        </div>

        {/* 年份输入 */}
        <div className="flex justify-center mb-5">
          <div className="relative w-44">
            <input
              type="number"
              inputMode="numeric"
              value={year}
              onChange={e => setYear(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="如 1990"
              maxLength={4}
              className="w-full p-3 text-center bg-[var(--bg3)] border border-[var(--border)] rounded-xl text-[var(--fg)] text-xl font-semibold outline-none transition-all duration-300 caret-[var(--accent)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--glow)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)] pointer-events-none">年</span>
          </div>
        </div>

        {/* 计算按钮 */}
        <button
          onClick={handleCalculate}
          className="w-full py-3.5 text-base font-semibold tracking-wider bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)] active:translate-y-0"
        >
          ☰ 推算本命卦
        </button>

        {error && (
          <p className="text-center text-sm text-[var(--risk)] mt-3">{error}</p>
        )}
      </div>

      {/* ===== 结果区 ===== */}
      {result && target && (
        <div className="max-w-[580px] mx-auto mt-6 animate-[fadeIn_0.4s_ease]">
          {/* 主展示 */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center">
            <div className="text-[60px] mb-2">{result.symbol}</div>

            {/* 名字 */}
            <div className="text-xl font-semibold mb-0.5 text-[var(--muted)]">
              你的本命卦是
            </div>
            <div className="text-[32px] font-bold tracking-wider bg-gradient-to-r from-[var(--yang)] to-[var(--accent2)] bg-clip-text text-transparent mb-1">
              {result.symbol} {result.name}卦
            </div>
            <div className="text-sm text-[var(--muted)] mb-4">
              <RubyText text={target.description} />
            </div>

            {/* 八卦爻 */}
            <div className="flex justify-center mb-4">
              <YaoDisplay yao={target.yao} big />
            </div>

            {/* 属性标签 */}
            <div className="flex justify-center gap-2 mb-5">
              <span className="px-3 py-1 rounded-full text-xs bg-[var(--bg3)] text-[var(--accent2)] border border-[var(--border)]">
                洛书{result.number}宫
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-[var(--bg3)] text-[var(--accent2)] border border-[var(--border)]">
                五行{result.element}
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-[var(--bg3)] text-[var(--accent2)] border border-[var(--border)]">
                {gender === 'male' ? '男命' : '女命'}
              </span>
            </div>

            {/* 性格简述 */}
            <div className="p-5 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--accent)] text-left mb-3">
              <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1.5">
                你的性格能量
              </div>
              <div className="text-sm leading-relaxed">
                {result.personality}
              </div>
            </div>

            {/* 深入解读 */}
            <div className="p-5 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--accent2)] text-left mb-3">
              <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1.5">
                本命解读
              </div>
              <div className="text-sm leading-relaxed">
                {result.interpretation}
              </div>
            </div>

            {/* 提醒 */}
            <div className="p-5 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--border)] text-left">
              <div className="text-sm leading-relaxed">
                {result.advice}
              </div>
            </div>

            {/* 跳转链接 */}
            <Link
              href="/eight"
              className="inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] rounded-xl no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)]"
            >
              ☰ 了解更多关于 {result.name}卦 →
            </Link>
          </div>

          {/* 最近查询 */}
          {recent.length > 1 && (
            <div className="mt-5 p-5 bg-[var(--card)] border border-[var(--border)] rounded-xl">
              <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-2.5">
                📋 最近查询
              </div>
              <div className="flex flex-wrap gap-2">
                {recent.slice(0, 5).map((e, i) => {
                  const b = baguaMap[e.baguaId]
                  return (
                    <button
                      key={`${e.year}-${e.gender}`}
                      onClick={() => {
                        setYear(String(e.year))
                        setGender(e.gender)
                        setResult(calculateLifeGua(e.year, e.gender))
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer transition-colors ${
                        i === 0
                          ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]'
                          : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
                      }`}
                    >
                      {e.year}年 {e.gender === 'male' ? '♂' : '♀'} {b.symbol}{b.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 底部提示 */}
      <p className="text-xs text-center text-[var(--muted)] mt-5 max-w-[520px] mx-auto">
        ⚠️ 本命卦源自传统易学中的三元命卦推算，是一种自我认知的工具，不是算命。
        每个人的性格都是独特的，卦象只是一个参考视角，不是定义。
      </p>
    </>
  )
}
