'use client'
import { useEffect, useState } from 'react'
import usePageTitle from '@/hooks/usePageTitle'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import PageHeader from '@/components/PageHeader'

const FuxiCircle = dynamic(() => import('@/components/FuxiCircle'), {
  loading: () => <div className="h-80 rounded-xl bg-[var(--card)] border border-[var(--border)] animate-pulse" />,
})
const FuxiSquare = dynamic(() => import('@/components/FuxiSquare'), {
  loading: () => <div className="h-80 rounded-xl bg-[var(--card)] border border-[var(--border)] animate-pulse" />,
})

function FuxiContent() {
  usePageTitle()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const searchParams = useSearchParams()
  const highlightKey = searchParams.get('key') || undefined

  // 首次渲染（SSR）只显示空容器，避免 hydration 不匹配
  if (!mounted) {
    return (
      <main className="px-4 pb-12 mx-auto max-w-[960px]">
        <PageHeader
          title="伏羲六十四卦方圆图"
          subtitle="天圆地方 · 阴阳消长 —— 邵雍《皇极经世》所载伏羲先天六十四卦方位"
        />
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8" />
      </main>
    )
  }

  return (
    <main className="px-4 pb-12 mx-auto max-w-[960px]">
      <PageHeader
        title="伏羲六十四卦方圆图"
        subtitle="天圆地方 · 阴阳消长 —— 邵雍《皇极经世》所载伏羲先天六十四卦方位"
      />

      {/* 概览说明 */}
      <div className="mb-8 p-4 rounded-xl bg-[var(--bg2)] border border-[var(--border)]">
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          <strong className="text-[var(--fg)] font-medium">方圆图</strong>是北宋邵雍（康节先生）
          依据陈抟所传先天易学绘制的易图，收录于《皇极经世》。此图以
          <strong className="text-[var(--accent)]">乾一、兑二、离三、震四、巽五、坎六、艮七、坤八</strong>
          的伏羲先天八卦数为序列基础，将六十四卦按二进制逻辑排列，被莱布尼茨赞为
          「与二进制算术完全吻合」。
        </p>
      </div>

      {/* 圆图 + 方图 上下排列（天一行，地一行）*/}
      <div className="flex flex-col items-center gap-10">
        {/* 圆图 */}
        <div className="flex flex-col items-center flex-shrink-0">
          <h3 className="text-[15px] font-heading text-[var(--fg)] mb-3">
            📍 圆图 · 天
          </h3>
          <FuxiCircle highlightKey={highlightKey} />
          <p className="mt-3 text-[11px] text-[var(--muted)] text-center max-w-[480px] leading-relaxed">
            圆图象天，64卦按伏羲序沿圆周排列。<br />
            坤起于北（下），乾终于南（上），
            左半圈阳升、右半圈阴降。
          </p>
        </div>

        {/* 方图 */}
        <div className="flex flex-col items-center flex-grow min-w-0">
          <h3 className="text-[15px] font-heading text-[var(--fg)] mb-3">
            📍 方图 · 地
          </h3>
          <FuxiSquare highlightKey={highlightKey} />
          <p className="mt-3 text-[11px] text-[var(--muted)] text-center max-w-[480px] leading-relaxed">
            方图象地，8×8网格。<br />
            纵列对应上卦（乾至坤），横行为下卦（坤至乾）。<br />
            任意行与列相交即为一个六爻卦。
          </p>
        </div>
      </div>

      {/* 下方解释文字 */}
      <div className="mt-10 p-5 rounded-xl bg-[var(--bg2)] border border-[var(--border)] space-y-3">
        <h3 className="text-[15px] font-heading text-[var(--fg)]">📖 邵雍《皇极经世》原文</h3>
        <blockquote className="text-sm text-[var(--muted)] italic leading-relaxed pl-4 border-l-2 border-[var(--accent)]">
          「先天图者，环中也。自坤至复为阴中含阳，自姤至乾为阳中含阴。<br />
          坤、复之间为无极，自坤反姤为无极之前，自姤至坤为无极之后。<br />
          阳在阴中，阳逆行；阴在阳中，阴逆行。阳在阳中，阴在阴中，则皆顺行。」
        </blockquote>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          <strong className="text-[var(--fg)] font-medium">圆图的解读：</strong>
          从坤（全阴）开始，左下方向经过震、离、兑等卦，阳爻逐渐增多，
          至乾卦（全阳）达到极致，此为「阳升」过程；
          从姤卦（一阴初生）开始，右下方向阴爻逐渐增多，
          至坤卦回到极致，此为「阴降」过程。
          阴阳的消长变化，构成了宇宙万物的循环节律。
        </p>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          <strong className="text-[var(--fg)] font-medium">方图的解读：</strong>
          横看为下卦（从坤到乾），竖看为上卦（从乾到坤）。
          左上角为乾（天在上、天在下，纯阳之象），
          右下角为坤（地在上、地在下，纯阴之象）。
          对角线从左上到右下，是阴阳此消彼长的渐变过程。
          莱布尼茨看到此图后惊叹，这和二进制算术完全一致——
          阳=1，阴=0，从坤(000000)到乾(111111)，正是0到63的完美二进制序列。
        </p>
      </div>

      {/* 如何理解 */}
      <div className="mt-6 p-5 rounded-xl bg-[var(--bg2)] border border-[var(--border)] space-y-3">
        <h3 className="text-[15px] font-heading text-[var(--fg)]">🧠 如何理解方圆图</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-[var(--bg3)] border border-[var(--border)]">
            <h4 className="text-[13px] text-[var(--yang)] font-medium mb-1">🌞 阳升半圈（左下）</h4>
            <p className="text-[12px] text-[var(--muted)] leading-relaxed">
              从底部坤卦开始，逆时针向左上方向：坤→艮→坎→巽→震→离→兑→乾。
              这条路径上，阴爻逐渐减少，阳爻逐渐增多，
              象征从冬至到夏至、从黑夜到白天的生长过程。
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg3)] border border-[var(--border)]">
            <h4 className="text-[13px] text-[var(--yin)] font-medium mb-1">🌜 阴降半圈（右下）</h4>
            <p className="text-[12px] text-[var(--muted)] leading-relaxed">
              从顶部乾卦之后开始，顺时针向右下方向：姤→大过→鼎→恒→巽→井→蛊→升→…
              这条路径上，阳爻逐渐减少，阴爻逐渐增多，
              象征从夏至到冬至、从白昼到黑夜的收敛过程。
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg3)] border border-[var(--border)]">
            <h4 className="text-[13px] text-[var(--fg)] font-medium mb-1">🔲 方图对角线</h4>
            <p className="text-[12px] text-[var(--muted)] leading-relaxed">
              从左上角的乾卦到右下角的坤卦，
              是一条清晰的阴阳渐变线。观察每个格子内阳爻/阴爻的数量，
              可以看到从6阳到0阳的平滑过渡。
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg3)] border border-[var(--border)]">
            <h4 className="text-[13px] text-[var(--fg)] font-medium mb-1">🔢 二进制之美</h4>
            <p className="text-[12px] text-[var(--muted)] leading-relaxed">
              将阳爻视为1、阴爻视为0，每个六爻卦就是一组6位二进制数。
              六十四卦正好对应了0到63的完整整数序列。
              莱布尼茨在1701年看到此图后，将二进制算术公之于世。
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function FuxiPage() {
  return (
    <Suspense fallback={
      <main className="px-4 pb-12 mx-auto max-w-[960px]">
        <div className="text-center py-20 text-[var(--muted)]">加载中…</div>
      </main>
    }>
      <FuxiContent />
    </Suspense>
  )
}
