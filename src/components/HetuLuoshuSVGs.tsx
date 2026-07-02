// 河图洛书 — SVG 图表组件（从 hetu-luoshu/page.tsx 提取）

export function HetuSVG() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[340px] mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hetu-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="175" fill="url(#hetu-bg)" />

      {/* 中心：天五生土，地十成之 —— 5 和 10 */}
      <g transform="translate(200,200)">
        {[0,1,2,3,4].map(i => {
          const a = i * 72 - 90
          const r = 18
          return <circle key={`c5-${i}`} cx={r*Math.cos(a*Math.PI/180)} cy={r*Math.sin(a*Math.PI/180)} r="5" fill="#f59e0b" opacity="0.9" />
        })}
        {[0,1,2,3,4].map(i => {
          const a = i * 72 - 90
          const r = 32
          return <circle key={`c10-${i}`} cx={r*Math.cos(a*Math.PI/180)} cy={r*Math.sin(a*Math.PI/180)} r="5" fill="#b45309" opacity="0.7" />
        })}
        <text x="-4" y="4" fontSize="11" fill="#b45309" fontWeight="700" textAnchor="middle" dominantBaseline="central">土</text>
      </g>

      {/* 北：天一生水，地六成之 —— 1 和 6 */}
      <g transform="translate(200,50)">
        <circle cx="0" cy="0" r="5" fill="#3b82f6" />
        <circle cx="-22" cy="10" r="4" fill="#1d4ed8" opacity="0.7" />
        <circle cx="0" cy="10" r="4" fill="#1d4ed8" opacity="0.7" />
        <circle cx="22" cy="10" r="4" fill="#1d4ed8" opacity="0.7" />
        <circle cx="-11" cy="20" r="4" fill="#1d4ed8" opacity="0.7" />
        <circle cx="11" cy="20" r="4" fill="#1d4ed8" opacity="0.7" />
        <text x="0" y="36" fontSize="10" fill="#3b82f6" fontWeight="600" textAnchor="middle">水·北</text>
      </g>

      {/* 南：地二生火，天七成之 —— 2 和 7 */}
      <g transform="translate(200,350)">
        <circle cx="0" cy="0" r="5" fill="#3b82f6" />
        <circle cx="0" cy="0" r="5" fill="#3b82f6" />
        <circle cx="-20" cy="16" r="4" fill="#ef4444" opacity="0.7" />
        <circle cx="0" cy="16" r="4" fill="#ef4444" opacity="0.7" />
        <circle cx="20" cy="16" r="4" fill="#ef4444" opacity="0.7" />
        <circle cx="-10" cy="28" r="4" fill="#ef4444" opacity="0.7" />
        <circle cx="10" cy="28" r="4" fill="#ef4444" opacity="0.7" />
        <circle cx="0" cy="40" r="4" fill="#ef4444" opacity="0.7" />
        <text x="0" y="52" fontSize="10" fill="#ef4444" fontWeight="600" textAnchor="middle">火·南</text>
      </g>

      {/* 东：天三生木，地八成之 —— 3 和 8 */}
      <g transform="translate(50,200)">
        <circle cx="0" cy="0" r="5" fill="#3b82f6" />
        <circle cx="0" cy="-10" r="4" fill="#22c55e" opacity="0.7" />
        <circle cx="0" cy="10" r="4" fill="#22c55e" opacity="0.7" />
        <circle cx="0" cy="-20" r="4" fill="#22c55e" opacity="0.7" />
        <circle cx="0" cy="20" r="4" fill="#22c55e" opacity="0.7" />
        <circle cx="0" cy="30" r="4" fill="#22c55e" opacity="0.7" />
        <circle cx="0" cy="-30" r="4" fill="#22c55e" opacity="0.7" />
        <circle cx="0" cy="40" r="4" fill="#22c55e" opacity="0.7" />
        <text x="-16" y="0" fontSize="10" fill="#22c55e" fontWeight="600" textAnchor="end" dominantBaseline="central">木·东</text>
      </g>

      {/* 西：地四生金，天九成之 —— 4 和 9 */}
      <g transform="translate(350,200)">
        <circle cx="0" cy="-10" r="4" fill="#3b82f6" />
        <circle cx="0" cy="10" r="4" fill="#3b82f6" />
        <circle cx="0" cy="-20" r="4" fill="#a855f7" opacity="0.7" />
        <circle cx="0" cy="20" r="4" fill="#a855f7" opacity="0.7" />
        <circle cx="0" cy="-30" r="4" fill="#a855f7" opacity="0.7" />
        <circle cx="0" cy="30" r="4" fill="#a855f7" opacity="0.7" />
        <circle cx="0" cy="-40" r="4" fill="#a855f7" opacity="0.7" />
        <circle cx="0" cy="40" r="4" fill="#a855f7" opacity="0.7" />
        <circle cx="0" cy="0" r="5" fill="#3b82f6" />
        <text x="16" y="0" fontSize="10" fill="#a855f7" fontWeight="600" textAnchor="start" dominantBaseline="central">金·西</text>
      </g>

      {/* 标注连线 */}
      <line x1="200" y1="200" x2="200" y2="55" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="4,3" opacity="0.3" />
      <line x1="200" y1="200" x2="200" y2="345" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4,3" opacity="0.3" />
      <line x1="200" y1="200" x2="55" y2="200" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="4,3" opacity="0.3" />
      <line x1="200" y1="200" x2="345" y2="200" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="4,3" opacity="0.3" />

      {/* 数字标注 */}
      <text x="200" y="15" fontSize="10" fill="#3b82f6" fontWeight="700" textAnchor="middle" opacity="0.6">1·6 水</text>
      <text x="200" y="395" fontSize="10" fill="#ef4444" fontWeight="700" textAnchor="middle" opacity="0.6">2·7 火</text>
      <text x="12" y="205" fontSize="10" fill="#22c55e" fontWeight="700" textAnchor="start" opacity="0.6">3·8 木</text>
      <text x="388" y="205" fontSize="10" fill="#a855f7" fontWeight="700" textAnchor="end" opacity="0.6">4·9 金</text>
      <text x="230" y="220" fontSize="10" fill="#b45309" fontWeight="700" opacity="0.6">5·10 土</text>

      <text x="200" y="118" fontSize="9" fill="var(--muted)" textAnchor="middle" opacity="0.4">生数·天</text>
      <text x="200" y="290" fontSize="9" fill="var(--muted)" textAnchor="middle" opacity="0.4">成数·地</text>
    </svg>
  )
}

export function LuoshuSVG() {
  const magicSquare = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6],
  ]
  const direction = [
    ['☷', '☰', '☶'],
    ['☳', '●', '☱'],
    ['☵', '☲', '☴'],
  ]
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[340px] mx-auto" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(40,40)">
        {[0,1,2,3].map(i => (
          <line key={`h${i}`} x1="0" y1={i*106.67} x2="320" y2={i*106.67} stroke="#d97706" strokeWidth="1" opacity="0.25" />
        ))}
        {[0,1,2,3].map(i => (
          <line key={`v${i}`} x1={i*106.67} y1="0" x2={i*106.67} y2="320" stroke="#d97706" strokeWidth="1" opacity="0.25" />
        ))}

        {magicSquare.map((row, ri) =>
          row.map((num, ci) => {
            const cx = ci * 106.67 + 53.33
            const cy = ri * 106.67 + 53.33
            const isCenter = num === 5
            const isEven = num % 2 === 0
            return (
              <g key={`cell-${ri}-${ci}`}>
                <circle cx={cx} cy={cy} r={isCenter ? 28 : 22} fill={isCenter ? '#f59e0b' : isEven ? '#3b82f6' : '#ef4444'} opacity={isCenter ? 0.25 : 0.15} />
                <text x={cx} y={cy - 3} fontSize={isCenter ? 28 : 22} fill={isCenter ? '#b45309' : isEven ? '#1d4ed8' : '#b91c1c'} fontWeight="700" textAnchor="middle" dominantBaseline="central">
                  {num}
                </text>
                <text x={cx} y={cy + (isCenter ? 22 : 18)} fontSize="10" fill="var(--muted)" textAnchor="middle" dominantBaseline="central" opacity="0.5">
                  {direction[ri][ci]}
                </text>
              </g>
            )
          })
        )}
      </g>
      <text x="200" y="378" fontSize="10" fill="var(--muted)" textAnchor="middle" opacity="0.5">
        戴九履一，左三右七，二四为肩，六八为足
      </text>
    </svg>
  )
}

export function CompareSVG() {
  return (
    <svg viewBox="0 0 400 200" className="w-full max-w-[400px] mx-auto" xmlns="http://www.w3.org/2000/svg">
      {/* 河图——十字形 */}
      <g transform="translate(100,100)">
        <circle cx="0" cy="-40" r="4" fill="#3b82f6" />
        <circle cx="0" cy="-55" r="4" fill="#1d4ed8" opacity="0.6" />
        {[-15,0,15].map((x,i) => <circle key={`n6-${i}`} cx={x} cy="-65" r="3" fill="#1d4ed8" opacity="0.6" />)}
        {[-7,7].map(x => <circle key={`n6b-${x}`} cx={x} cy="-75" r="3" fill="#1d4ed8" opacity="0.6" />)}

        <circle cx="0" cy="40" r="4" fill="#3b82f6" />
        {[-15,0,15].map(x => <circle key={`s7-${x}`} cx={x} cy="55" r="3" fill="#ef4444" opacity="0.6" />)}
        {[-7,7].map(x => <circle key={`s7b-${x}`} cx={x} cy="65" r="3" fill="#ef4444" opacity="0.6" />)}
        <circle cx="0" cy="75" r="3" fill="#ef4444" opacity="0.6" />

        <circle cx="-40" cy="0" r="4" fill="#3b82f6" />
        {[-15,15].map(y => <circle key={`e8-${y}`} cx="-55" cy={y} r="3" fill="#22c55e" opacity="0.6" />)}
        {[-30,30].map(y => <circle key={`e8b-${y}`} cx="-65" cy={y} r="3" fill="#22c55e" opacity="0.6" />)}
        <circle cx="-75" cy="0" r="3" fill="#22c55e" opacity="0.6" />

        <circle cx="40" cy="0" r="4" fill="#3b82f6" />
        {[-15,15].map(y => <circle key={`w9-${y}`} cx="55" cy={y} r="3" fill="#a855f7" opacity="0.6" />)}
        {[-30,30].map(y => <circle key={`w9b-${y}`} cx="65" cy={y} r="3" fill="#a855f7" opacity="0.6" />)}
        <circle cx="75" cy="0" r="3" fill="#a855f7" opacity="0.6" />

        <circle cx="0" cy="0" r="5" fill="#f59e0b" />
        {[0,1,2,3,4].map(i => {
          const a = i*72-90; return <circle key={`10-${i}`} cx={16*Math.cos(a*Math.PI/180)} cy={16*Math.sin(a*Math.PI/180)} r="3" fill="#b45309" opacity="0.6" />
        })}

        <text x="0" y="-90" fontSize="8" fill="var(--muted)" textAnchor="middle">河图 · 十字</text>
      </g>

      {/* 洛书——九宫方阵 */}
      <g transform="translate(315,100)">
        {[0,1,2,3].map(i => (
          <line key={`lh${i}`} x1="-60" y1={-60+i*40} x2="60" y2={-60+i*40} stroke="#d97706" strokeWidth="0.8" opacity="0.25" />
        ))}
        {[0,1,2,3].map(i => (
          <line key={`lv${i}`} x1={-60+i*40} y1="-60" x2={-60+i*40} y2="60" stroke="#d97706" strokeWidth="0.8" opacity="0.25" />
        ))}

        {[[4,9,2],[3,5,7],[8,1,6]].map((row, ri) =>
          row.map((n, ci) => {
            const x = -40 + ci * 40
            const y = -40 + ri * 40
            return <text key={`n${ri}-${ci}`} x={x} y={y} fontSize="16" fill={n%2===0 ? '#3b82f6' : '#ef4444'} fontWeight="700" textAnchor="middle" dominantBaseline="central">{n}</text>
          })
        )}

        <text x="0" y="-80" fontSize="8" fill="var(--muted)" textAnchor="middle">洛书 · 九宫</text>
      </g>

      {/* 连接箭头 */}
      <line x1="170" y1="100" x2="215" y2="100" stroke="#d97706" strokeWidth="1" strokeDasharray="5,3" opacity="0.4" />
      <polygon points="215,95 225,100 215,105" fill="#d97706" opacity="0.4" />

      <line x1="170" y1="105" x2="215" y2="105" stroke="#d97706" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.25" />
      <line x1="170" y1="95" x2="215" y2="95" stroke="#d97706" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.25" />
    </svg>
  )
}
