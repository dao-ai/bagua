'use client'
import usePageTitle from '@/hooks/usePageTitle'
import { useState } from 'react'
import PageHeader from '@/components/PageHeader'
import { RubyText } from '@/components/Ruby'

// ─── 起卦方法接口 ───
interface DivinationMethod {
  id: string
  name: string
  symbol: string
  description: string
  steps: string[]
  example: { input: string; result: string }
  color: string
}

// ─── 八卦对应数据 ───
interface BaguaEntry {
  name: string
  pinyin: string
  number: number
  symbol: string
  element: string      // 五行
  nature: string       // 性情
  direction: string    // 方位
  family: string       // 家庭角色
}

// ─── 起卦方法数据 ───
const divinationMethods: DivinationMethod[] = [
  {
    id: 'date-time',
    name: '年月日时起卦',
    symbol: '📅',
    description: '以年、月、日、时四个时间参数起卦，是最经典的系统起卦法。年取地支数（子丑寅卯…），月取农历月份数，日取农历日数，时取时辰数。',
    steps: [
      '取年数：公元年份 ÷ 12，取余数，以地支序数（子1、丑2、寅3…亥12）为准，或直接使用黄历上的年地支序数',
      '取月数：农历月份（正月至十二月 → 1至12）',
      '取日数：农历日（初一至三十 → 1至30）',
      '取时数：时辰（子时1、丑时2…亥时12）',
      '上卦计算：（年 + 月 + 日）÷ 8，取余数（余1=乾、2=兑、3=离、4=震、5=巽、6=坎、7=艮、0=坤）',
      '下卦计算：（年 + 月 + 日 + 时）÷ 8，取余数同上',
      '动爻计算：（年 + 月 + 日 + 时）÷ 6，取余数（1至5为对应爻位，0=第6爻）',
    ],
    example: {
      input: '甲辰年三月初五辰时（年41、月3、日5、时5）',
      result: '上卦：(41+3+5)÷8=49÷8=6余1→乾☰，下卦：(41+3+5+5)÷8=54÷8=6余6→坎☵，动爻：54÷6=9余0→第6爻。得卦：䷅ 天水讼，六爻动 → ䷮ 泽水困',
    },
    color: 'from-amber-500/20',
  },
  {
    id: 'number',
    name: '数字起卦',
    symbol: '🔢',
    description: '最灵活、最常用的起卦法。问卦者任意给出三组数字，或从环境/事件中提取数字。无需时间，随时随地可用。',
    steps: [
      '获取第一组数字 → 求上卦：除以8取余数（1乾2兑3离4震5巽6坎7艮0坤）',
      '获取第二组数字 → 求下卦：除以8取余数同上',
      '获取第三组数字 → 求动爻：除以6取余数（1-5为爻位，0=第6爻）',
      '若只给两组数字：以两数之和求动爻',
      '若只给一个数字：以该数求上卦，数和求下卦，后续随机取动爻',
      '数字来源极其自由：车牌、门牌、时间、金额、页数、字数……任何数字皆可',
    ],
    example: {
      input: '问卦者报数：3、8、5',
      result: '上卦：3÷8=0余3→离☲，下卦：8÷8=1余0→坤☷，动爻：5÷6=0余5→第5爻动。得卦：䷢ 火地晋，五爻动 → ䷋ 天地否',
    },
    color: 'from-sky-500/20',
  },
  {
    id: 'sound',
    name: '声音起卦',
    symbol: '🔊',
    description: '听到声音即起卦，以声音的次数或节奏为准。万物之声皆可入卦——敲门声、钟声、鸟鸣、人语停顿……无不是数。',
    steps: [
      '听到第一声（组）→ 记下声音的次数/节奏数 → 得第一数',
      '听到第二声（组）→ 记下声音的次数/节奏数 → 得第二数',
      '如有第三声 → 得第三数；如只有两声 → 以两声数之和求动爻',
      '第一数 ÷ 8 求上卦；第二数 ÷ 8 求下卦',
      '第三数（或两数之和）÷ 6 求动爻',
      '古人云："叩门声急，其数刚；叩门声缓，其数柔。"——声音的轻重缓急本身也是判断依据',
    ],
    example: {
      input: '有人敲门三声，停顿后敲门两声',
      result: '上卦：3÷8=0余3→离☲，下卦：2÷8=0余2→兑☱，动爻：(3+2)÷6=5余5→第5爻动。得卦：䷥ 火泽睽，五爻动 → ䷉ 天泽履',
    },
    color: 'from-rose-500/20',
  },
  {
    id: 'character',
    name: '文字起卦',
    symbol: '✏️',
    description: '以汉字的笔画数起卦。单字拆左右/上下取两数；多字则按字数分组取数。此法最能体现"万物皆数"——文字本身即是数的载体。',
    steps: [
      '一个汉字：左右结构→左部笔画取上卦，右部笔画取下卦；上下结构→上部取上卦，下部取下卦；内外结构→外部取上卦，内部取下卦',
      '两个字：第一个字笔画 → 上卦，第二个字笔画 → 下卦',
      '三个字：第一字笔画 → 上卦，第二字笔画 → 下卦，第三字笔画 → 动爻',
      '四个及更多字：平分为前后两组，前半字数之和÷8→上卦，后半字数之和÷8→下卦，总字数÷6→动爻',
      '笔画以繁体（正体）楷书为准',
      '若字数是8的整倍数，取余0→坤；若是6的整倍数，取余0→第6爻',
    ],
    example: {
      input: '一字"明"（繁体「明」：左日4画，右月4画）',
      result: '上卦：4÷8=0余4→震☳，下卦：4÷8=0余4→震☳，动爻：(4+4)÷6=1余2→第2爻动。得卦：䷲ 震为雷，二爻动 → ䷵ 雷泽归妹',
    },
    color: 'from-purple-500/20',
  },
  {
    id: 'direction',
    name: '方位起卦',
    symbol: '🧭',
    description: '以来人的方向或物的方位起卦。后天八卦配八方：离南坎北震东兑西……方向本身就对应着八卦。结合当时的事件或时间确定动爻。',
    steps: [
      '确定方位：以问卦人所在位置或来方为准，按后天八卦取方向对应卦 → 上卦',
      '八卦方位：离（南）、坎（北）、震（东）、兑（西）、乾（西北）、坤（西南）、艮（东北）、巽（东南）',
      '取时间或事件相关数字（时辰、人数、物件数等）→ 下卦',
      '动爻取上下卦数之和 ÷ 6 的余数',
      '若无明确事件数字：可以来人的神态、动作的节奏替取',
      '此法对应"远取诸物，近取诸身"的古人观象思维',
    ],
    example: {
      input: '有人从东方（震☳）来问事，当时是第5个时辰（辰时）',
      result: '上卦：东方→震☳（4），下卦：5÷8=0余5→巽☴，动爻：(4+5)÷6=1余3→第3爻动。得卦：䷟ 雷风恒，三爻动 → ䷧ 雷水解',
    },
    color: 'from-emerald-500/20',
  },
]

// ─── 八卦对应表 ───
const baguaTable: BaguaEntry[] = [
  { name: '乾', pinyin: 'qián', number: 1, symbol: '☰', element: '金', nature: '健', direction: '西北', family: '父' },
  { name: '兑', pinyin: 'duì', number: 2, symbol: '☱', element: '金', nature: '悦', direction: '西', family: '少女' },
  { name: '离', pinyin: 'lí', number: 3, symbol: '☲', element: '火', nature: '丽', direction: '南', family: '中女' },
  { name: '震', pinyin: 'zhèn', number: 4, symbol: '☳', element: '木', nature: '动', direction: '东', family: '长男' },
  { name: '巽', pinyin: 'xùn', number: 5, symbol: '☴', element: '木', nature: '入', direction: '东南', family: '长女' },
  { name: '坎', pinyin: 'kǎn', number: 6, symbol: '☵', element: '水', nature: '陷', direction: '北', family: '中男' },
  { name: '艮', pinyin: 'gèn', number: 7, symbol: '☶', element: '土', nature: '止', direction: '东北', family: '少男' },
  { name: '坤', pinyin: 'kūn', number: 8, symbol: '☷', element: '土', nature: '顺', direction: '西南', family: '母' },
]

// ─── 体用生克关系 ───
interface ShengKeRelation {
  id: string
  relation: string
  label: string
  icon: string
  description: string
  outcome: string
  color: string
}

const shengKeRelations: ShengKeRelation[] = [
  {
    id: 'ti-sheng-yong',
    relation: '体生用',
    label: '体 → 用',
    icon: '⬆️',
    description: '体卦的五行生用卦的五行。比如体为震木、用为离火——木生火，即体生用。',
    outcome: '耗费、劳碌。事情能成但需要付出很多精力或资源，对自己有消耗。',
    color: 'border-l-amber-400',
  },
  {
    id: 'yong-sheng-ti',
    relation: '用生体',
    label: '用 → 体',
    icon: '🌟',
    description: '用卦的五行生体卦的五行。比如用为坎水、体为震木——水生木，即用生体。',
    outcome: '大吉大利。事情顺利，有外来助力，事半功倍，他人主动帮助。',
    color: 'border-l-emerald-400',
  },
  {
    id: 'ti-ke-yong',
    relation: '体克用',
    label: '体 → 用',
    icon: '💪',
    description: '体卦的五行克用卦的五行。比如体为乾金、用为震木——金克木，即体克用。',
    outcome: '小吉。事情能成，但需要自己主动主导、强力推动。自身有掌控权。',
    color: 'border-l-sky-400',
  },
  {
    id: 'yong-ke-ti',
    relation: '用克体',
    label: '用 → 体',
    icon: '⚠️',
    description: '用卦的五行克体卦的五行。比如用为兑金、体为巽木——金克木，即用克体。',
    outcome: '凶险。事情不顺，有外部阻力或小人妨碍，不宜强求。',
    color: 'border-l-red-400',
  },
  {
    id: 'bi-he',
    relation: '体用比和',
    label: '体 = 用',
    icon: '🤝',
    description: '体卦和用卦五行相同。比如体为离火、用也为离火，或同为木（震巽）、同为金（乾兑）。',
    outcome: '上上大吉。万事如意，事情非常顺利，内外和谐，心想事成。',
    color: 'border-l-green-400',
  },
]

// ─── 五行生克速查 ───
const wuxingCycle = [
  { element: '金', generates: '水', overcomes: '木', generatedBy: '土', overcomeBy: '火' },
  { element: '水', generates: '木', overcomes: '火', generatedBy: '金', overcomeBy: '土' },
  { element: '木', generates: '火', overcomes: '土', generatedBy: '水', overcomeBy: '金' },
  { element: '火', generates: '土', overcomes: '金', generatedBy: '木', overcomeBy: '水' },
  { element: '土', generates: '金', overcomes: '水', generatedBy: '火', overcomeBy: '木' },
]

// ─── 互动示例状态 ───
const cardBase = 'bg-[var(--card)] border border-[var(--border)] rounded-xl'

export default function MeihuaPage() {
  usePageTitle()

  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [expandedRelation, setExpandedRelation] = useState<string | null>(null)
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null)

  // 数字起卦互动
  const [num1, setNum1] = useState('')
  const [num2, setNum2] = useState('')
  const [num3, setNum3] = useState('')
  const [numResult, setNumResult] = useState('')

  function calcNumberDivination() {
    const n1 = parseInt(num1) || 0
    const n2 = parseInt(num2) || 0
    const n3 = parseInt(num3) || 0
    if (!n1 || !n2) return

    const shang = n1 % 8
    const xia = n2 % 8
    const yao = n3 ? n3 % 6 : (n1 + n2) % 6

    const shangNum = shang === 0 ? 8 : shang
    const xiaNum = xia === 0 ? 8 : xia
    const yaoNum = yao === 0 ? 6 : yao

    const guaNames = ['', '乾☰', '兑☱', '离☲', '震☳', '巽☴', '坎☵', '艮☶', '坤☷']
    setNumResult(
      `上卦：${n1}÷8=${Math.floor(n1/8)}余${shang}→${guaNames[shangNum]}\n` +
      `下卦：${n2}÷8=${Math.floor(n2/8)}余${xia}→${guaNames[xiaNum]}\n` +
      `动爻：${n3 ? n3 : (n1 + n2)}÷6=${Math.floor((n3 || n1 + n2)/6)}余${yao}→第${yaoNum}爻动`
    )
  }

  return (
    <>
      <PageHeader
        title="梅花易数 — 万物皆数"
        subtitle={`邵雍（邵康节，1011–1077）创立的灵活直觉起卦体系。不拘时间地点，万物皆可入卦——声音、文字、数字、方位……一切皆是「数」的显现。`}
      />

      {/* ═══ 1. 概述 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🌸 什么是梅花易数？</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {[
            {
              title: '创始人',
              icon: '👤',
              content: '邵雍（字尧夫，谥康节），北宋著名理学家、易学家。"北宋五子"之一，与周敦颐、张载、程颢、程颐齐名。著有《皇极经世》《梅花易数》等。其学说以"数"为本，认为宇宙万物皆可由数推演。',
            },
            {
              title: '得名由来',
              icon: '🌸',
              content: '传说邵雍在园中赏梅，见两只麻雀争枝坠地，遂以此象占卜，预言次日有邻家少女折花伤股——结果应验。由此创立以"象"和"数"为根据的占法，称为"梅花易数"。',
            },
            {
              title: '核心思想',
              icon: '💡',
              content: '"万物皆数"——一切事物的发生、变化、结果，都蕴含着"数"的规律。通过捕捉这些"数"，可以还原出其背后的卦象，从而推断吉凶。数与象一体两面：数生象，象藏数。',
            },
            {
              title: '与金钱起卦的区别',
              icon: '⚖️',
              content: '金钱起卦（火珠林/六爻）依赖随机抛掷铜钱，结果全凭天意。梅花易数则主动在现实中"捕捉"数——问卦时间、来者方位、听到的声音、想到的数字……有法可循，更重"感应"和"触机"。',
            },
          ].map(item => (
            <div key={item.title} className="bg-[var(--bg3)]/50 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <span className="text-base mt-0.5">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-[var(--fg)] mb-1">{item.title}</h4>
                  <p className="text-xs text-[var(--fg)]/70 leading-relaxed">{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 2. 体用生克 — 核心原理 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">⚖️ 核心原理：体用生克</h3>

        <div className="bg-[var(--bg3)]/50 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-bold text-[var(--fg)] mb-2">🎯 什么是体与用？</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[var(--card)] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🏠</span>
                <span className="text-sm font-bold text-[var(--accent2)]">体卦（本体）</span>
              </div>
              <p className="text-xs text-[var(--fg)]/70 leading-relaxed">
                代表问卦者自身、所问之事的主体。通常是动爻所在的卦（上下卦中不动的那一个）。体卦是你自己——你的状态、你的能力、你的根基。
              </p>
            </div>
            <div className="bg-[var(--card)] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🌐</span>
                <span className="text-sm font-bold text-[var(--accent2)]">用卦（作用）</span>
              </div>
              <p className="text-xs text-[var(--fg)]/70 leading-relaxed">
                代表外部事物、对方、环境。通常是动爻不在的那一个卦（有动爻的上/下卦）。用卦是你面对的人事物——外在的条件、他人的态度、事情的发展趋势。
              </p>
            </div>
          </div>
        </div>

        {/* 体用判断规则 */}
        <div className="bg-[var(--bg3)]/50 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-bold text-[var(--fg)] mb-2">📐 体用判断规则</h4>
          <ul className="space-y-1.5">
            <li className="text-xs text-[var(--fg)]/70 flex items-start gap-2">
              <span className="text-[var(--accent2)] font-bold">①</span>
              仅一个爻动：动爻所在的卦为"用卦"，不动的那一卦为"体卦"
            </li>
            <li className="text-xs text-[var(--fg)]/70 flex items-start gap-2">
              <span className="text-[var(--accent2)] font-bold">②</span>
              两个爻动：以下卦为体卦，上卦为用卦（古法）
            </li>
            <li className="text-xs text-[var(--fg)]/70 flex items-start gap-2">
              <span className="text-[var(--accent2)] font-bold">③</span>
              三个及以上爻动：以本卦的下卦为体卦，互卦或变卦相关卦为参考
            </li>
            <li className="text-xs text-[var(--fg)]/70 flex items-start gap-2">
              <span className="text-[var(--accent2)] font-bold">④</span>
              六爻皆动：乾坤二卦以"用九""用六"辞断；其余卦以变卦的卦辞断
            </li>
          </ul>
        </div>

        {/* 五行生克速查 */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-[var(--fg)] mb-2">🔗 五行生克速查</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--bg3)]/70">
                  <th className="p-2 text-left text-[var(--muted)] font-semibold">五行</th>
                  <th className="p-2 text-left text-[var(--muted)] font-semibold">所生（我生谁）</th>
                  <th className="p-2 text-left text-[var(--muted)] font-semibold">所克（我克谁）</th>
                  <th className="p-2 text-left text-[var(--muted)] font-semibold">生我者</th>
                  <th className="p-2 text-left text-[var(--muted)] font-semibold">克我者</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {wuxingCycle.map(w => (
                  <tr key={w.element} className="hover:bg-[var(--glow)] transition-colors">
                    <td className="p-2 font-bold text-[var(--fg)]">{w.element}</td>
                    <td className="p-2 text-[var(--fg)]/70">{w.generates}</td>
                    <td className="p-2 text-[var(--fg)]/70">{w.overcomes}</td>
                    <td className="p-2 text-[var(--fg)]/70">{w.generatedBy}</td>
                    <td className="p-2 text-[var(--fg)]/70">{w.overcomeBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-[var(--muted)] mt-2">💡 记忆口诀：金水木火土（相邻相生），金木土水火（隔一相克）</p>
        </div>

        {/* 体用生克关系表 */}
        <div>
          <h4 className="text-sm font-bold text-[var(--fg)] mb-2">📊 体用生克吉凶表</h4>
          <div className="space-y-2">
            {shengKeRelations.map(rel => {
              const isExpanded = expandedRelation === rel.id
              return (
                <div
                  key={rel.id}
                  className={`bg-[var(--bg3)]/50 rounded-lg border-l-4 ${rel.color} cursor-pointer transition-all duration-200 hover:bg-[var(--glow)]`}
                  onClick={() => setExpandedRelation(isExpanded ? null : rel.id)}
                >
                  <div className="px-4 py-3 flex items-center gap-3">
                    <span className="text-lg">{rel.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--fg)]">{rel.relation}</span>
                        <span className="text-[10px] text-[var(--muted)] font-mono">{rel.label}</span>
                      </div>
                      <p className="text-[11px] text-[var(--fg)]/70 mt-0.5">{rel.description.slice(0, 60)}…</p>
                    </div>
                    <span className={`text-[var(--muted)] text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-3 animate-[fadeSlideIn_0.2s_ease-out]">
                      <div className="border-t border-[var(--border)] pt-2.5 space-y-2">
                        <p className="text-xs text-[var(--fg)]/80 leading-relaxed">{rel.description}</p>
                        <div className="bg-[var(--card)] rounded-lg p-2.5">
                          <p className="text-xs text-[var(--fg)] leading-relaxed">
                            <span className="font-bold text-[var(--accent2)]">判断：</span>
                            {rel.outcome}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ 3. 起卦方法 ═══ */}
      <h3 className="text-lg font-bold text-[var(--fg)] mb-4">🔮 起卦方法</h3>

      {divinationMethods.map(method => {
        const isExpanded = expandedMethod === method.id
        return (
          <section key={method.id} className={`${cardBase} overflow-hidden mb-4 transition-all duration-300`}>
            {/* 折叠头 */}
            <button
              onClick={() => setExpandedMethod(isExpanded ? null : method.id)}
              className="w-full flex items-center gap-3 p-4 md:p-5 cursor-pointer hover:bg-[var(--glow)] transition-colors text-left"
            >
              <span className="text-xl shrink-0">{method.symbol}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[var(--fg)]">{method.name}</h3>
                <p className="text-[11px] text-[var(--muted)] mt-0.5">{method.description.slice(0, 60)}…</p>
              </div>
              <span className={`text-[var(--muted)] text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* 折叠内容 */}
            {isExpanded && (
              <div className="px-4 md:px-5 pb-5 animate-[fadeSlideIn_0.25s_ease-out]">
                <div className="border-t border-[var(--border)] pt-4 space-y-4">
                  {/* 详细说明 */}
                  <p className="text-xs text-[var(--fg)]/80 leading-relaxed">{method.description}</p>

                  {/* 步骤 */}
                  <div>
                    <h4 className="text-xs font-semibold text-[var(--fg)] mb-2">📋 操作步骤</h4>
                    <ol className="space-y-1.5 pl-1">
                      {method.steps.map((step, i) => (
                        <li key={i} className="text-xs text-[var(--fg)]/70 flex items-start gap-2">
                          <span className="text-[var(--accent2)] font-bold text-[10px] shrink-0 mt-0.5 w-4">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* 示例 */}
                  <div className="bg-[var(--bg3)]/50 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-[var(--fg)] mb-1.5">💡 示例</h4>
                    <p className="text-[11px] text-[var(--muted)] mb-1.5">输入：{method.example.input}</p>
                    <p className="text-xs text-[var(--fg)]/80 leading-relaxed whitespace-pre-line">{method.example.result}</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )
      })}

      {/* ═══ 3.5 数字起卦互动 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🧮 动手试试：数字起卦</h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          输入三个正整数（或两个），看看能得到什么卦。
        </p>

        <div className="flex flex-wrap items-end gap-3 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[var(--muted)] font-semibold">第一组数（上卦）</label>
            <input
              type="number"
              min="1"
              value={num1}
              onChange={e => { setNum1(e.target.value); setNumResult('') }}
              placeholder="如 3"
              className="w-20 px-3 py-2 rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-sm text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[var(--muted)] font-semibold">第二组数（下卦）</label>
            <input
              type="number"
              min="1"
              value={num2}
              onChange={e => { setNum2(e.target.value); setNumResult('') }}
              placeholder="如 8"
              className="w-20 px-3 py-2 rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-sm text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[var(--muted)] font-semibold">第三组数（动爻·可选）</label>
            <input
              type="number"
              min="1"
              value={num3}
              onChange={e => { setNum3(e.target.value); setNumResult('') }}
              placeholder="如 5"
              className="w-20 px-3 py-2 rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-sm text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <button
            onClick={calcNumberDivination}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--bg)] text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            起卦
          </button>
        </div>

        {numResult && (
          <div className="bg-[var(--bg3)]/50 rounded-lg p-4 animate-[fadeSlideIn_0.25s_ease-out]">
            <p className="text-xs text-[var(--fg)]/80 leading-relaxed whitespace-pre-line font-mono">{numResult}</p>
          </div>
        )}
      </section>

      {/* ═══ 4. 八卦对应表 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">📋 八卦对应表（先天八卦数）</h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          梅花易数使用<strong className="text-[var(--accent2)]">先天八卦数</strong>起卦：乾1 兑2 离3 震4 巽5 坎6 艮7 坤8。牢记此数列，起卦全凭它。
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--bg3)]/70">
                <th className="p-2.5 text-left text-[var(--muted)] font-semibold">卦名</th>
                <th className="p-2.5 text-center text-[var(--muted)] font-semibold">先天数</th>
                <th className="p-2.5 text-center text-[var(--muted)] font-semibold">卦符</th>
                <th className="p-2.5 text-left text-[var(--muted)] font-semibold">五行</th>
                <th className="p-2.5 text-left text-[var(--muted)] font-semibold">性情</th>
                <th className="p-2.5 text-left text-[var(--muted)] font-semibold">方位</th>
                <th className="p-2.5 text-left text-[var(--muted)] font-semibold">家庭</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {baguaTable.map(gua => (
                <tr key={gua.name} className="hover:bg-[var(--glow)] transition-colors">
                  <td className="p-2.5">
                    <span className="font-bold text-[var(--fg)]"><RubyText text={gua.name} /></span>
                  </td>
                  <td className="p-2.5 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent)]/15 text-[var(--accent2)] font-bold text-xs">{gua.number}</span>
                  </td>
                  <td className="p-2.5 text-center text-base text-[var(--fg)]">{gua.symbol}</td>
                  <td className="p-2.5 text-[var(--fg)]/70">{gua.element}</td>
                  <td className="p-2.5 text-[var(--fg)]/70">{gua.nature}</td>
                  <td className="p-2.5 text-[var(--fg)]/70">{gua.direction}</td>
                  <td className="p-2.5 text-[var(--fg)]/70">{gua.family}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-[var(--bg3)]/50 rounded-lg">
          <p className="text-[11px] text-[var(--fg)]/70 leading-relaxed">
            <span className="font-bold text-[var(--accent2)]">💡 记忆口诀（先天八卦数）：</span>
            「乾三连1、兑上缺2、离中虚3、震仰盂4、巽下断5、坎中满6、艮覆碗7、坤六断8」
          </p>
        </div>
      </section>

      {/* ═══ 5. 体用生克总结表 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">📊 体用生克一览</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--bg3)]/70">
                <th className="p-2.5 text-left text-[var(--muted)] font-semibold">生克关系</th>
                <th className="p-2.5 text-left text-[var(--muted)] font-semibold">含义</th>
                <th className="p-2.5 text-left text-[var(--muted)] font-semibold">结果</th>
                <th className="p-2.5 text-left text-[var(--muted)] font-semibold">吉凶</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {shengKeRelations.map(rel => (
                <tr key={rel.id} className="hover:bg-[var(--glow)] transition-colors">
                  <td className="p-2.5">
                    <div className="flex items-center gap-1.5">
                      <span>{rel.icon}</span>
                      <span className="font-bold text-[var(--fg)]">{rel.relation}</span>
                    </div>
                  </td>
                  <td className="p-2.5 text-[var(--fg)]/70">{rel.description}</td>
                  <td className="p-2.5 text-[var(--fg)]/70">{rel.outcome}</td>
                  <td className="p-2.5">
                    {rel.id === 'yong-sheng-ti' || rel.id === 'bi-he' ? (
                      <span className="text-emerald-400 font-bold">大吉</span>
                    ) : rel.id === 'ti-ke-yong' ? (
                      <span className="text-sky-400 font-bold">小吉</span>
                    ) : rel.id === 'ti-sheng-yong' ? (
                      <span className="text-amber-400 font-bold">平</span>
                    ) : (
                      <span className="text-red-400 font-bold">凶</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-[var(--muted)] mt-3 leading-relaxed">
          ⚠️ 体用生克是梅花易数判断的"主线"而非"全部"。实际解卦还需结合卦辞爻辞、互卦、变卦、卦象等诸多因素综合判断。
        </p>
      </section>

      {/* ═══ 6. 解卦流程提要 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🧭 梅花易数解卦流程</h3>
        <div className="space-y-3">
          {[
            { step: '一', title: '起卦', desc: '以年月日时、数字、声音、文字或方位等方法，确定本卦（上下卦）和动爻。' },
            { step: '二', title: '定体用', desc: '找出动爻所在的卦（用卦）和不动的那一卦（体卦）。这是整个解卦的核心支点。' },
            { step: '三', title: '看互卦', desc: '本卦的二三四爻组成下互卦，三四五爻组成上互卦。互卦揭示事物发展过程的中间状态。' },
            { step: '四', title: '看变卦', desc: '动爻阴阳变反后产生的新卦。变卦揭示事物的最终结果和走向。' },
            { step: '五', title: '体用生克', desc: '以体卦和用卦的五行属性进行生克分析，判断吉凶主调。这是梅花易数最关键的一步。' },
            { step: '六', title: '读卦辞爻辞', desc: '参考《周易》本卦和动爻对应的卦辞爻辞，获取更多细节信息。' },
            { step: '七', title: '综合判断', desc: '综合体用生克（主吉凶）、互卦（过程）、变卦（结果）、卦爻辞（细节）、卦象联想（直觉）——得出最终结论。切勿孤立看某一项。' },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-3 bg-[var(--bg3)]/50 rounded-lg p-3">
              <span className="w-6 h-6 rounded-full bg-[var(--accent)]/15 text-[var(--accent2)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {item.step}
              </span>
              <div>
                <h4 className="text-sm font-bold text-[var(--fg)]">{item.title}</h4>
                <p className="text-xs text-[var(--fg)]/70 leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 7. 梅花易数名句 ═══ */}
      <section className={`${cardBase} p-5 md:p-6`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">📝 《梅花易数》经典语句</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { text: '万物皆数，数尽则象见。', source: '梅花易数·总纲', topic: '核心思想' },
            { text: '观梅以占，验如桴鼓。', source: '梅花易数·序', topic: '得名' },
            { text: '物之成毁，皆有定数。', source: '梅花易数·卷一', topic: '定数观' },
            { text: '动者为用，静者为体。', source: '梅花易数·体用', topic: '体用' },
            { text: '有动则有变，有变则有占。', source: '梅花易数·动变', topic: '变易' },
            { text: '数为天地之机。', source: '梅花易数·序', topic: '数论' },
            { text: '吉凶悔吝，生乎动者也。', source: '梅花易数·卷一', topic: '吉凶' },
            { text: '远取诸物，近取诸身。', source: '梅花易数·取象', topic: '取象' },
            { text: '以目之所见、耳之所闻，皆可作卦。', source: '梅花易数·取卦', topic: '灵活' },
            { text: '法无定法，存乎一心。', source: '梅花易数·心法', topic: '心法' },
          ].map((q, i) => (
            <div
              key={i}
              className="bg-[var(--bg3)]/50 rounded-lg px-3 py-2.5 hover:bg-[var(--glow)] transition-colors cursor-default"
            >
              <p className="text-xs text-[var(--fg)] leading-relaxed font-mono">&ldquo;{q.text}&rdquo;</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[var(--muted)]">—— {q.source}</span>
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent2)]">{q.topic}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </>
  )
}
