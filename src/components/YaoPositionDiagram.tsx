'use client'

// 爻位体系示意图 — 竖排六爻 + 左右标注
const trigramUpper = [
  { pos: '上九', yin: false, desc: '第六爻 · 顶点', detail: '盛极将衰，物极必反', note: '阳位' },
  { pos: '九五', yin: false, desc: '第五爻 · 君位', detail: '飞龙在天，中正之位', note: '阳位·中 ⭐' },
  { pos: '六四', yin: true,  desc: '第四爻 · 近臣', detail: '或跃在渊，可进可退', note: '阴位' },
]
const trigramLower = [
  { pos: '九三', yin: false, desc: '第三爻 · 转折', detail: '终日乾乾，承上启下', note: '阳位' },
  { pos: '六二', yin: true,  desc: '第二爻 · 大夫', detail: '见龙在田，中正之位', note: '阴位·中 ⭐' },
  { pos: '初九', yin: false, desc: '第一爻 · 起步', detail: '潜龙勿用，万事开头', note: '阳位' },
]

function YaoRow({ pos, yin, desc, detail, note, isFirst, isLast }: {
  pos: string; yin: boolean; desc: string; detail: string; note: string
  isFirst?: boolean; isLast?: boolean
}) {
  return (
    <div className="flex items-center gap-3 group">
      {/* 爻线 */}
      <div className="flex-shrink-0 w-[52px] flex items-center justify-center">
        <div
          className={`h-[7px] rounded-sm transition-all duration-300 ${yin ? '' : 'bg-[var(--yang)] group-hover:shadow-[0_0_8px_var(--glow)]'}`}
          style={{
            width: 44,
            backgroundImage: yin
              ? `linear-gradient(to right, var(--yin) 0, var(--yin) 16px, transparent 16px, transparent 28px, var(--yin) 28px, var(--yin) 44px)`
              : undefined,
          }}
        />
      </div>

      {/* 爻位名 */}
      <div className={`w-14 flex-shrink-0 font-mono text-sm font-bold tracking-wide ${yin ? 'text-[var(--yin)]' : 'text-[var(--yang)]'}`}>
        {pos}
      </div>

      {/* 说明 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--fg)]">{desc}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg3)] text-[var(--muted)] font-mono whitespace-nowrap">
            {note}
          </span>
        </div>
        <div className="text-[11px] text-[var(--muted)] mt-0.5">{detail}</div>
      </div>
    </div>
  )
}

export default function YaoPositionDiagram() {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 mb-6">
      <h4 className="text-sm font-semibold text-[var(--fg)] mb-4 text-center">六爻位置示意图</h4>

      <div className="flex justify-center">
        <div className="flex gap-3">
          {/* 六爻 + 标注 */}
          <div className="space-y-2">
            {/* 上卦 */}
            <div className="relative pl-4 border-l-2 border-[var(--accent2)]/40">
              <div className="absolute -top-[3px] -left-[1px] text-[10px] text-[var(--accent2)] font-semibold tracking-wider -translate-x-1/2 bg-[var(--card)] px-1">
                上卦
              </div>
              <div className="space-y-2 py-1">
                {trigramUpper.map((y, i) => (
                  <YaoRow key={y.pos} {...y} isFirst={i===0} isLast={i===trigramUpper.length-1} />
                ))}
              </div>
            </div>

            {/* 下卦 */}
            <div className="relative pl-4 border-l-2 border-[var(--accent2)]/40">
              <div className="absolute -top-[3px] -left-[1px] text-[10px] text-[var(--accent2)] font-semibold tracking-wider -translate-x-1/2 bg-[var(--card)] px-1">
                下卦
              </div>
              <div className="space-y-2 py-1">
                {trigramLower.map((y, i) => (
                  <YaoRow key={y.pos} {...y} isFirst={i===0} isLast={i===trigramLower.length-1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 图例 */}
      <div className="flex items-center justify-center gap-5 mt-4 pt-3 border-t border-[var(--border)] text-[11px] text-[var(--muted)]">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-[5px] rounded-sm bg-[var(--yang)]" />
          <span>阳爻（九）</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-[5px] rounded-sm" style={{ backgroundImage: 'linear-gradient(to right, var(--yin) 0, var(--yin) 6px, transparent 6px, transparent 10px, var(--yin) 10px, var(--yin) 16px)' }} />
          <span>阴爻（六）</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--accent2)]">⭐</span>
          <span>中位</span>
        </div>
      </div>
    </div>
  )
}
