'use client'

import { useState } from 'react'
import usePageTitle from '@/hooks/usePageTitle'
import { HexagramDisplay } from '@/components/Yao'
import { RubyText, Ruby } from '@/components/Ruby'
import { getHexagramDetail } from '@/data/hexagrams'
import { useDivineHistory, formatDateLabel, formatTime, yao6ToTrigramIds, type DivineRecord } from '@/hooks/useDivineHistory'

export default function HistoryPage() {
  usePageTitle()
  const { grouped, deleteRecord, clearAll } = useDivineHistory()
  const [confirmClear, setConfirmClear] = useState(false)
  const total = Object.values(grouped).flat().length

  const dateKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <>
      <div className="text-center pb-6">
        <h2 className="text-[26px] mb-1.5 font-heading">起卦历史</h2>
        {total > 0 ? (
          <p className="text-sm text-[var(--muted)] max-w-[520px] mx-auto">
            共 <strong className="text-[var(--accent2)]">{total}</strong> 次起卦记录
          </p>
        ) : (
          <p className="text-sm text-[var(--muted)] max-w-[520px] mx-auto">
            还没有起卦记录。去 <a href="/divine" className="text-[var(--accent2)] underline hover:no-underline">起卦</a> 试试吧
          </p>
        )}
      </div>

      {total > 0 && (
        <div className="max-w-[700px] mx-auto">
          {/* 清空按钮 */}
          <div className="flex justify-end mb-4">
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--risk)]">确定清空全部历史？</span>
                <button onClick={() => { clearAll(); setConfirmClear(false) }}
                  className="px-3 py-1 text-xs font-semibold bg-[var(--risk)] text-white rounded-lg cursor-pointer border-none hover:opacity-80 transition-opacity">
                  确认清空
                </button>
                <button onClick={() => setConfirmClear(false)}
                  className="px-3 py-1 text-xs bg-[var(--bg3)] text-[var(--muted)] rounded-lg cursor-pointer border border-[var(--border)] hover:text-[var(--fg)] transition-colors">
                  取消
                </button>
              </div>
            ) : (
              total > 0 && (
                <button onClick={() => setConfirmClear(true)}
                  className="px-3 py-1 text-xs bg-[var(--bg3)] text-[var(--risk)] rounded-lg cursor-pointer border border-[var(--border)] hover:border-[var(--risk)] transition-colors">
                  🗑 清空全部
                </button>
              )
            )}
          </div>

          {/* 按日期分组 */}
          {dateKeys.map(dateKey => (
            <div key={dateKey} className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--accent2)] mb-3 flex items-center gap-2">
                <span>📅</span>
                <span>{formatDateLabel(dateKey)}</span>
                <span className="text-[11px] text-[var(--muted)] font-normal">
                  ({grouped[dateKey].length} 次)
                </span>
              </h3>

              <div className="space-y-2.5">
                {grouped[dateKey].map(rec => (
                  <HistoryCard key={rec.id} record={rec} onDelete={deleteRecord} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function HistoryCard({ record: r, onDelete }: { record: DivineRecord; onDelete: (id: string) => void }) {
  const [deleting, setDeleting] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (deleting) {
      onDelete(r.id)
    } else {
      setDeleting(true)
      setTimeout(() => setDeleting(false), 3000)
    }
  }

  return (
    <div
      onClick={() => setExpanded(e => !e)}
      className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3.5 cursor-pointer transition-all duration-200 hover:border-[var(--accent)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_var(--shadow)]"
    >
      <div className="flex items-center gap-3">
        {/* 卦符 */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[22px]">{r.nowSymbol}</span>
          <span className="text-[11px] text-[var(--muted)]">→</span>
          <span className="text-[22px]">{r.changedSymbol}</span>
        </div>

        {/* 卦名 */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">
            <RubyText text={r.hexName} />
            <span className="text-[11px] text-[var(--muted)] mx-1">→</span>
            <RubyText text={r.changedHexName} />
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-0.5">
            {r.movingName} · {r.movingChange}
          </div>
        </div>

        {/* 时间和删除 */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-[var(--muted)]">{formatTime(r.timestamp)}</span>
          <button
            onClick={handleDelete}
            className={`p-1 rounded-md text-xs cursor-pointer transition-all ${
              deleting
                ? 'bg-[var(--risk)] text-white scale-110'
                : 'text-[var(--muted)] hover:text-[var(--risk)] hover:bg-[var(--bg3)]'
            }`}
            title={deleting ? '确认删除' : '删除'}
          >
            {deleting ? '✕' : '✕'}
          </button>
        </div>
      </div>

      {/* 展开详情 */}
      {expanded && <HistoryDetail record={r} />}
    </div>
  )
}

function HistoryDetail({ record: r }: { record: DivineRecord }) {
  // 兼容旧记录：如果缺少 ID 字段，从 yao6 反推
  const upperId = r.upperId || (() => { const t = yao6ToTrigramIds(r.yao6); return t.upperId })()
  const lowerId = r.lowerId || (() => { const t = yao6ToTrigramIds(r.yao6); return t.lowerId })()
  const changedUpperId = r.changedUpperId || upperId
  const changedLowerId = r.changedLowerId || lowerId

  const nowDetail = getHexagramDetail(upperId, lowerId)
  const changedDetail = r.changedHexName !== r.hexName
    ? getHexagramDetail(changedUpperId, changedLowerId)
    : undefined
  const movingYao = nowDetail?.yaoLines?.[5 - r.movingIndex]

  return (
    <div className="mt-3 pt-3 border-t border-[var(--border)] animate-[fadeIn_0.3s_ease]">
      {/* 卦象对比 */}
      <div className="flex justify-center gap-6 items-start mb-4">
        <div className="text-center flex-1">
          <div className="text-[10px] text-[var(--muted)] mb-1">本卦</div>
          <HexagramDisplay yao6={r.yao6} />
          <div className="text-sm font-semibold mt-1">{r.nowSymbol} <RubyText text={r.hexName} /></div>
          <div className="text-[11px] text-[var(--muted)]">上<Ruby char={r.upperName} /> 下<Ruby char={r.lowerName} /></div>
        </div>
        <div className="flex flex-col items-center gap-1 pt-6">
          <div className="text-[11px] text-[var(--accent2)] font-semibold">{r.movingName}</div>
          <div className="text-[10px] text-[var(--muted)]">{r.movingChange}</div>
        </div>
        <div className="text-center flex-1">
          <div className="text-[10px] text-[var(--muted)] mb-1">变卦</div>
          <HexagramDisplay yao6={r.changedYao6} />
          <div className="text-sm font-semibold mt-1">{r.changedSymbol} <RubyText text={r.changedHexName} /></div>
          {r.changedHexName !== r.hexName && (
            <div className="text-[11px] text-[var(--muted)]">上<Ruby char={r.changedUpperName} /> 下<Ruby char={r.changedLowerName} /></div>
          )}
        </div>
      </div>

      {/* 本卦卦辞解读 */}
      {nowDetail && (
        <div className="p-3 rounded-lg bg-[var(--bg3)] text-left mb-2.5">
          <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">卦辞</div>
          <div className="text-sm font-semibold text-[var(--accent2)] mb-1"><RubyText text={nowDetail.judgment} /></div>
          <div className="text-xs italic text-[var(--muted)] mb-1"><RubyText text={nowDetail.image} /></div>
          <div className="text-xs leading-relaxed"><RubyText text={nowDetail.meaning} /></div>
        </div>
      )}

      {/* 变卦卦辞 */}
      {changedDetail && (
        <div className="p-3 rounded-lg bg-[var(--bg3)] text-left mb-2.5 opacity-80">
          <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">变卦 · 卦辞</div>
          <div className="text-sm font-semibold text-[var(--accent2)] mb-1"><RubyText text={changedDetail.judgment} /></div>
          <div className="text-xs leading-relaxed"><RubyText text={changedDetail.meaning} /></div>
        </div>
      )}

      {/* 动爻爻辞 */}
      {movingYao && (
        <div className="p-3 rounded-lg bg-[var(--bg3)] border-l-[3px] border-[var(--accent2)] text-left">
          <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">{movingYao.pos}</div>
          <div className="text-sm font-semibold text-[var(--accent2)] mb-1"><RubyText text={movingYao.text} /></div>
          <div className="text-xs leading-relaxed"><RubyText text={movingYao.meaning} /></div>
        </div>
      )}
    </div>
  )
}
