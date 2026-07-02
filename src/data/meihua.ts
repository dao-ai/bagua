// ═══════════════════════════════════════
//  梅花易数 — 数据和类型定义
// ═══════════════════════════════════════

// ─── 起卦方法 ───

export interface DivinationMethod {
  id: string
  name: string
  symbol: string
  description: string
  steps: string[]
  example: { input: string; result: string }
  color: string
}

export const divinationMethods: DivinationMethod[] = [
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

export interface BaguaEntry {
  name: string
  pinyin: string
  number: number
  symbol: string
  element: string      // 五行
  nature: string       // 性情
  direction: string    // 方位
  family: string       // 家庭角色
}

export const baguaTable: BaguaEntry[] = [
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

export interface ShengKeRelation {
  id: string
  relation: string
  label: string
  icon: string
  description: string
  outcome: string
  color: string
}

export const shengKeRelations: ShengKeRelation[] = [
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

export const wuxingCycle = [
  { element: '金', generates: '水', overcomes: '木', generatedBy: '土', overcomeBy: '火' },
  { element: '水', generates: '木', overcomes: '火', generatedBy: '金', overcomeBy: '土' },
  { element: '木', generates: '火', overcomes: '土', generatedBy: '水', overcomeBy: '金' },
  { element: '火', generates: '土', overcomes: '金', generatedBy: '木', overcomeBy: '水' },
  { element: '土', generates: '金', overcomes: '水', generatedBy: '火', overcomeBy: '木' },
]
