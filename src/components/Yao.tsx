'use client'

// 爻线组件
export default function YaoLine({ yang, big, size, className = '', animClass }: {
  yang: boolean
  big?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  animClass?: string
}) {
  const dim = big ? { w: 100, h: 10 } : size === 'sm' ? { w: 40, h: 5 } : { w: 80, h: 8 }
  const { w, h } = dim
  const outerCls = `transition-all duration-300 ${className}${animClass ? ' ' + animClass : ''}`

  if (yang) {
    return (
      <div
        className={`rounded-sm bg-[var(--yang)] ${outerCls}`}
        style={{ width: w, height: h }}
      />
    )
  }

  // 阴爻：外层 rounded-sm + overflow-hidden 裁剪四个角，内层 flex 三栏
  // 圆角由外层容器统一裁剪，左右色块完全对称
  return (
    <div
      className={`rounded-sm overflow-hidden ${outerCls}`}
      style={{ width: w, height: h }}
    >
      <div className="flex items-center w-full h-full">
        <div className="h-full bg-[var(--yin)]" style={{ width: '37.5%' }} />
        <div className="h-full" style={{ width: '25%' }} />
        <div className="h-full bg-[var(--yin)]" style={{ width: '37.5%' }} />
      </div>
    </div>
  )
}

// 八卦三爻显示
export function YaoDisplay({ yao, big = false, movingIndex, animClass }: {
  yao: number[]
  big?: boolean
  movingIndex?: number
  animClass?: string
}) {
  const reversed = [...yao].reverse()
  return (
    <div className="flex flex-col items-center gap-[4px] my-3">
      {reversed.map((v, i) => (
        <YaoLine
          key={i}
          yang={v === 1}
          big={big}
          animClass={movingIndex !== undefined && i === movingIndex ? animClass : undefined}
          className={movingIndex !== undefined && i === movingIndex ? 'animate-pulse' : ''}
        />
      ))}
    </div>
  )
}

// 六爻显示
export function HexagramDisplay({ yao6, movingIndex, animClass }: {
  yao6: number[]
  movingIndex?: number
  animClass?: string
}) {
  return (
    <div className="flex flex-col items-center gap-[3px] my-2">
      {[0,1,2,3,4,5].map(i => (
        <YaoLine
          key={i}
          yang={yao6[i] === 1}
          animClass={movingIndex !== undefined && i === movingIndex ? animClass : undefined}
          className={movingIndex !== undefined && i === movingIndex
            ? 'shadow-[0_0_12px_var(--accent),0_0_28px_var(--glow)] yl-moving' : ''}
        />
      ))}
    </div>
  )
}
