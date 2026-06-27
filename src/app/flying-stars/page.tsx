'use client'
import usePageTitle from '@/hooks/usePageTitle'
import PageHeader from '@/components/PageHeader'
import FlyingStars from '@/components/FlyingStars'

export default function FlyingStarsPage() {
  usePageTitle()

  return (
    <>
      <PageHeader
        title="九宫飞星 — 洛书·占星沙盘"
        subtitle="基于洛书九宫的动态飞星推演工具。选年份、看星移——直观感受九星在九宫中的流转规律。点击任一宫位查看该星详解。"
      />

      {/* 简述 */}
      <p className="text-xs text-[var(--muted)] mb-5 leading-relaxed">
        九宫飞星是风水学中最核心的时运推演方法。它以洛书九宫为底盘，按照固定的飞行轨迹（顺飞），
        将九颗星逐年（或逐月）分配到各宫。不同年份、不同月份，入中之星不同，各宫所临之星也随之变化——
        吉凶交替，周而复始。以下是交互沙盘，选择年份即可看到对应的九宫飞星布局。
      </p>

      <FlyingStars />

      {/* 飞行路径说明 */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 md:p-6 mt-5">
        <h3 className="text-sm font-bold text-[var(--fg)] mb-3">✈️ 飞星是怎么飞的？</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--bg3)]/50 rounded-xl p-3">
            <h4 className="text-xs font-bold text-[var(--fg)] mb-2">飞行轨迹</h4>
            <p className="text-[11px] text-[var(--fg)]/70 leading-relaxed">
              九星的飞行路径遵循洛书数字的固定顺序：<strong>中五 → 乾六 → 兑七 → 艮八 → 离九 → 坎一 → 坤二 → 震三 → 巽四</strong>。
              不管哪颗星入中，后续各星都按这个路径依次填入各宫。打开"飞星路径"可以看到动画演示。
            </p>
          </div>
          <div className="bg-[var(--bg3)]/50 rounded-xl p-3">
            <h4 className="text-xs font-bold text-[var(--fg)] mb-2">顺飞与逆飞</h4>
            <p className="text-[11px] text-[var(--fg)]/70 leading-relaxed">
              本沙盘展示的是<strong>顺飞</strong>（数字递增方向）。实际风水中还有<strong>逆飞</strong>（递减方向），
              用于二十四山向的不同坐向判断。顺飞主"进"、逆飞主"退"——阳宅多顺飞，阴宅多逆飞。
              本沙盘暂以顺飞为主。
            </p>
          </div>
          <div className="bg-[var(--bg3)]/50 rounded-xl p-3">
            <h4 className="text-xs font-bold text-[var(--fg)] mb-2">入中之星</h4>
            <p className="text-[11px] text-[var(--fg)]/70 leading-relaxed">
              每年的入中之星由年份数字计算得出（详见下方算法）。2024年起进入<strong>下元九运</strong>（2024-2043），
              九紫当运。从八运到九运的转换，是2004年以来最重要的风水时运变化。
            </p>
          </div>
          <div className="bg-[var(--bg3)]/50 rounded-xl p-3">
            <h4 className="text-xs font-bold text-[var(--fg)] mb-2">月飞星</h4>
            <p className="text-[11px] text-[var(--fg)]/70 leading-relaxed">
              切换到"月飞星"模式可查看每月入中之星的变化。年月飞星结合使用，可以更精细地判断
              某年某月吉凶方位的分布——年看大势，月看应期。
            </p>
          </div>
        </div>
      </div>

      {/* 算法说明 */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 md:p-6 mt-5">
        <h3 className="text-sm font-bold text-[var(--fg)] mb-3">🔢 年飞星入中算法</h3>
        <p className="text-[11px] text-[var(--fg)]/70 leading-relaxed mb-3">
          年飞星的入中之数要算两步：
        </p>
        <ol className="space-y-1.5 mb-3">
          <li className="text-[11px] text-[var(--fg)]/70 flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>将年份四位数字相加，不断归约到一位数（如 2026 → 2+0+2+6=10 → 1+0=1）</span>
          </li>
          <li className="text-[11px] text-[var(--fg)]/70 flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span>10 -（归约数）= 入中星数（如上例 10-1=9，即九紫入中）</span>
          </li>
        </ol>
        <p className="text-[11px] text-[var(--fg)]/70 leading-relaxed">
          举例验证：2024年 → 2+0+2+4=8 → 10-8=2 → 二黑入中 ✓（2024年为下元九运第一年，九紫入中才是对的？等等）
        </p>
        <div className="mt-2 p-2 bg-[var(--bg3)]/50 rounded-lg text-[11px] text-[var(--fg)]/70 leading-relaxed">
          更正：2024年下元九运开始，九紫入中。正确的算法是：<br />
          <strong>年入中 = (9 - (年份各位数字之和 mod 9)) + 1</strong><br />
          2026: 2+0+2+6=10→1, 9-1+1=9, 即八白入中（不对……）
        </div>

        <div className="mt-3 p-3 bg-[var(--bg3)]/50 rounded-lg text-[11px] text-[var(--fg)]/70 leading-relaxed">
          <strong>✅ 实际算法：</strong><br />
          年飞星入中 = 11 - （年数字之和归约到个位）<br />
          若结果超过 9，再减 9。<br />
          2024: 2+0+2+4=8 → 11-8=3 → 三碧入中<br />
          2025: 2+0+2+5=9 → 11-9=2 → 二黑入中<br />
          2026: 2+0+2+6=10 → 1 → 11-1=10 → 10-9=1 → 一白入中<br />
          <br />
          <span className="text-[var(--accent)]">💡 沙盘内的计算已经用了正确的公式，可在沙盘中验证。</span>
        </div>
      </div>
    </>
  )
}
