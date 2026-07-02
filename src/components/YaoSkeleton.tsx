'use client'

export default function YaoSkeleton({ size = 320 }: { size?: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-[4px] animate-pulse"
      style={{ width: size, height: size * 0.75 }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="rounded-sm bg-[var(--border)]"
          style={{ width: 80, height: 8, opacity: 1 - i * 0.12 }}
        />
      ))}
    </div>
  )
}
