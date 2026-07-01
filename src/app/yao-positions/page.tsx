'use client'
import usePageTitle from '@/hooks/usePageTitle'
import { useState, useMemo } from 'react'
import PageHeader from '@/components/PageHeader'
import { RubyText } from '@/components/Ruby'
import YaoLine from '@/components/Yao'
import { baguaList, hexagramNames, baguaIndex, getHexagramName } from '@/data/bagua'
import { getYaoLines } from '@/data/yao_lines'
import type { YaoLine as YaoLineType } from '@/data/bagua'

// ─── 爻位基本信息 ───

interface PosInfo {
  index: number       // 0=初 1=二 2=三 3=四 4=五 5=上
  name: string        // 初/二/三/四/五/上
  yinName: string     // 初六/六二/六三/六四/六五/上六
  yangName: string    // 初九/九二/九三/九四/九五/上九
  title: string       // 起步/显达/转折/近臣/君位/顶点
  subtitle: string    // 经典描述
  bodyPart: string    // 对应身体部位
  socialRole: string  // 社会角色
  stage: string       // 人生阶段/事物阶段
  yinPos: boolean     // 此位置本身是阴位还是阳位
  description: string // 详细说明
  wisdom: string      // 给现代人的启示
  color: string       // 显示用颜色主题
}

const posInfo: PosInfo[] = [
  {
    index: 0, name: '初', yinName: '初六', yangName: '初九',
    title: '起步', subtitle: '潜龙勿用',
    bodyPart: '足', socialRole: '庶民 / 基层', stage: '事物开端',
    yinPos: true,
    description: '最下面第一爻叫"初"，代表事情的开端、起步阶段。物之初生，势之始萌，一切从这里开始。',
    wisdom: '创业、学新东西、进入新环境，都处于"初"位。这时最忌讳的是急于表现——先看清规则、打牢基础、积蓄能量。',
    color: 'from-emerald-500/20',
  },
  {
    index: 1, name: '二', yinName: '六二', yangName: '九二',
    title: '显达', subtitle: '见龙在田',
    bodyPart: '股 / 腿', socialRole: '大夫 / 中层', stage: '崭露头角',
    yinPos: false,
    description: '第二爻是下卦的中位，代表已经站稳脚跟、开始展现才华的阶段。这是"崭露头角"的位置——但还不够高，仍需低调务实。',
    wisdom: '工作两三年后，有了一些成果和认可，但还没到顶层。这时最重要的是"守中"——不偏不倚、不急不躁，持续输出价值。',
    color: 'from-sky-500/20',
  },
  {
    index: 2, name: '三', yinName: '六三', yangName: '九三',
    title: '转折', subtitle: '终日乾乾',
    bodyPart: '腰 / 臀', socialRole: '诸侯 / 高管', stage: '承上启下',
    yinPos: true,
    description: '第三爻是下卦最上方、紧邻上卦，处于"承上启下"的关键位置。这里是上下卦的交接处，也是最容易产生焦虑和动荡的地方。',
    wisdom: '中层管理、项目关键期就是"三爻位"——既要执行上级指令，又要带领下属推进。这个位置最需要的是：勤奋加谨慎。',
    color: 'from-amber-500/20',
  },
  {
    index: 3, name: '四', yinName: '六四', yangName: '九四',
    title: '近臣', subtitle: '或跃在渊',
    bodyPart: '胸 / 背', socialRole: '近臣 / 副手', stage: '可进可退',
    yinPos: false,
    description: '第四爻是上卦第一爻，紧贴第五爻君位，相当于"近臣"或"二把手"的位置。离最高权力只差一步，但也最容易进退两难。',
    wisdom: '做到高管或副手，离老板很近。这个位置需要极高的情商——既要展现能力让老板信任，又要收敛锋芒不让老板猜忌。',
    color: 'from-orange-500/20',
  },
  {
    index: 4, name: '五', yinName: '六五', yangName: '九五',
    title: '君位', subtitle: '飞龙在天',
    bodyPart: '首 / 心', socialRole: '君王 / 决策者', stage: '巅峰时刻',
    yinPos: true,
    description: '第五爻是上卦中位，全卦最尊贵的"君位"。既中且正——既在中位又是阳位（九五），是做事的最佳状态。"九五之尊"因此而来。',
    wisdom: '事业鼎盛期、成为核心决策者。这个位置的智慧是：德要配位、谦受益满招损。用乾卦的话说："飞龙在天，利见大人"——找人做事比事必躬亲更重要。',
    color: 'from-rose-500/20',
  },
  {
    index: 5, name: '上', yinName: '上六', yangName: '上九',
    title: '顶点', subtitle: '亢龙有悔',
    bodyPart: '顶 / 极', socialRole: '隐退 / 元老', stage: '盛极将衰',
    yinPos: false,
    description: '最上面第六爻叫"上"，代表事物发展的终点。物极必反、盛极必衰——到了顶点就要考虑退路了。乾卦上九"亢龙有悔"，龙飞太高的悔恨。',
    wisdom: '退休、功成身退、项目收尾。这个位置最忌讳的是"恋栈"——明知该退了还抓着不放。上爻的智慧是：知止而后有得。',
    color: 'from-purple-500/20',
  },
]

// ─── 爻间关系数据 ───

interface RelationInfo {
  name: string
  char: string
  brief: string
  detail: string
  example: string
}

const relations: RelationInfo[] = [
  {
    name: '承', char: '⬆',
    brief: '阴爻在阳爻之下，阴承托阳',
    detail: '相邻两爻中，如果阴爻在下、阳爻在上，就叫"承"。好比下属支持上级、助手辅佐领导。承的关系通常是吉利的，因为阴承阳符合自然秩序——柔顺辅助刚健。',
    example: '坤卦中，六二承九三（阴在阳下），阴柔和顺承托阳刚。',
  },
  {
    name: '乘', char: '⬇',
    brief: '阴爻在阳爻之上，阴凌驾于阳',
    detail: '相邻两爻中，如果阴爻在上、阳爻在下，就叫"乘"。好比下级骑在上级头上、女性凌驾于男性之上。乘的关系通常不太吉利——阴乘阳是一种"逆序"状态。',
    example: '屯卦中，六二乘初九（阴在阳上），象征初创阶段秩序颠倒。',
  },
  {
    name: '比', char: '↔',
    brief: '相邻两爻之间的关系',
    detail: '相邻的两爻（如初与二、二与三、三与四、四与五、五与上）之间的关系叫"比"。如果相邻两爻阴阳相反（一阴一阳），叫"亲比"——关系融洽、互补。如果阴阳相同，叫"敌比"——容易有摩擦、竞争。',
    example: '比看的是邻居、同事之间的配合——比邻而居，或亲或敌。',
  },
  {
    name: '应', char: '↕',
    brief: '上下卦对应爻位之间的呼应',
    detail: '上下卦对应爻位之间的关系叫"应"。初↔四、二↔五、三↔上，一一对应。如果两爻阴阳相反，叫"有应"——上下呼应、内外配合。如果阴阳相同，叫"无应"——孤军奋战、内外不协。应看的是上下级之间的配合度。',
    example: '既济卦䷾：初九应六四、六二应九五、九三应上六——三对应全，完美配合。',
  },
]

// ─── 阴阳位数据 ───

interface PositionRule {
  pos: string
  index: number
  nature: '阳位' | '阴位'
  ideal: '阳爻' | '阴爻'
  match: string
  mismatch: string
}

const positionRules: PositionRule[] = [
  { pos: '初', index: 0, nature: '阳位', ideal: '阳爻', match: '初九（阳居阳位）→ 当位', mismatch: '初六（阴居阳位）→ 不当位' },
  { pos: '二', index: 1, nature: '阴位', ideal: '阴爻', match: '六二（阴居阴位）→ 当位 ✅', mismatch: '九二（阳居阴位）→ 不当位' },
  { pos: '三', index: 2, nature: '阳位', ideal: '阳爻', match: '九三（阳居阳位）→ 当位', mismatch: '六三（阴居阳位）→ 不当位' },
  { pos: '四', index: 3, nature: '阴位', ideal: '阴爻', match: '六四（阴居阴位）→ 当位', mismatch: '九四（阳居阴位）→ 不当位' },
  { pos: '五', index: 4, nature: '阳位', ideal: '阳爻', match: '九五（阳居阳位）→ 当位 ✅', mismatch: '六五（阴居阳位）→ 不当位' },
  { pos: '上', index: 5, nature: '阴位', ideal: '阴爻', match: '上六（阴居阴位）→ 当位', mismatch: '上九（阳居阴位）→ 不当位' },
]

// ─── 所有六十四卦列表 ───

const baguaIds = baguaList.map(b => b.id)
const allHexagrams = baguaIds.flatMap(lowerId =>
  baguaIds.map(upperId => ({
    key: `${lowerId}-${upperId}`,
    name: getHexagramName(upperId, lowerId),
    upperId,
    lowerId,
    symbol: '',
  }))
).filter(h => h.name)

// 补齐 symbol
allHexagrams.forEach(h => {
  const sym: Record<string, string> = {
    '乾':'䷀','坤':'䷁','屯':'䷂','蒙':'䷃','需':'䷄','讼':'䷅','师':'䷆','比':'䷇',
    '小畜':'䷈','履':'䷉','泰':'䷊','否':'䷋','同人':'䷌','大有':'䷍','谦':'䷎','豫':'䷏',
    '随':'䷐','蛊':'䷑','临':'䷒','观':'䷓','噬嗑':'䷔','贲':'䷕','剥':'䷖','复':'䷗',
    '无妄':'䷘','大畜':'䷙','颐':'䷚','大过':'䷛','坎':'䷜','离':'䷝',
    '咸':'䷞','恒':'䷟','遁':'䷠','大壮':'䷡','晋':'䷢','明夷':'䷣',
    '家人':'䷤','睽':'䷥','蹇':'䷦','解':'䷧','损':'䷨','益':'䷩',
    '夬':'䷪','姤':'䷫','萃':'䷬','升':'䷭','困':'䷮','井':'䷯',
    '革':'䷰','鼎':'䷱','震':'䷲','艮':'䷳','渐':'䷴','归妹':'䷵',
    '丰':'䷶','旅':'䷷','巽':'䷸','兑':'䷹','涣':'䷺','节':'䷻',
    '中孚':'䷼','小过':'䷽','既济':'䷾','未济':'䷿',
  }
  h.symbol = sym[h.name] || ''
})

// ─── 六爻二进制表示辅助 ───

function getYaoBinary(key: string): number[] | null {
  const lowerIdx = baguaIds.indexOf(key.split('-')[0])
  const upperIdx = baguaIds.indexOf(key.split('-')[1])
  if (lowerIdx === -1 || upperIdx === -1) return null
  const lowerYao = baguaList[lowerIdx].yao
  const upperYao = baguaList[upperIdx].yao
  return [...upperYao, ...lowerYao]  // [上卦三爻, 下卦三爻] = [五,四,三,二,初,上]... wait, yao arrays are [下,中,上]
  // Actually bagua yao is [下, 中, 上]; so upperYao = [上卦下, 上卦中, 上卦上]
  // Combined as 6-yao from bottom to top: lowerYao[下], lowerYao[中], lowerYao[上], upperYao[下], upperYao[中], upperYao[上]
  // = [lowerYao[0], lowerYao[1], lowerYao[2], upperYao[0], upperYao[1], upperYao[2]]
}

function get6Yao(key: string): number[] | null {
  const [lowerId, upperId] = key.split('-')
  const lowerIdx = baguaIds.indexOf(lowerId)
  const upperIdx = baguaIds.indexOf(upperId)
  if (lowerIdx === -1 || upperIdx === -1) return null
  const ly = baguaList[lowerIdx].yao   // [下,中,上]
  const uy = baguaList[upperIdx].yao   // [下,中,上]
  // 六爻从下到上: 初,二,三,四,五,上
  return [ly[0], ly[1], ly[2], uy[0], uy[1], uy[2]]
  // Index mapping: 0=初, 1=二, 2=三, 3=四, 4=五, 5=上
}

// ─── 样式常量 ───

const cardBase = 'bg-[var(--card)] border border-[var(--border)] rounded-xl'

// ─── 主组件 ───

export default function YaoPositionsPage() {
  usePageTitle()

  // 互动爻位图：当前选中的位置 (0-5)
  const [selectedPos, setSelectedPos] = useState<number | null>(null)
  // 爻间关系：当前展开的关系
  const [expandedRelation, setExpandedRelation] = useState<string | null>(null)
  // 当位/不当位 当前展开的概念
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null)
  // 选中用于分析的卦
  const [selectedHexagram, setSelectedHexagram] = useState('kun-qian') // 默认泰卦
  // 移动端交互方向
  const [mobileSlide, setMobileSlide] = useState(0)

  const hexYao = useMemo(() => get6Yao(selectedHexagram), [selectedHexagram])
  const hexYaoLines = useMemo(() => getYaoLines(selectedHexagram), [selectedHexagram])

  const selectedHexName = useMemo(() => {
    const h = allHexagrams.find(x => x.key === selectedHexagram)
    return h ? h.symbol + ' ' + h.name : ''
  }, [selectedHexagram])

  // 泰卦的六爻（默认示例）
  const defaultYao = hexYao || [1,1,1,0,0,0]
  const defaultLines = hexYaoLines || []

  // 某爻是否当位
  function isDangwei(index: number, yang: boolean): boolean {
    // 阳位: 初(0), 三(2), 五(4) ; 阴位: 二(1), 四(3), 上(5)
    const isYangPos = index % 2 === 0
    return yang === isYangPos
  }

  function getPosNature(index: number): string {
    return index % 2 === 0 ? '阳位' : '阴位'
  }

  return (
    <>
      <PageHeader
        title="爻位体系详解"
        subtitle="六爻不是六根线——从下到上，每一爻都有它的位置、身份和使命。带你读懂爻位的学问。"
      />

      {/* ═══ 1. 互动六爻位置图 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-1">🖱️ 点击每一爻查看详解</h3>
        <p className="text-xs text-[var(--muted)] mb-4">从下到上，六爻代表从"开始"到"终点"的整个过程</p>

        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* 六爻图 */}
          <div className="flex-shrink-0">
            <div className="relative flex flex-col items-center gap-2 py-3 px-6 rounded-xl bg-[var(--bg3)]/50 border border-[var(--border)]">
              {/* 上卦标注 */}
              <div className="text-[10px] text-[var(--accent2)] font-semibold tracking-wider mb-1">上卦</div>
              {/* 第 5 爻 (上) → 第 3 爻 (四), 显示从高到低 */}
              {[5,4,3,2,1,0].map(i => {
                const yang = defaultYao[i] === 1
                const pos = posInfo[i]
                const isSel = selectedPos === i
                const dangwei = isDangwei(i, yang)
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedPos(isSel ? null : i)}
                    className={`
                      group flex items-center gap-3 w-full cursor-pointer
                      transition-all duration-200 rounded-lg px-2 py-1
                      ${isSel ? 'bg-[var(--accent)]/10 ring-2 ring-[var(--accent)]' : 'hover:bg-[var(--bg2)]'}
                    `}
                  >
                    {/* 爻线 */}
                    <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 80 }}>
                      <YaoLine yang={yang} />
                    </div>
                    {/* 位置名 */}
                    <span className={`
                      font-mono text-xs font-bold tracking-wide
                      ${yang ? 'text-[var(--yang)]' : 'text-[var(--yin)]'}
                      ${isSel ? 'text-[var(--accent)]' : ''}
                    `}>
                      {yang ? pos.yangName : pos.yinName}
                    </span>
                    {/* 标题 + 吉凶 */}
                    <span className="text-[11px] text-[var(--muted)] flex-1 text-left">{pos.title}</span>
                    <span className={`
                      text-[10px] px-1.5 py-0.5 rounded font-mono
                      ${dangwei
                        ? 'bg-emerald-500/15 text-emerald-500'
                        : 'bg-rose-500/15 text-rose-500'
                      }
                    `}>
                      {dangwei ? '当位' : '不当位'}
                    </span>
                    {/* 所属卦: 上/下 */}
                    <span className="text-[10px] text-[var(--accent2)]/60 font-mono">{i >= 3 ? '上' : '下'}</span>
                  </button>
                )
              })}
              {/* 下卦标注 */}
              <div className="text-[10px] text-[var(--accent2)] font-semibold tracking-wider mt-1">下卦</div>
            </div>
          </div>

          {/* 选中位置的详情面板 */}
          <div className="flex-1 min-h-[260px] w-full">
            {selectedPos !== null ? (
              <div className={`rounded-xl p-5 border ${cardBase} h-full`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${defaultYao[selectedPos] === 1 ? 'bg-[var(--yang)]' : 'bg-[var(--yin)]'}`} />
                  <span className="font-mono font-bold text-sm">
                    {defaultYao[selectedPos] === 1 ? posInfo[selectedPos].yangName : posInfo[selectedPos].yinName}
                  </span>
                  <span className="text-sm text-[var(--fg)] font-semibold">{posInfo[selectedPos].title}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {[
                    ['身体', posInfo[selectedPos].bodyPart],
                    ['社会角色', posInfo[selectedPos].socialRole],
                    ['阶段', posInfo[selectedPos].stage],
                    ['位性', getPosNature(selectedPos)],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-[var(--bg3)]/50 rounded-lg px-2.5 py-1.5">
                      <div className="text-[10px] text-[var(--muted)]">{label}</div>
                      <div className="text-xs font-medium text-[var(--fg)]">{val}</div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-[var(--fg)] leading-relaxed mb-3">{posInfo[selectedPos].description}</p>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                  <div className="text-[10px] text-amber-500/80 font-semibold mb-1">💡 现代启示</div>
                  <p className="text-xs text-[var(--fg)]/80 leading-relaxed">{posInfo[selectedPos].wisdom}</p>
                </div>

                {/* 显示该爻位的爻辞（如果有） */}
                {defaultLines[selectedPos] && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)]">
                    <div className="text-[10px] text-[var(--muted)] mb-1">
                      当前卦 <RubyText text={selectedHexName} /> 在此位置的爻辞：
                    </div>
                    <div className="text-xs text-[var(--fg)] leading-relaxed">
                      <span className="font-mono font-semibold">{defaultLines[selectedPos].pos}</span>：
                      <span className="font-semibold">"{defaultLines[selectedPos].text}"</span>
                      —— {defaultLines[selectedPos].meaning}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full rounded-xl bg-[var(--bg3)]/30 border border-dashed border-[var(--border)]">
                <div className="text-center text-[var(--muted)]">
                  <div className="text-2xl mb-2">👆</div>
                  <div className="text-sm">点击左侧任意一爻</div>
                  <div className="text-xs mt-1">查看该位置的详细解释</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ 2. 爻的命名规则 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">📝 爻的命名规则</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 为什么叫九和六 */}
          <div className="bg-[var(--bg3)]/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-[var(--fg)] mb-2">为什么阳爻叫"九"，阴爻叫"六"？</h4>
            <p className="text-xs text-[var(--fg)]/80 leading-relaxed mb-2">
              《易经》中用"九"代表阳爻、"六"代表阴爻，不是随便选的。
            </p>
            <ul className="space-y-1.5 text-xs text-[var(--fg)]/80">
              <li className="flex gap-2">
                <span className="text-[var(--yang)] font-mono shrink-0">☰ 九</span>
                <span><strong>阳数之极</strong>——1-9中奇数为阳，9是最大阳数，代表"阳到了极致"。</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--yin)] font-mono shrink-0">☷ 六</span>
                <span><strong>阴数之中</strong>——2-10中偶数为阴，6是阴数居中的位置（8为阴之极但不用）。</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--muted)] font-mono shrink-0">⚖️</span>
                <span>也有说法："九"取"究"（穷尽）之意，"六"取"溜"（滑顺）之意。</span>
              </li>
            </ul>
          </div>

          {/* 为什么从下往上数 */}
          <div className="bg-[var(--bg3)]/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-[var(--fg)] mb-2">为什么从下往上数？为什么不用"一"到"六"？</h4>
            <p className="text-xs text-[var(--fg)]/80 leading-relaxed mb-2">
              六爻从下往上数，而不是从上往下：第一爻叫"初"，第六爻叫"上"。
            </p>
            <ul className="space-y-1.5 text-xs text-[var(--fg)]/80">
              <li className="flex gap-2">
                <span className="text-[var(--accent)] shrink-0">🌱</span>
                <span><strong>初 → 上</strong>：事物从"开始"到"结束"的过程，是时间顺序。</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--accent)] shrink-0">🏗️</span>
                <span>建筑从地基到屋顶；植物从根到梢——古人观察自然的结果。</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--accent)] shrink-0">📐</span>
                <span>初（开始）→ 二（发展）→ 三（转折）→ 四（深化）→ 五（高潮）→ 上（终点）。</span>
              </li>
            </ul>
          </div>

          {/* 命名对照表 */}
          <div className="md:col-span-2 bg-[var(--bg3)]/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-[var(--fg)] mb-3">完整命名对照</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-1.5 px-2 text-[var(--muted)] font-medium">位置</th>
                    <th className="text-left py-1.5 px-2 text-[var(--muted)] font-medium">阳爻名</th>
                    <th className="text-left py-1.5 px-2 text-[var(--muted)] font-medium">阴爻名</th>
                    <th className="text-left py-1.5 px-2 text-[var(--muted)] font-medium">位性</th>
                    <th className="text-left py-1.5 px-2 text-[var(--muted)] font-medium">上/下卦</th>
                    <th className="text-left py-1.5 px-2 text-[var(--muted)] font-medium">卦中角色</th>
                  </tr>
                </thead>
                <tbody>
                  {posInfo.map(p => (
                    <tr key={p.index} className="border-b border-[var(--border)]/50">
                      <td className="py-2 px-2 font-mono font-bold">{p.name}</td>
                      <td className="py-2 px-2 font-mono text-[var(--yang)]">{p.yangName}</td>
                      <td className="py-2 px-2 font-mono text-[var(--yin)]">{p.yinName}</td>
                      <td className="py-2 px-2">
                        <span className={`px-1.5 py-0.5 rounded ${p.yinPos ? 'bg-rose-500/10 text-rose-500' : 'bg-sky-500/10 text-sky-500'}`}>
                          {p.yinPos ? '阴位' : '阳位'}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-[var(--muted)]">{p.index < 3 ? '下卦' : '上卦'}</td>
                      <td className="py-2 px-2 text-[var(--fg)]/70">{p.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. 当位与不当位 + 中位 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">⚖️ 当位 · 不当位 · 中正</h3>

        {/* 当位/不当位 示意图 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-[var(--bg3)]/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-[var(--fg)] mb-2">当位 · 不当位</h4>
            <p className="text-xs text-[var(--fg)]/80 leading-relaxed mb-3">
              六爻的位次分阴阳：<strong>初、三、五为阳位</strong>（奇数位），<strong>二、四、上为阴位</strong>（偶数位）。
              阳爻在阳位、阴爻在阴位 → <span className="text-emerald-500 font-semibold">当位（得位）</span>。
              反之 → <span className="text-rose-500 font-semibold">不当位（失位）</span>。
            </p>
            {/* 示例 */}
            <div className="space-y-1">
              <div className="text-xs text-[var(--muted)] mb-1">举两个极端的例子：</div>
              <div className="bg-[var(--card)] rounded-lg p-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">䷾</span>
                  <span className="text-xs font-semibold">既济卦 —— 六爻皆当位</span>
                  <span className="text-[10px] text-emerald-500">✅ 完美</span>
                </div>
                <p className="text-[11px] text-[var(--fg)]/70">水火既济每一爻都在正确的位置上：阳居阳、阴居阴。是最完美的卦象。</p>
              </div>
              <div className="bg-[var(--card)] rounded-lg p-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">䷿</span>
                  <span className="text-xs font-semibold">未济卦 —— 六爻皆不当位</span>
                  <span className="text-[10px] text-rose-500">❌ 全错位</span>
                </div>
                <p className="text-[11px] text-[var(--fg)]/70">火水未济每一爻都不在正确的位置上——但反而代表"未完待续"，充满可能。</p>
              </div>
            </div>
          </div>

          {/* 中位 + 中正 */}
          <div className="bg-[var(--bg3)]/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-[var(--fg)] mb-2">中 · 中正</h4>
            <p className="text-xs text-[var(--fg)]/80 leading-relaxed mb-3">
              每卦有两个"中位"：<strong>二爻</strong>（下卦之中）和<strong>五爻</strong>（上卦之中）。
              居中位象征不偏不倚、恰如其分，是"中庸之道"在卦中的体现。
            </p>
            <div className="space-y-1">
              <div className="bg-[var(--card)] rounded-lg p-2.5 mb-1.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[var(--yang)] font-mono text-xs">✦ 中</span>
                  <span className="text-xs font-semibold">居中位即吉</span>
                </div>
                <p className="text-[11px] text-[var(--fg)]/70">《易经》非常看重"中位"。很多卦的爻辞中，二爻和五爻的断语往往比其他爻好——居中就是优势。</p>
              </div>
              <div className="bg-[var(--card)] rounded-lg p-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-500 text-xs">⭐⭐</span>
                  <span className="text-xs font-semibold">中 + 正 = 中正</span>
                </div>
                <p className="text-[11px] text-[var(--fg)]/70">阳爻居五（九五）、阴爻居二（六二）→ <strong>既中且正</strong>。<br />这是最理想的状态——乾卦九五"飞龙在天，利见大人"就是经典例子。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 完整规则表 */}
        <div className="bg-[var(--bg3)]/50 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-[var(--fg)] mb-2">六个位置的当位规则一览</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-1.5 px-2 text-[var(--muted)] font-medium">位置</th>
                  <th className="text-left py-1.5 px-2 text-[var(--muted)] font-medium">位性</th>
                  <th className="text-left py-1.5 px-2 text-[var(--muted)] font-medium">应该</th>
                  <th className="text-left py-1.5 px-2 text-[var(--muted)] font-medium">当位情形</th>
                  <th className="text-left py-1.5 px-2 text-[var(--muted)] font-medium">不当位情形</th>
                </tr>
              </thead>
              <tbody>
                {positionRules.map(r => (
                  <tr key={r.pos} className="border-b border-[var(--border)]/50">
                    <td className="py-2 px-2 font-mono font-bold">{r.pos}</td>
                    <td className="py-2 px-2">
                      <span className={`px-1.5 py-0.5 rounded ${
                        r.nature === '阳位' ? 'bg-sky-500/10 text-sky-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>{r.nature}</span>
                    </td>
                    <td className="py-2 px-2 text-[var(--fg)]/70">{r.ideal}</td>
                    <td className="py-2 px-2 text-emerald-500">{r.match}</td>
                    <td className="py-2 px-2 text-rose-500">{r.mismatch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-[10px] text-[var(--muted)]">
            ⚠️ 不当位不一定凶——有时候"不在其位"反而能打破常规、带来转机（如未济卦全不当位却代表"无限可能"）。
          </div>
        </div>
      </section>

      {/* ═══ 4. 爻间关系 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🔗 爻间关系：承 · 乘 · 比 · 应</h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          六爻不是孤立的——它们之间存在着复杂的关系网络。点击下面每一组关系，查看详解。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {relations.map(rel => (
            <div
              key={rel.name}
              onClick={() => setExpandedRelation(expandedRelation === rel.name ? null : rel.name)}
              className="bg-[var(--bg3)]/50 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-[var(--glow)]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{rel.char}</span>
                <h4 className="text-sm font-bold text-[var(--fg)]">{rel.name}</h4>
                <span className="text-[10px] text-[var(--muted)] font-mono">↕ 相邻爻关系</span>
                <span className="ml-auto text-[var(--muted)] text-xs transition-transform duration-200"
                  style={{ transform: expandedRelation === rel.name ? 'rotate(180deg)' : '' }}>▼</span>
              </div>
              <p className="text-xs text-[var(--fg)]/70">{rel.brief}</p>
              {expandedRelation === rel.name && (
                <div className="mt-3 pt-3 border-t border-[var(--border)] animate-[fadeSlideIn_0.2s_ease-out]">
                  <p className="text-xs text-[var(--fg)]/80 leading-relaxed mb-2">{rel.detail}</p>
                  <div className="bg-[var(--card)] rounded-lg px-3 py-2">
                    <span className="text-[10px] text-[var(--muted)]">📖 举例：</span>
                    <span className="text-xs text-[var(--fg)]/80">{rel.example}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 5. 互动卦例分析 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🔍 实战分析：选一卦看看爻位</h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          选一个六十四卦，查看每一爻的位置分析——当位/不当位？中位？应位关系？
        </p>

        {/* 卦选择器 */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-xs text-[var(--muted)]">选择卦：</span>
          <div className="relative flex-1 max-w-xs">
            <select
              value={selectedHexagram}
              onChange={e => setSelectedHexagram(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--border)] text-xs text-[var(--fg)] outline-none cursor-pointer appearance-none transition-colors focus:border-[var(--accent)]"
            >
              {baguaIds.map(lowerId => (
                <optgroup key={lowerId} label={`${baguaList.find(b=>b.id===lowerId)?.name}（${baguaList.find(b=>b.id===lowerId)?.symbol}）`}>
                  {baguaIds.map(upperId => {
                    const name = getHexagramName(upperId, lowerId)
                    const key = `${lowerId}-${upperId}`
                    const h = allHexagrams.find(x => x.key === key)
                    return (
                      <option key={key} value={key}>
                        {h?.symbol || ''} {name}（{baguaList.find(b=>b.id===lowerId)?.name}+{baguaList.find(b=>b.id===upperId)?.name}）
                      </option>
                    )
                  })}
                </optgroup>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted)] pointer-events-none">▼</span>
          </div>
        </div>

        {/* 分析结果 */}
        {hexYao && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-2 text-[var(--muted)] font-medium">爻位</th>
                  <th className="text-left py-2 px-2 text-[var(--muted)] font-medium">爻线</th>
                  <th className="text-left py-2 px-2 text-[var(--muted)] font-medium">爻名</th>
                  <th className="text-left py-2 px-2 text-[var(--muted)] font-medium">位性</th>
                  <th className="text-left py-2 px-2 text-[var(--muted)] font-medium">当位?</th>
                  <th className="text-left py-2 px-2 text-[var(--muted)] font-medium">中位?</th>
                  <th className="text-left py-2 px-2 text-[var(--muted)] font-medium">应位</th>
                  <th className="text-left py-2 px-2 text-[var(--muted)] font-medium">爻辞</th>
                </tr>
              </thead>
              <tbody>
                {[0,1,2,3,4,5].map(i => {
                  const yang = hexYao[i] === 1
                  const pos = posInfo[i]
                  const dangwei = isDangwei(i, yang)
                  // 应位: 初↔四, 二↔五, 三↔上
                  const yingIdx = i < 3 ? i + 3 : i - 3
                  const yingYang = hexYao[yingIdx] === 1
                  const youYing = yang !== yingYang // 阴阳相反则有应
                  const isZhong = i === 1 || i === 4 // 二爻和五爻是中位
                  const isZhongZheng = (i === 1 && !yang) || (i === 4 && yang) // 六二或九五
                  const yaoLine = hexYaoLines?.[i]
                  return (
                    <tr key={i} className="border-b border-[var(--border)]/50 hover:bg-[var(--glow)] transition-colors">
                      <td className="py-2 px-2 font-mono font-bold">{pos.name}</td>
                      <td className="py-2 px-2">
                        <YaoLine yang={yang} size="sm" />
                      </td>
                      <td className={`py-2 px-2 font-mono ${yang ? 'text-[var(--yang)]' : 'text-[var(--yin)]'}`}>
                        {yang ? pos.yangName : pos.yinName}
                      </td>
                      <td className="py-2 px-2">
                        <span className={`px-1.5 py-0.5 rounded ${
                          pos.yinPos ? 'bg-rose-500/10 text-rose-500' : 'bg-sky-500/10 text-sky-500'
                        }`}>
                          {pos.yinPos ? '阴位' : '阳位'}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className={`px-1.5 py-0.5 rounded font-mono ${
                          dangwei
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : 'bg-rose-500/15 text-rose-500'
                        }`}>
                          {dangwei ? '✅当位' : '❌不当位'}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        {isZhongZheng ? (
                          <span className="px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-500 font-semibold">中正 ⭐</span>
                        ) : isZhong ? (
                          <span className="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500/80">中</span>
                        ) : (
                          <span className="text-[var(--muted)]">—</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        <span className={`${youYing ? 'text-emerald-500' : 'text-[var(--muted)]'}`}>
                          {posInfo[yingIdx].name}{youYing ? `（有应 ${yang ? '阴→阳' : '阳→阴'}）` : '（无应）'}
                        </span>
                      </td>
                      <td className="py-2 px-2 max-w-[180px]">
                        {yaoLine ? (
                          <span className="text-[var(--fg)]/80">
                            <span className="font-semibold">"{yaoLine.text}"</span>
                          </span>
                        ) : (
                          <span className="text-[var(--muted)]">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 分析总结 */}
        {hexYao && (() => {
          const dangweiCount = [0,1,2,3,4,5].filter(i => isDangwei(i, hexYao[i] === 1)).length
          const zhongCount = [0,1,2,3,4,5].filter(i => (i === 1 || i === 4)).length
          const yingCount = [0,1,2].filter(i => {
            const yang = hexYao[i] === 1
            const yingYang = hexYao[i+3] === 1
            return yang !== yingYang
          }).length
          return (
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="bg-[var(--bg3)]/50 rounded-lg px-3 py-2">
                <span className="text-[10px] text-[var(--muted)]">当位爻</span>
                <div className="text-sm font-bold text-[var(--fg)]">{dangweiCount}/6</div>
              </div>
              <div className="bg-[var(--bg3)]/50 rounded-lg px-3 py-2">
                <span className="text-[10px] text-[var(--muted)]">有应组</span>
                <div className="text-sm font-bold text-[var(--fg)]">{yingCount}/3</div>
              </div>
              <div className="bg-[var(--bg3)]/50 rounded-lg px-3 py-2">
                <span className="text-[10px] text-[var(--muted)]">中正位</span>
                <div className="text-sm font-bold text-[var(--fg)]">
                  {[1,4].filter(i => {
                    const yang = hexYao[i] === 1
                    return (i === 1 && !yang) || (i === 4 && yang)
                  }).length}/2
                </div>
              </div>
              <div className="bg-[var(--bg3)]/50 rounded-lg px-3 py-2">
                <span className="text-[10px] text-[var(--muted)]">整体评价</span>
                <div className="text-xs font-semibold text-[var(--fg)]">
                  {dangweiCount === 6 ? '完美当位 🏆' :
                   dangweiCount === 0 ? '全不当位 🔄' :
                   dangweiCount >= 4 ? '位置大顺 ✅' :
                   dangweiCount >= 2 ? '有顺有逆 ⚖️' : '多有不顺 ⚠️'}
                </div>
              </div>
            </div>
          )
        })()}
      </section>

      {/* ═══ 附：互动记忆口诀 ═══ */}
      <section className={`${cardBase} p-5 md:p-6`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-3">🧠 记忆口诀</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: '爻位口诀', content: '初难知，二多誉，三多凶，四多惧，五多功，上易知。' },
            { title: '当位口诀', content: '初三五为阳位，二四上为阴位。阳居阳、阴居阴是当位，反之不当位。' },
            { title: '中位口诀', content: '二为下卦之中，五为上卦之中。爻居中位，不偏不倚，多吉。' },
            { title: '应位口诀', content: '初应四、二应五、三应上。阴阳相反则有应，相同则无应。' },
          ].map(item => (
            <div key={item.title} className="bg-[var(--bg3)]/50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-[var(--fg)] mb-1">{item.title}</h4>
              <p className="text-xs text-[var(--fg)]/80 leading-relaxed font-mono">&ldquo;{item.content}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* 动画样式 */}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
