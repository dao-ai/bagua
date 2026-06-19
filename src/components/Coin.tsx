'use client'

export default function Coin({ face, size = 72, flipping }: {
  face: 'front' | 'back'
  size?: number
  flipping?: boolean
}) {
  const r = size / 2
  const hs = size * 0.17
  const fs = size * 0.18

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      className={flipping ? 'animate-[fl_0.12s_ease-in-out_4]' : ''}
      style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.35))' }}
    >
      <defs>
        <radialGradient id={`cg-${size}-${face}`} cx="42%" cy="38%" r="58%">
          <stop offset="0%" stopColor="#e8c840" />
          <stop offset="35%" stopColor="#d4a830" />
          <stop offset="70%" stopColor="#bf9020" />
          <stop offset="100%" stopColor="#a07810" />
        </radialGradient>
      </defs>

      <circle cx={r} cy={r} r={r - 1.5}
        fill={`url(#cg-${size}-${face})`}
        stroke="#8a6810" strokeWidth={2} />

      <circle cx={r} cy={r} r={r * 0.68}
        fill="none" stroke="#b89020" strokeWidth={0.8} opacity="0.4" />

      <rect x={r - hs} y={r - hs} width={hs * 2} height={hs * 2}
        fill="#1a0e04" stroke="#6a5010" strokeWidth={1} />

      {face === 'front' ? (
        <>
          <text x={r} y={r - hs - 8} textAnchor="middle" dominantBaseline="central"
            fontSize={fs} fill="#3a2000" fontWeight="bold"
            fontFamily="'Noto Serif SC','SimSun',serif">洪</text>
          <text x={r} y={r + hs + 8} textAnchor="middle" dominantBaseline="central"
            fontSize={fs} fill="#3a2000" fontWeight="bold"
            fontFamily="'Noto Serif SC','SimSun',serif">武</text>
          <text x={r - hs - 8} y={r} textAnchor="middle" dominantBaseline="central"
            fontSize={fs * 0.85} fill="#3a2000" fontWeight="bold"
            fontFamily="'Noto Serif SC','SimSun',serif">通</text>
          <text x={r + hs + 8} y={r} textAnchor="middle" dominantBaseline="central"
            fontSize={fs * 0.85} fill="#3a2000" fontWeight="bold"
            fontFamily="'Noto Serif SC','SimSun',serif">寶</text>
        </>
      ) : (
        <>
          <text x={r} y={r - hs - 8} textAnchor="middle" dominantBaseline="central"
            fontSize={fs} fill="#3a2000" fontWeight="bold"
            fontFamily="'Noto Serif SC','SimSun',serif">小</text>
          <text x={r} y={r + hs + 8} textAnchor="middle" dominantBaseline="central"
            fontSize={fs} fill="#3a2000" fontWeight="bold"
            fontFamily="'Noto Serif SC','SimSun',serif">平</text>
        </>
      )}
    </svg>
  )
}
