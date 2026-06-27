'use client'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'

// ─── 九星数据 ───

export interface StarInfo {
  num: number          // 1-9
  name: string         // 贪狼巨门…
  short: string        // 简称
  element: string      // 五行
  color: string        // 颜色名
  hexColor: string     // 颜色值
  hexLight: string     // 浅色背景
  nature: '吉' | '凶' | '平'
  meaning: string
  affairs: string      // 管事领域
  story: string        // 深层含义
}

const STARS: StarInfo[] = [
  { num: 1, name: '贪狼', short: '一白', element: '水', color: '白', hexColor: '#3b82f6', hexLight: '#dbeafe', nature: '吉', meaning: '桃花、人缘、财运', affairs: '感情、社交、升职', story: '一白为吉星之最，主官升财旺、桃花人缘。在九星中唯一属水，水主智、主财，故一白到宫多主聪明才智和财富机遇。但水亦主淫，桃花过旺则需谨慎。' },
  { num: 2, name: '巨门', short: '二黑', element: '土', color: '黑', hexColor: '#b91c1c', hexLight: '#fee2e2', nature: '凶', meaning: '病符、是非', affairs: '健康、口舌、官司', story: '二黑为病符星，主疾病、伤痛、是非。二黑入中或到宫，需防肠胃疾病和是非口舌。但二黑本身不是纯粹的凶——巨门为坤土，有承载之意，得其制则为安稳。不可一味惧怕，而是要注意防护。' },
  { num: 3, name: '禄存', short: '三碧', element: '木', color: '碧', hexColor: '#16a34a', hexLight: '#dcfce7', nature: '凶', meaning: '口舌、官非', affairs: '争吵、诉讼、小人', story: '三碧主口舌官非，为"蚩尤星"。三碧入宫易引发争执、诉讼、人际关系紧张。但三碧也为文星（文昌之辅），学艺之人遇之反能激发好胜心和进取精神。' },
  { num: 4, name: '文曲', short: '四绿', element: '木', color: '绿', hexColor: '#22c55e', hexLight: '#bbf7d0', nature: '吉', meaning: '文昌、学业', affairs: '考试、文章、名声', story: '四绿文昌星，主宰功名、学业、文章、仕途。四绿入宫，科甲有望、文思泉涌。如果家中有学生，四绿到的方位最宜布置书房。但四绿也主"风"（巽为风），心思活跃之人也容易心绪不宁，需要定力。' },
  { num: 5, name: '廉贞', short: '五黄', element: '土', color: '黄', hexColor: '#b45309', hexLight: '#fef3c7', nature: '凶', meaning: '五黄大煞', affairs: '灾祸、意外、重病', story: '五黄是九星中最凶的"大煞星"——"五黄所到之处，百事不吉"。五黄入中或飞临某宫，该年该方位需格外谨慎，不宜动土、装修、兴工。五黄又称"正关煞"，可化不可抗。化解之法：用铜钱或金属制品泄土气。但也不要过度恐惧——五黄土旺极之时，用金泄之即可。' },
  { num: 6, name: '武曲', short: '六白', element: '金', color: '白', hexColor: '#a855f7', hexLight: '#f3e8ff', nature: '吉', meaning: '偏财、权力', affairs: '武职、管理、投资', story: '六白武曲星，主权位、偏财、管理能力。与一白并列为"官星双璧"——一白主文官，六白主武职。六白入宫，利于升迁、投资、开拓事业。但六白也主"刚"，过刚则折，需以柔克刚。' },
  { num: 7, name: '破军', short: '七赤', element: '金', color: '赤', hexColor: '#dc2626', hexLight: '#fecaca', nature: '凶', meaning: '破财、盗贼', affairs: '破财、口舌、手术', story: '七赤破军星，主破败、损失、盗贼、手术。七赤入宫，需防财物损失、投资风险、意外之灾。但七赤也主"说"（兑为口——有口才之意），所以演说家、主持人反而喜七赤。七赤的凶在于"破"，但"不破不立"——旧的不去新的不来。' },
  { num: 8, name: '左辅', short: '八白', element: '土', color: '白', hexColor: '#d97706', hexLight: '#fef9c3', nature: '吉', meaning: '正财、吉庆', affairs: '财运、置业、婚姻', story: '八白左辅星，正财星、吉庆星。八白当运（八运2004-2023年），是九星中力量最强的吉星。主财运亨通、事业兴旺、喜事连连。八白入宫是最佳的财位。但八白也主"囤积"——如果布局不当，可能贪得无厌，反而受累。' },
  { num: 9, name: '右弼', short: '九紫', element: '火', color: '紫', hexColor: '#e11d48', hexLight: '#fce7f3', nature: '吉', meaning: '喜事、姻缘', affairs: '婚姻、庆典、创作', story: '九紫右弼星，主喜庆、姻缘、光明。九紫入宫，利于婚嫁、添丁、开业等喜庆之事。九紫为"未来星"——在八运（2004-2023）之后的下元九运（2024-2043）中，九紫当运，成为力量最强的星。离火主文明、科技、艺术，所以九运是文化创意和科技的时代。' },
]

// ─── 九宫方位数据 ───

interface Palace {
  position: string       // 方位名
  luoshuNum: number      // 洛书数字
  trigram: string        // 卦
  direction: string      // 方向
  row: number            // 0-2
  col: number            // 0-2
}

const PALACES: Palace[] = [
  { position: '西北·乾', luoshuNum: 6, trigram: '䷀', direction: '西北', row: 0, col: 2 },
  { position: '正西·兑', luoshuNum: 7, trigram: '䷹', direction: '西',   row: 1, col: 2 },
  { position: '东北·艮', luoshuNum: 8, trigram: '䷳', direction: '东北', row: 2, col: 2 },
  { position: '正南·离', luoshuNum: 9, trigram: '䷝', direction: '南',   row: 0, col: 1 },
  { position: '中宫',     luoshuNum: 5, trigram: '☯', direction: '中',   row: 1, col: 1 },
  { position: '正北·坎', luoshuNum: 1, trigram: '䷜', direction: '北',   row: 2, col: 1 },
  { position: '西南·坤', luoshuNum: 2, trigram: '䷁', direction: '西南', row: 0, col: 0 },
  { position: '正东·震', luoshuNum: 3, trigram: '䷲', direction: '东',   row: 1, col: 0 },
  { position: '东南·巽', luoshuNum: 4, trigram: '䷸', direction: '东南', row: 2, col: 0 },
]

// 九宫网格位置（row,col）-> palace index
const GRID_MAP: Record<string, number> = {
  '0,0': 6,  // 西南
  '0,1': 3,  // 南
  '0,2': 0,  // 西北
  '1,0': 7,  // 西
  '1,1': 4,  // 中
  '1,2': 1,  // 东（这是九宫在视觉上的布局——注意这里的 col 方向）
  '2,0': 8,  // 东南
  '2,1': 5,  // 北
  '2,2': 2,  // 东北
}

// 洛书飞行路径（顺飞）：从 5 开始，5→6→7→8→9→1→2→3→4
const FLIGHT_PATH = [5, 6, 7, 8, 9, 1, 2, 3, 4]

// ─── 核心计算 ───

/** 计算年飞星入中宫的星数（1-9） */
function annualCenterStar(year: number): number {
  const sum = String(year).split('').reduce((a, c) => a + Number(c), 0)
  const root = sum % 9 || 9
  // 2000年后的公式
  const center = 9 - root + 1
  return center > 9 ? center - 9 : center
}

/** 计算月飞星入中宫（1-9） */
function monthCenterStar(year: number, month: number): number {
  // 月份以农历月份为准，简化版本
  // 子年为1，丑年为2...
  // 这里使用简化算法
  const yearStem = year % 12
  const monthOffset = ((month + 2) % 12) + 1 // 正月为寅=3
  
  const years: Record<number, number> = {
    0: 8,  // 申
    1: 5,  // 酉
    2: 2,  // 戌
    3: 8,  // 亥
    4: 5,  // 子
    5: 2,  // 丑
    6: 8,  // 寅
    7: 5,  // 卯
    8: 2,  // 辰
    9: 8,  // 巳
    10: 5, // 午
    11: 2, // 未
  }
  
  const yearBase = years[yearStem] ?? 8
  // 正月（寅月）加0，二月加1...
  const monthAddition = (monthOffset - 3 + 12) % 12
  
  return ((yearBase + monthAddition - 1) % 9) + 1
}

/** 根据入中星数，计算各宫的飞星 */
function calculateStars(centerStar: number): number[] {
  // 找出入中星在飞行路径中的索引
  const startIdx = FLIGHT_PATH.indexOf(centerStar)
  // 为每个洛书数字分配对应的飞星
  // 洛书数字 5（中宫）→ centerStar
  // 洛书数字 6（乾）→ FLIGHT_PATH[(startIdx+1)%9]
  // ...
  const result: number[] = new Array(10) // 1-indexed
  for (let i = 0; i < 9; i++) {
    const luoshuNum = FLIGHT_PATH[i]
    const starNum = FLIGHT_PATH[(startIdx + i) % 9]
    result[luoshuNum] = starNum
  }
  return result // result[luoshuNum] = starNum
}

/** 月名 */
const MONTHS = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月',
]

/** 月对应农历 */
function toLunarMonth(year: number, calendarMonth: number): number {
  // 公历月份粗略对应农历月份（年初月份）
  // 简化处理：公历月份-1作为农历月份近似
  // 实际上需要查农历，这里做简化
  return ((calendarMonth + 9) % 12) + 1
}

// ─── 组件 ───

export default function FlyingStars() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [useMonth, setUseMonth] = useState(false)
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [showPath, setShowPath] = useState(true)
  const [showLines, setShowLines] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [animStep, setAnimStep] = useState(-1)
  const [selectedStar, setSelectedStar] = useState<StarInfo | null>(null)
  const [focusedPalace, setFocusedPalace] = useState<number | null>(null)
  const [mode, setMode] = useState<'年' | '月'>('年')
  const animRef = useRef<number | null>(null)

  // 年飞星
  const yearCenter = useMemo(() => annualCenterStar(year), [year])
  const yearStars = useMemo(() => calculateStars(yearCenter), [yearCenter])

  // 月飞星
  const monthCenter = useMemo(() => monthCenterStar(year, month), [year, month])
  const monthStars = useMemo(() => calculateStars(monthCenter), [monthCenter])

  const activeStars = mode === '年' ? yearStars : monthStars

  // 选中的宫位对应的星
  const focusedStar = useMemo(
    () => focusedPalace !== null ? STARS[(activeStars[focusedPalace] ?? 1) - 1] : null,
    [focusedPalace, activeStars]
  )

  // 动画——逐步展示飞行路径
  const startAnimation = useCallback(() => {
    if (animating) return
    setAnimating(true)
    setAnimStep(0)
  }, [animating])

  useEffect(() => {
    if (!animating || animStep < 0) return
    if (animStep >= 9) {
      setAnimating(false)
      setAnimStep(-1)
      return
    }
    const timer = setTimeout(() => {
      setAnimStep(s => s + 1)
    }, 600)
    return () => clearTimeout(timer)
  }, [animating, animStep])

  const resetAnimation = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setAnimating(false)
    setAnimStep(-1)
  }, [])

  // 当 mode 或 year/month 变化时重置动画
  const handleModeChange = useCallback((newMode: '年' | '月') => {
    setMode(newMode)
    resetAnimation()
  }, [resetAnimation])

  const handleYearChange = useCallback((newYear: number) => {
    setYear(newYear)
    resetAnimation()
  }, [resetAnimation])

  const handleMonthChange = useCallback((newMonth: number) => {
    setMonth(newMonth)
    resetAnimation()
  }, [resetAnimation])

  return (
    <div>
      {/* 画布 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 九宫沙盘 */}
        <div className="lg:col-span-2">
          {/* 控制栏 */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {/* 模式切换 */}
            <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
              <button
                onClick={() => handleModeChange('年')}
                className={`px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                  mode === '年' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg3)] text-[var(--muted)] hover:text-[var(--fg)]'
                }`}
              >
                年飞星
              </button>
              <button
                onClick={() => handleModeChange('月')}
                className={`px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                  mode === '月' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg3)] text-[var(--muted)] hover:text-[var(--fg)]'
                }`}
              >
                月飞星
              </button>
            </div>

            {/* 年份 */}
            <div className="flex items-center gap-1">
              <button onClick={() => handleYearChange(year - 1)} className="p-1 text-[var(--muted)] hover:text-[var(--fg)] transition-colors">‹</button>
              <select
                value={year}
                onChange={e => handleYearChange(Number(e.target.value))}
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[var(--fg)] appearance-none cursor-pointer outline-none"
              >
                {Array.from({ length: 41 }, (_, i) => 2004 + i).map(y => (
                  <option key={y} value={y}>{y}年</option>
                ))}
              </select>
              <button onClick={() => handleYearChange(year + 1)} className="p-1 text-[var(--muted)] hover:text-[var(--fg)] transition-colors">›</button>
            </div>

            {/* 月份 */}
            {mode === '月' && (
              <select
                value={month}
                onChange={e => handleMonthChange(Number(e.target.value))}
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[var(--fg)] appearance-none cursor-pointer outline-none"
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            )}

            {/* 动画控制 */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={showPath ? resetAnimation : startAnimation}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                  showPath
                    ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10'
                    : 'border-[var(--border)] text-[var(--muted)] bg-[var(--bg3)]'
                }`}
              >
                {animating ? '🔄 播放中' : showPath ? '▶ 飞星路径' : '▶ 路径'}
              </button>
              <button
                onClick={() => setShowLines(!showLines)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                  showLines
                    ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10'
                    : 'border-[var(--border)] text-[var(--muted)] bg-[var(--bg3)]'
                }`}
              >
                {showLines ? '🔀 连线' : '🔀 连线'}
              </button>
            </div>
          </div>

          {/* 当前入中信息 */}
          <div className="mb-3 text-center">
            <span className="text-xs text-[var(--muted)]">
              {year}年{ mode === '月' ? `${month}月` : '' } ·
            </span>
            <span className="text-xs font-semibold text-[var(--fg)] ml-1">
              {STARS[(mode === '年' ? yearCenter : monthCenter) - 1].short}
              {STARS[(mode === '年' ? yearCenter : monthCenter) - 1].name}星入中
            </span>
          </div>

          {/* 九宫网格 */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-2 max-w-[420px] mx-auto">
              {PALACES.map(palace => {
                const starNum = activeStars[palace.luoshuNum]
                const star = STARS[starNum - 1]
                const isCenter = palace.luoshuNum === 5
                const isFocused = focusedPalace === palace.luoshuNum
                const isAnimPath = animStep >= 0 && FLIGHT_PATH.slice(0, animStep).includes(palace.luoshuNum)

                return (
                  <button
                    key={palace.luoshuNum}
                    onClick={() => {
                      setFocusedPalace(palace.luoshuNum === focusedPalace ? null : palace.luoshuNum)
                      setSelectedStar(star)
                    }}
                    className={`
                      relative flex flex-col items-center justify-center
                      rounded-xl border-2 p-2 sm:p-3 md:p-4
                      transition-all duration-300 cursor-pointer
                      ${isCenter ? 'aspect-square' : 'aspect-square'}
                      ${isFocused
                        ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30'
                        : isAnimPath
                          ? 'border-[var(--accent)]/60 bg-[var(--accent)]/10'
                          : 'border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--glow)]'
                      }
                      ${star.nature === '吉' ? (isFocused ? 'bg-blue-500/15' : 'bg-[var(--bg3)]/50') : ''}
                      ${star.nature === '凶' ? (isFocused ? 'bg-red-500/15' : 'bg-[var(--bg3)]/50') : ''}
                    `}
                  >
                    {/* 洛书数字标记 */}
                    <span className="absolute top-1 left-1.5 text-[9px] text-[var(--muted)] opacity-40 font-mono">
                      {palace.luoshuNum}
                    </span>

                    {/* 飞星数字 */}
                    <span
                      className={`text-2xl sm:text-3xl font-bold font-mono leading-none transition-colors duration-300 ${
                        star.nature === '吉' ? (isFocused ? 'text-blue-400' : 'text-blue-500') : ''
                      }${
                        star.nature === '凶' ? (isFocused ? 'text-red-400' : 'text-red-500') : ''
                      }`}
                    >
                      {starNum}
                    </span>
                    <span className={`text-[10px] sm:text-xs font-semibold mt-0.5 ${
                      star.nature === '吉' ? 'text-blue-400/80' : 'text-red-400/80'
                    }`}>
                      {star.short}
                    </span>
                    <span className={`text-[9px] sm:text-[10px] ${
                      star.nature === '吉' ? 'text-blue-300/60' : 'text-red-300/60'
                    }`}>
                      {star.name}
                    </span>
                    <span className={`absolute bottom-1 text-[8px] opacity-30 ${
                      star.nature === '吉' ? 'text-blue-300' : 'text-red-300'
                    }`}>
                      {palace.direction}
                    </span>

                    {/* 动画路径序号 */}
                    {isAnimPath && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[8px] font-bold flex items-center justify-center">
                        {FLIGHT_PATH.indexOf(palace.luoshuNum) + 1}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* 连线覆盖层 */}
            {showLines && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ maxWidth: '420px', margin: '0 auto', left: 0, right: 0 }}>
                {/* 根据九宫位置计算连线 */}
                {FLIGHT_PATH.slice(0, -1).map((from, i) => {
                  const to = FLIGHT_PATH[i + 1]
                  const fromPalace = PALACES.find(p => p.luoshuNum === from)
                  const toPalace = PALACES.find(p => p.luoshuNum === to)
                  if (!fromPalace || !toPalace) return null
                  // SVG 坐标计算：每个 cell 约 1/3 宽度，加上 padding
                  const cellW = 420 / 3
                  const cellH = 420 / 3
                  const fx = (fromPalace.col + 0.5) * cellW
                  const fy = (fromPalace.row + 0.5) * cellH
                  const tx = (toPalace.col + 0.5) * cellW
                  const ty = (toPalace.row + 0.5) * cellH

                  return (
                    <g key={`line-${i}`}>
                      <line
                        x1={fx} y1={fy} x2={tx} y2={ty}
                        stroke="#d97706"
                        strokeWidth={1}
                        strokeDasharray="4,3"
                        opacity={0.3}
                      />
                      {/* 箭头 */}
                      <polygon
                        points={`${tx},${ty} ${tx - 4},${ty - 6} ${tx + 4},${ty - 6}`}
                        fill="#d97706"
                        opacity={0.3}
                        transform={`rotate(${Math.atan2(ty - fy, tx - fx) * 180 / Math.PI}, ${tx}, ${ty})`}
                      />
                    </g>
                  )
                })}
              </svg>
            )}
          </div>

          {/* 图例 */}
          <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-500/40" />
              <span className="text-[10px] text-[var(--muted)]">吉星</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500/40" />
              <span className="text-[10px] text-[var(--muted)]">凶星</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded border border-[var(--accent)] bg-[var(--accent)]/10" />
              <span className="text-[10px] text-[var(--muted)]">飞星路径</span>
            </div>
            <div className="text-[9px] text-[var(--muted)] opacity-50">
              点击宫位查看详解
            </div>
          </div>
        </div>

        {/* 详情面板 */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 lg:sticky lg:top-24">
            {focusedStar ? (
              <div className="animate-[fadeSlideIn_0.2s_ease-out]">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg font-mono"
                    style={{ backgroundColor: focusedStar.hexColor }}
                  >
                    {focusedStar.num}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--fg)]">
                      {focusedStar.short} {focusedStar.name}星
                    </h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      focusedStar.nature === '吉' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {focusedStar.nature} · {focusedStar.element} · {focusedStar.color}
                    </span>
                  </div>
                  <button
                    onClick={() => setFocusedPalace(null)}
                    className="ml-auto text-[var(--muted)] hover:text-[var(--fg)] text-xs"
                  >
                    ✕
                  </button>
                </div>

                {/* 基本信息 */}
                <div className="space-y-2 mb-3">
                  <div className="bg-[var(--bg3)]/50 rounded-lg px-3 py-2">
                    <span className="text-[10px] text-[var(--muted)]">主事：</span>
                    <span className="text-xs text-[var(--fg)] font-semibold">{focusedStar.meaning}</span>
                  </div>
                  <div className="bg-[var(--bg3)]/50 rounded-lg px-3 py-2">
                    <span className="text-[10px] text-[var(--muted)]">所管：</span>
                    <span className="text-xs text-[var(--fg)]">{focusedStar.affairs}</span>
                  </div>
                </div>

                {/* 详细说明 */}
                <p className="text-[11px] text-[var(--fg)]/80 leading-relaxed">{focusedStar.story}</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-3xl mb-3 block">☯</span>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  点击任意宫位查看飞星详解
                </p>
                <p className="text-[10px] text-[var(--muted)] mt-2 opacity-50">
                  当前 {year}年 · {STARS[(mode === '年' ? yearCenter : monthCenter) - 1].short}入中
                </p>
              </div>
            )}

            {/* 九星速查表 */}
            <div className="border-t border-[var(--border)] mt-4 pt-4">
              <h4 className="text-[11px] font-semibold text-[var(--muted)] mb-2">📋 九星全览</h4>
              <div className="grid grid-cols-3 gap-1">
                {STARS.map(star => (
                  <button
                    key={star.num}
                    onClick={() => {
                      setFocusedPalace(PALACES.find(p => activeStars[p.luoshuNum] === star.num)?.luoshuNum ?? null)
                      setSelectedStar(star)
                    }}
                    className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[9px] transition-colors ${
                      selectedStar?.num === star.num
                        ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                        : 'bg-[var(--bg3)]/50 text-[var(--muted)] hover:text-[var(--fg)]'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-white font-bold text-[7px]`}
                      style={{ backgroundColor: star.hexColor }}>
                      {star.num}
                    </span>
                    <span>{star.short}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
