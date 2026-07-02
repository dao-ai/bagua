import { baguaList, hexagramSymbol, getHexagramName } from './bagua'

// ═══════════════════════════════════════
//  爻位体系 — 数据和类型定义
// ═══════════════════════════════════════

// ─── 爻位基本信息 ───

export interface PosInfo {
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

export const posInfo: PosInfo[] = [
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

export interface RelationInfo {
  name: string
  char: string
  brief: string
  detail: string
  example: string
}

export const relations: RelationInfo[] = [
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

export interface PositionRule {
  pos: string
  index: number
  nature: '阳位' | '阴位'
  ideal: '阳爻' | '阴爻'
  match: string
  mismatch: string
}

export const positionRules: PositionRule[] = [
  { pos: '初', index: 0, nature: '阳位', ideal: '阳爻', match: '初九（阳居阳位）→ 当位', mismatch: '初六（阴居阳位）→ 不当位' },
  { pos: '二', index: 1, nature: '阴位', ideal: '阴爻', match: '六二（阴居阴位）→ 当位 ✅', mismatch: '九二（阳居阴位）→ 不当位' },
  { pos: '三', index: 2, nature: '阳位', ideal: '阳爻', match: '九三（阳居阳位）→ 当位', mismatch: '六三（阴居阳位）→ 不当位' },
  { pos: '四', index: 3, nature: '阴位', ideal: '阴爻', match: '六四（阴居阴位）→ 当位', mismatch: '九四（阳居阴位）→ 不当位' },
  { pos: '五', index: 4, nature: '阳位', ideal: '阳爻', match: '九五（阳居阳位）→ 当位 ✅', mismatch: '六五（阴居阳位）→ 不当位' },
  { pos: '上', index: 5, nature: '阴位', ideal: '阴爻', match: '上六（阴居阴位）→ 当位', mismatch: '上九（阳居阴位）→ 不当位' },
]

// ─── 所有六十四卦列表（用于卦选择器） ───

export interface HexagramItem {
  key: string
  name: string
  upperId: string
  lowerId: string
  symbol: string
}

const baguaIds = baguaList.map(b => b.id)
export const allHexagrams: HexagramItem[] = baguaIds.flatMap(lowerId =>
  baguaIds.map(upperId => ({
    key: `${upperId}-${lowerId}`,
    name: getHexagramName(upperId, lowerId),
    upperId,
    lowerId,
    symbol: hexagramSymbol[getHexagramName(upperId, lowerId)] || '',
  }))
).filter(h => h.name)
