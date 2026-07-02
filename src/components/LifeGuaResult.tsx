import { useState } from 'react'
import Link from 'next/link'
import { RubyText } from '@/components/Ruby'
import { YaoDisplay } from '@/components/Yao'
import Modal from '@/components/Modal'
import { baguaMap, type Bagua } from '@/data/bagua'
import { shichenList, pillarInterpretation, type LifeGuaResult } from '@/data/lifegua'

const baguaCardInfo = (b: Bagua) => [
  ['自然', b.nature], ['属性', b.attribute], ['家庭', b.family],
  ['动物', b.animal], ['身体', b.body], ['方向', b.direction],
  ['季节', b.season], ['关键词', b.keywords.join(' · ')],
]

const monthNames = [
  '', '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
]

interface Props {
  result: LifeGuaResult
  gender: 'male' | 'female'
  month: number
  day: number
  shichenIndex: number
  recent: { year: number; month: number; day: number; shichenIndex: number; gender: 'male' | 'female'; yearBaguaId: string }[]
  onRecentClick: (entry: { year: number; month: number; day: number; shichenIndex: number; gender: 'male' | 'female' }) => void
}

export default function LifeGuaResult({ result, gender, month, day, shichenIndex, recent, onRecentClick }: Props) {
  const [modalGua, setModalGua] = useState<Bagua | null>(null)
  const target = baguaMap[result.year.baguaId]

  return (
    <div className="max-w-[600px] mx-auto mt-6 animate-[fadeIn_0.4s_ease]">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 text-center">
        {/* 四柱命卦 */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {(['year', 'month', 'day', 'hour'] as const).map((pillar, idx) => {
            const g = result[pillar]
            const isYear = pillar === 'year'
            return (
              <div
                key={pillar}
                onClick={() => setModalGua(baguaMap[g.baguaId])}
                className={`p-3 rounded-xl bg-[var(--bg3)] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--shadow)] ${
                  isYear ? 'border-2 border-[var(--accent)]' : 'border border-[var(--border)] hover:border-[var(--accent2)]'
                }`}
                title="点击查看卦象详情"
              >
                <div className="text-[11px] text-[var(--muted)] mb-1">
                  {['年柱', '月柱', '日柱', '时柱'][idx]}
                </div>
                <div className={isYear ? 'text-[28px]' : 'text-[24px]'}>{g.symbol}</div>
                <div className="text-sm font-semibold">{g.name}卦</div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">{g.number}宫 · {g.element}</div>
              </div>
            )
          })}
        </div>

        <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-2">主命卦</div>
        <div className="text-[32px] font-bold tracking-wider bg-gradient-to-r from-[var(--yang)] to-[var(--accent2)] bg-clip-text text-transparent mb-1">
          {result.year.symbol} {result.year.name}卦
        </div>
        <div className="text-sm text-[var(--muted)] mb-4">
          <RubyText text={target.description} />
        </div>

        {/* 八卦爻 */}
        <div className="flex justify-center mb-4">
          <YaoDisplay yao={target.yao} big />
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
          <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1.5">你的性格能量</div>
          <div className="text-sm leading-relaxed">{result.personality}</div>
        </div>

        {/* 本命解读 */}
        <div className="p-5 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--accent2)] text-left mb-3">
          <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1.5">本命解读</div>
          <div className="text-sm leading-relaxed">{result.interpretation}</div>
        </div>

        {/* 提醒 */}
        <div className="p-5 rounded-xl bg-[var(--bg3)] border-l-[3px] border-[var(--border)] text-left mb-4">
          <div className="text-sm leading-relaxed">{result.advice}</div>
        </div>

        {/* 月日时柱解读 */}
        <div className="space-y-2 text-left">
          <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">四柱延伸解读</div>
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

        {/* 卦象详情弹窗 */}
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
          <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-2.5">📋 最近查询</div>
          <div className="flex flex-wrap gap-2">
            {recent.slice(0, 5).map((e, i) => {
              const b = baguaMap[e.yearBaguaId]
              return (
                <button
                  key={`${e.year}-${e.month}-${e.day}-${e.shichenIndex}-${e.gender}`}
                  onClick={() => onRecentClick(e)}
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
  )
}
