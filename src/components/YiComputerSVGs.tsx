// 易经与计算机 — SVG 图表组件（从 yijing-computer/page.tsx 提取）

export function TaijiToBitSVG() {
  return (
    <svg viewBox="0 0 700 160" className="w-full max-w-[680px] mx-auto" xmlns="http://www.w3.org/2000/svg">
      {/* 太极 */}
      <g transform="translate(70,80)">
        <circle r="28" fill="none" stroke="#d97706" strokeWidth="2" opacity="0.8" />
        <circle cx="0" cy="-10" r="12" fill="#d97706" opacity="0.6" />
        <circle cx="0" cy="10" r="12" fill="#ef4444" opacity="0.4" />
        <circle cx="0" cy="-10" r="4" fill="#ef4444" />
        <circle cx="0" cy="10" r="4" fill="#d97706" />
        <text x="0" y="46" fontSize="11" fill="#d97706" fontWeight="700" textAnchor="middle">太极</text>
      </g>

      {/* 箭头 */}
      <line x1="102" y1="80" x2="142" y2="80" stroke="#d97706" strokeWidth="1.5" opacity="0.4" />
      <polygon points="145,75 155,80 145,85" fill="#d97706" opacity="0.4" />

      {/* 两仪 / 阴阳 */}
      <g transform="translate(200,80)">
        <rect x="-32" y="-18" width="28" height="36" rx="4" fill="#d97706" opacity="0.2" stroke="#d97706" strokeWidth="1" />
        <text x="-18" y="5" fontSize="16" fill="#d97706" fontWeight="700" textAnchor="middle">⚊</text>
        <text x="-18" y="40" fontSize="9" fill="#d97706" textAnchor="middle">阳 · 1 · On</text>

        <rect x="4" y="-18" width="28" height="36" rx="4" fill="#ef4444" opacity="0.15" stroke="#ef4444" strokeWidth="1" />
        <text x="18" y="5" fontSize="16" fill="#ef4444" fontWeight="700" textAnchor="middle">⚋</text>
        <text x="18" y="40" fontSize="9" fill="#ef4444" textAnchor="middle">阴 · 0 · Off</text>
      </g>

      {/* 四象 */}
      <line x1="270" y1="80" x2="310" y2="80" stroke="#d97706" strokeWidth="1" opacity="0.3" />
      <polygon points="313,75 323,80 313,85" fill="#d97706" opacity="0.3" />

      <g transform="translate(370,80)">
        <rect x="-78" y="-18" width="22" height="36" rx="4" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="0.8" />
        <text x="-67" y="5" fontSize="12" fill="#f59e0b" fontWeight="700" textAnchor="middle">⚊⚊</text>
        <text x="-67" y="40" fontSize="8" fill="var(--muted)" textAnchor="middle">11</text>

        <rect x="-52" y="-18" width="22" height="36" rx="4" fill="#3b82f6" opacity="0.15" stroke="#3b82f6" strokeWidth="0.8" />
        <text x="-41" y="5" fontSize="12" fill="#3b82f6" fontWeight="700" textAnchor="middle">⚊⚋</text>
        <text x="-41" y="40" fontSize="8" fill="var(--muted)" textAnchor="middle">10</text>

        <rect x="-26" y="-18" width="22" height="36" rx="4" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="0.8" />
        <text x="-15" y="5" fontSize="12" fill="#22c55e" fontWeight="700" textAnchor="middle">⚋⚊</text>
        <text x="-15" y="40" fontSize="8" fill="var(--muted)" textAnchor="middle">01</text>

        <rect x="0" y="-18" width="22" height="36" rx="4" fill="#ef4444" opacity="0.15" stroke="#ef4444" strokeWidth="0.8" />
        <text x="11" y="5" fontSize="12" fill="#ef4444" fontWeight="700" textAnchor="middle">⚋⚋</text>
        <text x="11" y="40" fontSize="8" fill="var(--muted)" textAnchor="middle">00</text>

        <text x="-34" y="60" fontSize="9" fill="var(--muted)" textAnchor="middle" opacity="0.6">四象 · 2 比特</text>
      </g>

      {/* 八卦 */}
      <line x1="450" y1="80" x2="490" y2="80" stroke="#d97706" strokeWidth="1" opacity="0.3" />
      <polygon points="493,75 503,80 493,85" fill="#d97706" opacity="0.3" />

      <g transform="translate(580,80)">
        {[
          { y: -36, line: '☰', bin: '111', label: '乾' },
          { y: -24, line: '☱', bin: '110', label: '兑' },
          { y: -12, line: '☲', bin: '101', label: '离' },
          { y: 0, line: '☳', bin: '100', label: '震' },
          { y: 12, line: '☴', bin: '011', label: '巽' },
          { y: 24, line: '☵', bin: '010', label: '坎' },
          { y: 36, line: '☶', bin: '001', label: '艮' },
          { y: 48, line: '☷', bin: '000', label: '坤' },
        ].map((s, i) => (
          <g key={i}>
            <text x="-65" y={s.y + 5} fontSize="12" fill="var(--fg)" textAnchor="middle">{s.line}</text>
            <text x="-49" y={s.y + 5} fontSize="8" fill="#f59e0b" opacity="0.7" textAnchor="middle" fontFamily="monospace">{s.bin}</text>
            <text x="-33" y={s.y + 5} fontSize="8" fill="var(--muted)" textAnchor="middle" opacity="0.5">{s.label}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}

// ─── 莱布尼茨与二进制 SVG ───

export function LeibnizBinarySVG() {
  return (
    <svg viewBox="0 0 700 280" className="w-full max-w-[680px] mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="yin-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="yang-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d97706" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* 标题 */}
      <text x="350" y="30" fontSize="14" fill="var(--fg)" fontWeight="700" textAnchor="middle">邵雍先天次序 vs 莱布尼茨二进制</text>

      {/* 邵雍先天八卦次序 */}
      <text x="175" y="55" fontSize="11" fill="#d97706" fontWeight="600" textAnchor="middle">邵雍 · 先天八卦次序</text>
      <text x="175" y="70" fontSize="9" fill="var(--muted)" textAnchor="middle" opacity="0.5">阴为0 · 阳为1 · 自下而上</text>

      {[
        { bin: '000', yang: [2], yin: [0,1] },
        { bin: '001', yang: [2], yin: [0,1] },
        { bin: '010', yang: [1], yin: [0,2] },
        { bin: '011', yang: [1,2], yin: [0] },
        { bin: '100', yang: [0], yin: [1,2] },
        { bin: '101', yang: [2], yin: [0,1] },
        { bin: '110', yang: [0,1], yin: [2] },
        { bin: '111', yang: [0,1,2], yin: [] },
      ].map((gua, gi) => {
        const x = 35 + gi * 35
        const baseY = 100
        return (
          <g key={gi}>
            {/* 卦象 —— 阴爻断开，阳爻实线 */}
            {[0,1,2].map(row => {
              const yy = baseY + row * 14
              const isYang = gua.yang.includes(row)
              if (isYang) {
                return <rect key={row} x={x-8} y={yy} width={16} height={8} rx={2} fill="#d97706" opacity={0.8} />
              } else {
                return (
                  <g key={row}>
                    <rect x={x-8} y={yy} width={6} height={8} rx={1} fill="#ef4444" opacity={0.7} />
                    <rect x={x+2} y={yy} width={6} height={8} rx={1} fill="#ef4444" opacity={0.7} />
                  </g>
                )
              }
            })}
            {/* 二进制 */}
            <text x={x} y={baseY + 48} fontSize="8" fill="#f59e0b" fontFamily="monospace" textAnchor="middle" fontWeight="600">{gua.bin}</text>
          </g>
        )
      })}

      {/* 箭头 */}
      <line x1="350" y1="160" x2="350" y2="185" stroke="#d97706" strokeWidth="1.5" opacity="0.4" />
      <polygon points="345,185 350,195 355,185" fill="#d97706" opacity="0.4" />

      {/* 莱布尼茨 */}
      <text x="350" y="215" fontSize="11" fill="#3b82f6" fontWeight="600" textAnchor="middle">莱布尼茨 · 二进制数</text>
      <text x="350" y="230" fontSize="9" fill="var(--muted)" textAnchor="middle" opacity="0.5">左为最低位（LSB）</text>

      {[0,1,2,3,4,5,6,7].map(n => {
        const x = 35 + n * 35
        return (
          <g key={n}>
            <rect x={x-14} y={248} width={28} height={22} rx={4} fill="#3b82f6" opacity="0.15" stroke="#3b82f6" strokeWidth="0.8" />
            <text x={x} y={263} fontSize="11" fill="#3b82f6" fontFamily="monospace" fontWeight="700" textAnchor="middle">{n}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── 六爻 ↔ 6比特 SVG ───

export function SixBitSVG() {
  return (
    <svg viewBox="0 0 680 200" className="w-full max-w-[660px] mx-auto" xmlns="http://www.w3.org/2000/svg">
      {/* 乾为天 ䷀（111111）*/}
      <g transform="translate(40,20)">
        <rect x={0} y={0} width={80} height={160} rx={8} fill="#d97706" opacity="0.08" stroke="#d97706" strokeWidth="0.8" />
        <text x={40} y={-6} fontSize="11" fill="#d97706" fontWeight="700" textAnchor="middle">䷀ 乾为天</text>
        <text x={40} y={186} fontSize="8" fill="var(--muted)" textAnchor="middle" fontFamily="monospace" opacity="0.5">111111</text>
        {[0,1,2,3,4,5].map(i => (
          <rect key={i} x={8} y={14 + i*24} width={64} height={12} rx={2} fill="#d97706" opacity={0.7} />
        ))}
      </g>

      {/* 坤为地 ䷁（000000）*/}
      <g transform="translate(160,20)">
        <rect x={0} y={0} width={80} height={160} rx={8} fill="#ef4444" opacity="0.08" stroke="#ef4444" strokeWidth="0.8" />
        <text x={40} y={-6} fontSize="11" fill="#ef4444" fontWeight="700" textAnchor="middle">䷁ 坤为地</text>
        <text x={40} y={186} fontSize="8" fill="var(--muted)" textAnchor="middle" fontFamily="monospace" opacity="0.5">000000</text>
        {[0,1,2,3,4,5].map(i => (
          <g key={i}>
            <rect x={8} y={14 + i*24} width={28} height={12} rx={2} fill="#ef4444" opacity={0.7} />
            <rect x={44} y={14 + i*24} width={28} height={12} rx={2} fill="#ef4444" opacity={0.7} />
          </g>
        ))}
      </g>

      {/* 既济 ䷾（101010）*/}
      <g transform="translate(280,20)">
        <rect x={0} y={0} width={80} height={160} rx={8} fill="#22c55e" opacity="0.08" stroke="#22c55e" strokeWidth="0.8" />
        <text x={40} y={-6} fontSize="11" fill="#22c55e" fontWeight="700" textAnchor="middle">䷾ 既济</text>
        <text x={40} y={186} fontSize="8" fill="var(--muted)" textAnchor="middle" fontFamily="monospace" opacity="0.5">101010</text>
        {[0,1,2,3,4,5].map(i => {
          const isYang = i % 2 === 0
          if (isYang) {
            return <rect key={i} x={8} y={14 + i*24} width={64} height={12} rx={2} fill="#d97706" opacity={0.7} />
          } else {
            return (
              <g key={i}>
                <rect x={8} y={14 + i*24} width={28} height={12} rx={2} fill="#ef4444" opacity={0.7} />
                <rect x={44} y={14 + i*24} width={28} height={12} rx={2} fill="#ef4444" opacity={0.7} />
              </g>
            )
          }
        })}
      </g>

      {/* 未济 ䷿（010101）*/}
      <g transform="translate(400,20)">
        <rect x={0} y={0} width={80} height={160} rx={8} fill="#3b82f6" opacity="0.08" stroke="#3b82f6" strokeWidth="0.8" />
        <text x={40} y={-6} fontSize="11" fill="#3b82f6" fontWeight="700" textAnchor="middle">䷿ 未济</text>
        <text x={40} y={186} fontSize="8" fill="var(--muted)" textAnchor="middle" fontFamily="monospace" opacity="0.5">010101</text>
        {[0,1,2,3,4,5].map(i => {
          const isYang = i % 2 === 1
          if (isYang) {
            return <rect key={i} x={8} y={14 + i*24} width={64} height={12} rx={2} fill="#d97706" opacity={0.7} />
          } else {
            return (
              <g key={i}>
                <rect x={8} y={14 + i*24} width={28} height={12} rx={2} fill="#ef4444" opacity={0.7} />
                <rect x={44} y={14 + i*24} width={28} height={12} rx={2} fill="#ef4444" opacity={0.7} />
              </g>
            )
          }
        })}
      </g>

      {/* 数据量标注 */}
      <text x="350" y="120" fontSize="22" fill="var(--muted)" textAnchor="middle" opacity="0.08" fontWeight="700">2⁶ = 64</text>

      {/* 6比特 = 字节对齐 */}
      <g transform="translate(520,40)">
        <rect x={0} y={0} width={120} height={28} rx={6} fill="#a855f7" opacity="0.15" stroke="#a855f7" strokeWidth="0.8" />
        <text x={60} y={19} fontSize="11" fill="#a855f7" fontWeight="600" textAnchor="middle">一个字节 = 8 比特</text>
      </g>
      <g transform="translate(520,78)">
        <rect x={0} y={0} width={120} height={28} rx={6} fill="#a855f7" opacity="0.1" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="4,2" />
        <text x={60} y={19} fontSize="11" fill="#a855f7" fontWeight="600" opacity="0.5" textAnchor="middle">半个字节 = 4 比特</text>
      </g>
      <g transform="translate(520,116)">
        <rect x={0} y={0} width={120} height={28} rx={6} fill="#a855f7" opacity="0.1" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="4,2" />
        <text x={60} y={19} fontSize="11" fill="#a855f7" fontWeight="600" opacity="0.5" textAnchor="middle">六十四卦 = 6 比特</text>
      </g>
    </svg>
  )
}

// ─── 逻辑门 ↔ 八卦 SVG ───

export function LogicGateSVG() {
  const gates = [
    { symbol: 'AND', desc: '与门', truth: '00→0 01→0 10→0 11→1', relation: '阴阳两爻皆阳方为阳——纯阳' },
    { symbol: 'OR', desc: '或门', truth: '00→0 01→1 10→1 11→1', relation: '有一阳即为阳——阳动' },
    { symbol: 'XOR', desc: '异或门', truth: '00→0 01→1 10→1 11→0', relation: '阴阳相异则动——如"一阴一阳之谓道"' },
    { symbol: 'NOT', desc: '非门', truth: '0→1 1→0', relation: '阳极阴生，阴极阳生——物极必反' },
  ]
  return (
    <svg viewBox="0 0 680 220" className="w-full max-w-[660px] mx-auto" xmlns="http://www.w3.org/2000/svg">
      <text x="340" y="25" fontSize="13" fill="var(--fg)" fontWeight="700" textAnchor="middle">逻辑门 ↔ 阴阳爻的关系</text>
      {gates.map((g, i) => {
        const x = 25 + i * 165
        return (
          <g key={i} transform={`translate(${x},50)`}>
            <rect x={0} y={0} width={150} height={160} rx={8} fill="var(--bg3)" opacity="0.3" stroke="var(--border)" strokeWidth="0.8" />
            <text x={75} y={24} fontSize="13" fill="#d97706" fontWeight="800" fontFamily="monospace" textAnchor="middle">{g.symbol}</text>
            <text x={75} y={42} fontSize="10" fill="var(--muted)" textAnchor="middle">{g.desc}</text>
            <line x1={15} y1={52} x2={135} y2={52} stroke="var(--border)" strokeWidth="0.5" opacity="0.3" />
            <text x={75} y={72} fontSize="9" fill="#22c55e" fontFamily="monospace" textAnchor="middle">{g.truth}</text>
            <line x1={15} y1={82} x2={135} y2={82} stroke="var(--border)" strokeWidth="0.5" opacity="0.3" />
            <text x={75} y={102} fontSize="9" fill="var(--fg)" textAnchor="middle" opacity="0.7">☯ 易理对应</text>
            <text x={75} y={122} fontSize="9" fill="#a855f7" textAnchor="middle" opacity="0.8">{g.relation}</text>
          </g>
        )
      })}
    </svg>
  )
}


// ─── 数据 ───

