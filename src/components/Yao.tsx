'use client'

// 爻线组件
export default function YaoLine({ yang, big, className = '', animClass }: {
  yang: boolean
  big?: boolean
  className?: string
  animClass?: string
}) {
  const w = big ? 100 : 80
  const h = big ? 10 : 8
  return (
    <div
      className={`rounded-sm transition-all duration-300 ${yang ? 'bg-[var(--yang)]' : ''} ${className}${animClass ? ' ' + animClass : ''}`}
      style={{
        width: w,
        height: h,
        background: yang ? undefined : undefined,
        backgroundImage: yang ? undefined :
          `linear-gradient(to right, var(--yin) 0, var(--yin) ${w*0.375}px, transparent ${w*0.375}px, transparent ${w*0.625}px, var(--yin) ${w*0.625}px, var(--yin) ${w}px)`,
      }}
    />
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
