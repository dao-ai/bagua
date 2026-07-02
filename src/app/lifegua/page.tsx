'use client'
import usePageTitle from '@/hooks/usePageTitle'
import PageHeader from '@/components/PageHeader'
import Modal from '@/components/Modal'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { RubyText } from '@/components/Ruby'
import { YaoDisplay } from '@/components/Yao'
import { baguaMap, type Bagua } from '@/data/bagua'
import { calculateLifeGua, shichenList, pillarInterpretation, type LifeGuaResult } from '@/data/lifegua'

const baguaCardInfo = (b: Bagua) => [
  ['自然', b.nature], ['属性', b.attribute], ['家庭', b.family],
  ['动物', b.animal], ['身体', b.body], ['方向', b.direction],
  ['季节', b.season], ['关键词', b.keywords.join(' · ')],
]

const monthNames = [
  '', '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
]

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
  const [modalGua, setModalGua] = useState<Bagua | null>(null)
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

  const target = result ? baguaMap[result.year.baguaId] : null

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
            <div className="relative">
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                data-mcp-param="year"
                data-mcp-description="出生年份，范围1900-2099"
                className="w-full p-2.5 pr-7 bg-[var(--bg3)] border border-[var(--border)] rounded-xl text-[var(--fg)] text-sm text-center outline-none transition-all duration-300 focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--glow)] cursor-pointer appearance-none"
              >

                {Array.from({ length: 100 }, (_, i) => 2000 - i).map(y => (
                  <option key={y} value={y}>{y}年</option>
                ))}
                {Array.from({ length: 100 }, (_, i) => 1999 - i).map(y => (
                  <option key={y} value={y}>{y}年</option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted)] pointer-events-none">▼</span>
            </div>
          </div>

          {/* 月 */}
          <div>
            <div className="text-[11px] text-[var(--muted)] mb-1.5 text-center">月</div>
            <div className="relative">
              <select
                value={month}
                onChange={e => setMonth(Number(e.target.value))}
                data-mcp-param="month"
                data-mcp-description="出生月份，1-12月"
                className="w-full p-2.5 pr-7 bg-[var(--bg3)] border border-[var(--border)] rounded-xl text-[var(--fg)] text-sm text-center outline-none transition-all duration-300 focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--glow)] cursor-pointer appearance-none"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted)] pointer-events-none">▼</span>
            </div>
          </div>

          {/* 日 */}
          <div>
            <div className="text-[11px] text-[var(--muted)] mb-1.5 text-center">日</div>
            <div className="relative">
              <select
                value={day}
                onChange={e => setDay(Number(e.target.value))}
                data-mcp-param="day"
                data-mcp-description="出生日期，根据月份自动调整天数范围"
                className="w-full p-2.5 pr-7 bg-[var(--bg3)] border border-[var(--border)] rounded-xl text-[var(--fg)] text-sm text-center outline-none transition-all duration-300 focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--glow)] cursor-pointer appearance-none"
              >
                {Array.from({ length: maxDay }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}日</option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted)] pointer-events-none">▼</span>
            </div>
          </div>

          {/* 时辰 */}
          <div>
            <div className="text-[11px] text-[var(--muted)] mb-1.5 text-center">时</div>
            <div className="relative">
              <select
                value={shichenIndex}
                onChange={e => setShichenIndex(Number(e.target.value))}
                data-mcp-param="shichen"
                data-mcp-description="出生时辰（12地支时辰），子时23:00-00:59，以此类推"
                className="w-full p-2.5 pr-7 bg-[var(--bg3)] border border-[var(--border)] rounded-xl text-[var(--fg)] text-sm text-center outline-none transition-all duration-300 focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--glow)] cursor-pointer appearance-none"
              >
                {shichenList.map(s => (
                  <option key={s.index} value={s.index}>{s.name} {s.range}</option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted)] pointer-events-none">▼</span>
            </div>
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
      {result && target && (
        <div className="max-w-[600px] mx-auto mt-6 animate-[fadeIn_0.4s_ease]">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 text-center">
            {/* 四柱命卦 */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              <div
                onClick={() => setModalGua(baguaMap[result.year.baguaId])}
                className="p-3 rounded-xl bg-[var(--bg3)] border-2 border-[var(--accent)] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--shadow)]"
                title="点击查看年柱卦象详情"
              >
                <div className="text-[11px] text-[var(--muted)] mb-1">年柱</div>
                <div className="text-[28px]">{result.year.symbol}</div>
                <div className="text-sm font-semibold">{result.year.name}卦</div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">{result.year.number}宫 · {result.year.element}</div>
              </div>
              <div
                onClick={() => setModalGua(baguaMap[result.month.baguaId])}
                className="p-3 rounded-xl bg-[var(--bg3)] border border-[var(--border)] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_var(--shadow)] hover:border-[var(--accent2)]"
                title="点击查看月柱卦象详情"
              >
                <div className="text-[11px] text-[var(--muted)] mb-1">月柱</div>
                <div className="text-[24px]">{result.month.symbol}</div>
                <div className="text-sm font-semibold">{result.month.name}卦</div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">{result.month.number}宫 · {result.month.element}</div>
              </div>
              <div
                onClick={() => setModalGua(baguaMap[result.day.baguaId])}
                className="p-3 rounded-xl bg-[var(--bg3)] border border-[var(--border)] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_var(--shadow)] hover:border-[var(--accent2)]"
                title="点击查看日柱卦象详情"
              >
                <div className="text-[11px] text-[var(--muted)] mb-1">日柱</div>
                <div className="text-[24px]">{result.day.symbol}</div>
                <div className="text-sm font-semibold">{result.day.name}卦</div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">{result.day.number}宫 · {result.day.element}</div>
              </div>
              <div
                onClick={() => setModalGua(baguaMap[result.hour.baguaId])}
                className="p-3 rounded-xl bg-[var(--bg3)] border border-[var(--border)] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_var(--shadow)] hover:border-[var(--accent2)]"
                title="点击查看时柱卦象详情"
              >
                <div className="text-[11px] text-[var(--muted)] mb-1">时柱</div>
                <div className="text-[24px]">{result.hour.symbol}</div>
                <div className="text-sm font-semibold">{result.hour.name}卦</div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">{result.hour.number}宫 · {result.hour.element}</div>
              </div>
            </div>

            <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-2">主命卦</div>
            <div className="text-[32px] font-bold tracking-wider bg-gradient-to-r from-[var(--yang)] to-[var(--accent2)] bg-clip-text text-transparent mb-1">
              {result.year.symbol} {result.year.name}卦
            </div>
            <div className="text-sm text-[var(--muted)] mb-4">
              <RubyText text={baguaMap[result.year.baguaId].description} />
            </div>

            {/* 八卦爻 */}
            <div className="flex justify-center mb-4">
              <YaoDisplay yao={baguaMap[result.year.baguaId].yao} big />
            </div>

            {/* 属性标签 */}
            <div className="flex justify-center gap-2 mb-5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs bg-[var(--bg3)] text-[var(--accent2)] border border-[var(--border)]">
                洛书{result.year.number}宫
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-[var(--bg3)] text-[var(--accent2)] border border-[var(--border)]">
                五行{result.year.element}
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
            <div className="p-5 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--border)] text-left mb-4">
              <div className="text-sm leading-relaxed">
                {result.advice}
              </div>
            </div>

            {/* 月日时柱解读 */}
            <div className="space-y-2 text-left">
              <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">
                四柱延伸解读
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--border)] text-sm leading-relaxed">
                <span className="text-[var(--accent2)] font-semibold">🌙 月柱·{monthNames[month]}</span>
                <br />
                {pillarInterpretation.month[result.month.baguaId] || '月柱展现了你当前阶段的能量状态。'}
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--border)] text-sm leading-relaxed">
                <span className="text-[var(--accent2)] font-semibold">☀️ 日柱·{day}日</span>
                <br />
                {pillarInterpretation.day[result.day.baguaId] || '日柱反映你日常待人接物的习惯。'}
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--border)] text-sm leading-relaxed">
                <span className="text-[var(--accent2)] font-semibold">🌑 时柱·{shichenList[shichenIndex].name}</span>
                <br />
                {pillarInterpretation.hour[result.hour.baguaId] || '时柱揭示你内心深处的真实面貌。'}
              </div>
            </div>

            {/* 跳转链接 */}
            <Link
              href="/eight"
              className="inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] rounded-xl no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)]"
            >
              ☰ 了解更多关于 {result.year.name}卦 →
            </Link>

            {/* 卦象详情弹窗 — 点击月柱/日柱/时柱触发 */}
            <Modal open={!!modalGua} onClose={() => setModalGua(null)} label={`${modalGua?.name}卦详情`}>
              {modalGua && (
                <div>
                  <div className="text-[60px] text-center block">{modalGua.symbol}</div>
                  <h2 className="text-center text-2xl mt-1.5 mb-0.5"><RubyText text={modalGua.name} /></h2>
                  <p className="text-center text-sm text-[var(--accent2)] my-3 leading-relaxed">{modalGua.description}</p>
                  <div className="flex justify-center mb-1">
                    <YaoDisplay yao={modalGua.yao} big />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {baguaCardInfo(modalGua).map(([k, v]) => (
                      <div key={k} className="p-2.5 rounded-xl bg-[var(--bg3)] text-sm flex flex-col gap-0.5">
                        <span className="text-[11px] text-[var(--muted)]">{k}</span>
                        <span className="font-semibold text-[var(--fg)]">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-4 pt-3 border-t border-[var(--border)] text-center font-mono">
                    二进制：<span className="text-[var(--accent2)]">{modalGua.binary}</span>
                    &nbsp;·&nbsp; 十进制：<span className="text-[var(--accent2)]">{modalGua.decimal}</span>
                  </div>
                </div>
              )}
            </Modal>
          </div>

          {/* 最近查询 */}
          {recent.length > 1 && (
            <div className="mt-5 p-5 bg-[var(--card)] border border-[var(--border)] rounded-xl">
              <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-2.5">
                📋 最近查询
              </div>
              <div className="flex flex-wrap gap-2">
                {recent.slice(0, 5).map((e, i) => {
                  const b = baguaMap[e.yearBaguaId]
                  return (
                    <button
                      key={`${e.year}-${e.month}-${e.day}-${e.shichenIndex}-${e.gender}`}
                      onClick={() => {
                        setYear(String(e.year))
                        setMonth(e.month)
                        setDay(e.day)
                        setShichenIndex(e.shichenIndex)
                        setGender(e.gender)
                        setResult(calculateLifeGua(e.year, e.month, e.day, e.shichenIndex, e.gender))
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer transition-colors ${
                        i === 0
                          ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]'
                          : 'bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)]'
                      }`}
                    >
                      {e.year}/{String(e.month).padStart(2,'0')}/{String(e.day).padStart(2,'0')} {shichenList[e.shichenIndex]?.name || '?'} {e.gender === 'male' ? '♂' : '♀'} {b.symbol}{b.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 底部提示 */}
      <p className="text-xs text-center text-[var(--muted)] mt-5 max-w-[560px] mx-auto">
        ⚠️ 本命卦源自传统易学中的三元命卦推算，是一种自我认知的工具，不是算命。
        四柱是对出生时间的多维度参考，每个人的性格都是独特的，卦象只是一个视角。
      </p>
    </>
  )
}
