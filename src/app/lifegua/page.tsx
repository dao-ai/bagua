'use client'
import usePageTitle from '@/hooks/usePageTitle'
import PageHeader from '@/components/PageHeader'
import LifeGuaResultView from '@/components/LifeGuaResult'

import { useState, useEffect, useMemo } from 'react'
import { calculateLifeGua, shichenList, type LifeGuaResult } from '@/data/lifegua'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface RecentEntry {
  year: number
  month: number
  day: number
  shichenIndex: number
  gender: 'male' | 'female'
  yearBaguaId: string
}

export default function LifeGuaPage() {
  usePageTitle()
  const [year, setYear] = useState('1980')
  const [month, setMonth] = useState(1)
  const [day, setDay] = useState(11)
  const [shichenIndex, setShichenIndex] = useState(9) // 默认酉时
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [result, setResult] = useState<LifeGuaResult | null>(null)
  const [error, setError] = useState('')
  const [recent, setRecent] = useState<RecentEntry[]>([])

  // 根据年月计算当月天数
  const maxDay = useMemo(() => {
    const y = parseInt(year)
    if (isNaN(y)) return 31
    return new Date(y, month, 0).getDate()
  }, [year, month])

  // 当月天数变化时，自动调整日期
  useEffect(() => {
    if (day > maxDay) setDay(maxDay)
  }, [maxDay, day])

  // 从 localStorage 读取最近查询
  useEffect(() => {
    try {
      // 过滤掉旧格式数据（缺少字段的兼容处理）
      const saved: RecentEntry[] = JSON.parse(localStorage.getItem('lifegua-recent') || '[]')
      setRecent(saved.filter(e => e && typeof e.shichenIndex === 'number'))
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
    const r = calculateLifeGua(y, month, day, shichenIndex, gender)
    setResult(r)

    // 保存最近记录
    const entry: RecentEntry = { year: y, month, day, shichenIndex, gender, yearBaguaId: r.year.baguaId }
    const updated = [
      entry,
      ...recent.filter(
        e => e.year !== y || e.month !== month || e.day !== day || e.shichenIndex !== shichenIndex || e.gender !== gender,
      ),
    ].slice(0, 5)
    setRecent(updated)
    localStorage.setItem('lifegua-recent', JSON.stringify(updated))
  }


  return (
    <>
      <PageHeader title="本命卦 · 四柱命卦" subtitle="输入出生年月日时，推算你的本命卦。年柱定主命，月日时柱看变局。" />

      {/* ===== 输入区 ===== */}
      <div className="max-w-[520px] mx-auto bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 sm:p-8"
        data-mcp-action="calculate-life-gua"
        data-mcp-description="根据出生年月日时推算本命卦。年柱定主命，月日时柱看变局。需提供性别、出生年、月、日、时辰。"
        data-mcp-params='{"required": ["gender", "year", "month", "day", "shichen"]}'
      >
        <h3 className="text-center text-lg mb-5">📅 出生时间</h3>

        {/* 性别切换 */}
        <div className="flex justify-center gap-1.5 mb-5"
          data-mcp-action="select-gender"
          data-mcp-description="选择性别，用于本命卦推算"
          data-mcp-params='{"required": ["gender"]}'
        >
          <button
            onClick={() => setGender('male')}
            data-mcp-param="gender"
            data-mcp-param-value="male"
            data-mcp-description="男性"
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
            data-mcp-param="gender"
            data-mcp-param-value="female"
            data-mcp-description="女性"
            className={`px-5 py-1.5 rounded-lg text-sm border cursor-pointer transition-colors ${
              gender === 'female'
                ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold'
                : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
            }`}
          >
            ♀ 女
          </button>
        </div>

        {/* 年月日时 — 全部下拉框 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"
          data-mcp-action="set-birth-datetime"
          data-mcp-description="设置出生年、月、日、时辰，用于推算本命卦"
          data-mcp-params='{"required": ["year", "month", "day", "shichen"]}'
        >
          {/* 年 */}
          <div>
            <div className="text-[11px] text-[var(--muted)] mb-1.5 text-center">年</div>
            <Select value={year} onValueChange={(v) => { if (v) setYear(v) }}>
              <SelectTrigger className="w-full bg-[var(--bg3)] border-[var(--border)] text-sm text-center justify-center">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--bg2)] border-[var(--border)] max-h-[240px]">
                {Array.from({ length: 200 }, (_, i) => 2099 - i).map(y => (
                  <SelectItem key={y} value={String(y)}>{y}年</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 月 */}
          <div>
            <div className="text-[11px] text-[var(--muted)] mb-1.5 text-center">月</div>
            <Select value={String(month)} onValueChange={(v) => { if (v) setMonth(Number(v)) }}>
              <SelectTrigger className="w-full bg-[var(--bg3)] border-[var(--border)] text-sm text-center justify-center">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--bg2)] border-[var(--border)]">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <SelectItem key={m} value={String(m)}>{m}月</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 日 */}
          <div>
            <div className="text-[11px] text-[var(--muted)] mb-1.5 text-center">日</div>
            <Select value={String(day)} onValueChange={(v) => { if (v) setDay(Number(v)) }}>
              <SelectTrigger className="w-full bg-[var(--bg3)] border-[var(--border)] text-sm text-center justify-center">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--bg2)] border-[var(--border)] max-h-[240px]">
                {Array.from({ length: maxDay }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}日</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 时辰 */}
          <div>
            <div className="text-[11px] text-[var(--muted)] mb-1.5 text-center">时</div>
            <Select value={String(shichenIndex)} onValueChange={(v) => { if (v) setShichenIndex(Number(v)) }}>
              <SelectTrigger className="w-full bg-[var(--bg3)] border-[var(--border)] text-sm text-center justify-center">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--bg2)] border-[var(--border)]">
                {shichenList.map(s => (
                  <SelectItem key={s.index} value={String(s.index)}>{s.name} {s.range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 计算按钮 */}
        <button
          onClick={handleCalculate}
          data-mcp-action="calculate-life-gua-submit"
          data-mcp-description="根据已填的性别和出生年月日时，推算本命卦及四柱（年月日时）卦象"
          className="w-full py-3.5 text-base font-semibold tracking-wider bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)] active:translate-y-0"
        >
          ☰ 推算本命卦
        </button>

        {error && (
          <p className="text-center text-sm text-[var(--risk)] mt-3">{error}</p>
        )}
      </div>

      {/* ===== 结果区 ===== */}
      {result && (
        <LifeGuaResultView
          result={result}
          gender={gender}
          month={month}
          day={day}
          shichenIndex={shichenIndex}
          recent={recent}
          onRecentClick={(e) => {
            setYear(String(e.year))
            setMonth(e.month)
            setDay(e.day)
            setShichenIndex(e.shichenIndex)
            setGender(e.gender)
            setResult(calculateLifeGua(e.year, e.month, e.day, e.shichenIndex, e.gender))
          }}
        />
      )}

      {/* 底部提示 */}
      <p className="text-xs text-center text-[var(--muted)] mt-5 max-w-[560px] mx-auto">
        ⚠️ 本命卦源自传统易学中的三元命卦推算，是一种自我认知的工具，不是算命。
        四柱是对出生时间的多维度参考，每个人的性格都是独特的，卦象只是一个视角。
      </p>
    </>
  )
}
