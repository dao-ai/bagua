/**
 * 六爻排盘完整数据层
 *
 * 传统六爻装卦流程：
 *   1. 定八宫 → 确定本卦属于哪一宫、第几世
 *   2. 纳甲   → 给每爻配天干
 *   3. 纳支   → 给每爻配地支
 *   4. 定世应 → 找出世爻和应爻位置
 *   5. 装六亲 → 以宫位五行为「我」，各爻地支五行为「他」，生克定六亲
 *   6. 配六神 → 以日干定六神顺序，自初爻起排
 */

import { baguaIndex, baguaMap } from './bagua'

// ─── 基础常量 ───

/** 十天干 */
export const TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'] as const

/** 十二地支 */
export const DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'] as const

/** 地支五行 */
export const DIZHI_WUXING: Record<string, string> = {
  子:'水', 丑:'土', 寅:'木', 卯:'木', 辰:'土',
  巳:'火', 午:'火', 未:'土', 申:'金', 酉:'金', 戌:'土', 亥:'水',
}

/** 六神名称 */
export const LIU_SHEN = ['青龙','朱雀','勾陈','螣蛇','白虎','玄武'] as const

/** 六亲名称 */
export const LIU_QIN = ['父母','兄弟','妻财','官鬼','子孙'] as const

/** 八卦五行 */
export const BAGUA_WUXING: Record<string, string> = {
  qian:'金', dui:'金', li:'火', zhen:'木',
  xun:'木', kan:'水', gen:'土', kun:'土',
}

// ─── 八宫卦分类 ───

/**
 * 八宫卦索引: [下卦索引][上卦索引]
 * 每个宫8卦: 本宫 + 一世～五世 + 游魂 + 归魂
 */
export const PALACE_HEXAGRAMS: Record<number, [number, number][]> = {
  0: [ // 乾宫
    [0,0], [4,0], [6,0], [7,0], [7,4], [7,6], [7,2], [0,2],
  ],
  1: [ // 兑宫
    [1,1], [5,1], [7,1], [6,1], [6,5], [6,7], [6,3], [1,3],
  ],
  2: [ // 离宫
    [2,2], [6,2], [4,2], [5,2], [5,6], [5,4], [5,0], [2,0],
  ],
  3: [ // 震宫
    [3,3], [7,3], [5,3], [4,3], [4,7], [4,5], [4,1], [3,1],
  ],
  4: [ // 巽宫
    [4,4], [0,4], [2,4], [3,4], [3,0], [3,2], [3,6], [4,6],
  ],
  5: [ // 坎宫
    [5,5], [1,5], [3,5], [2,5], [2,1], [2,3], [2,7], [5,7],
  ],
  6: [ // 艮宫
    [6,6], [2,6], [0,6], [1,6], [1,2], [1,0], [1,4], [6,4],
  ],
  7: [ // 坤宫
    [7,7], [7,3], [7,1], [7,0], [0,3], [0,1], [0,5], [7,5],
  ],
}

export type GenerationType = '本宫' | '一世' | '二世' | '三世' | '四世' | '五世' | '游魂' | '归魂'
const GENERATION_NAMES: GenerationType[] = ['本宫','一世','二世','三世','四世','五世','游魂','归魂']

// ─── 纳甲干 ───

/** 八卦纳甲（内卦/下卦天干） */
const INNER_STEM: Record<string, string> = {
  qian:'甲', kun:'乙', gen:'丙', dui:'丁',
  kan:'戊', li:'己', zhen:'庚', xun:'辛',
}
/** 八卦纳甲（外卦/上卦天干） */
const OUTER_STEM: Record<string, string> = {
  qian:'壬', kun:'癸', gen:'丙', dui:'丁',
  kan:'戊', li:'己', zhen:'庚', xun:'辛',
}

// ─── 纳支 ───

type BranchList = [string, string, string, string, string, string] // 初→上

/** 阳卦纳支（顺行，每隔一辰） */
const YANG_BRANCHES: Record<string, BranchList> = {
  qian: ['子','寅','辰','午','申','戌'],
  zhen: ['子','寅','辰','午','申','戌'],
  kan:  ['寅','辰','午','申','戌','子'],
  gen:  ['辰','午','申','戌','子','寅'],
}
/** 阴卦纳支（逆行，每隔一辰） */
const YIN_BRANCHES: Record<string, BranchList> = {
  kun: ['未','巳','卯','丑','亥','酉'],
  xun: ['丑','亥','酉','未','巳','卯'],
  li:  ['卯','丑','亥','酉','未','巳'],
  dui: ['巳','卯','丑','亥','酉','未'],
}

/** 判断八卦阴阳 */
function isYangTrigram(id: string): boolean {
  return ['qian','zhen','kan','gen'].includes(id)
}

// ─── 六神规则 ───

/** 日干 → 六神起始位（初爻） */
const SHEN_ORDER: Record<string, number> = {
  '甲':0, '乙':0, '丙':1, '丁':1, '戊':2,
  '己':2, '庚':3, '辛':3, '壬':4, '癸':4,
}

// ─── 五行生克工具 ───

const WX_CYCLE = ['木','火','土','金','水']

function wxIndex(wx: string): number { return WX_CYCLE.indexOf(wx) }

/**
 * 生克关系：以 palaceWx 为「我」
 */
function wxRelation(palaceWx: string, lineWx: string): string {
  if (palaceWx === lineWx) return '兄弟'
  const pi = wxIndex(palaceWx)
  const li = wxIndex(lineWx)
  // 生我 (line 生 palace)
  if ((li + 1) % 5 === pi) return '父母'
  // 我生 (palace 生 line)
  if ((pi + 1) % 5 === li) return '子孙'
  // 克我 (line 克 palace)
  if ((li + 2) % 5 === pi) return '官鬼'
  // 我克 (palace 克 line)
  return '妻财'
}

// ─── 世应规则 ───

/** [世爻位置, 应爻位置] 0=初,5=上 */
const SHI_YING: Record<GenerationType, [number, number]> = {
  '本宫': [5, 2],
  '一世': [0, 3],
  '二世': [1, 4],
  '三世': [2, 5],
  '四世': [3, 0],
  '五世': [4, 1],
  '游魂': [3, 0],
  '归魂': [2, 5],
}

// ─── 核心数据类型 ───

export interface YaoInfo {
  position: number       // 0=初爻 … 5=上爻
  posName: string        // '初爻'|'二爻'|…|'上爻'
  yang: boolean          // true=阳爻(—) false=阴爻(- -)
  stem: string           // 天干 如 '甲'
  branch: string         // 地支 如 '子'
  wuxing: string         // 地支五行
  liuqin: string         // 六亲
  liushen: string        // 六神
  isShi: boolean         // 是否为世爻
  isYing: boolean        // 是否为应爻
}

export interface LiuyaoResult {
  /** 所属宫名 (如 '乾宫') */
  palaceName: string
  palaceId: string
  /** 五行（宫位） */
  palaceWuxing: string
  /** 世爻类型 */
  generation: GenerationType
  /** 纳甲后天干（上下卦） */
  innerStem: string
  outerStem: string
  /** 六爻 */
  lines: [YaoInfo, YaoInfo, YaoInfo, YaoInfo, YaoInfo, YaoInfo]
  upperId: string
  lowerId: string
}

const POS_NAMES = ['初爻','二爻','三爻','四爻','五爻','上爻']

// ─── 主入口 ───

/**
 * 为指定卦象计算完整的六爻排盘
 *
 * @param upperId  上卦（外卦）ID
 * @param lowerId  下卦（内卦）ID
 * @param dayStem  日干（用于六神），默认 '甲'
 */
export function computeLiuyao(
  upperId: string,
  lowerId: string,
  dayStem: string = '甲',
): LiuyaoResult | null {
  // 1. 定位八宫
  const lowerIdx = baguaIndex[lowerId]
  const upperIdx = baguaIndex[upperId]
  if (lowerIdx === undefined || upperIdx === undefined) return null

  let foundPalace: number | null = null
  let generationIdx = 0
  for (const [palace, hexagrams] of Object.entries(PALACE_HEXAGRAMS)) {
    const idx = hexagrams.findIndex(([l, u]) => l === lowerIdx && u === upperIdx)
    if (idx !== -1) {
      foundPalace = Number(palace)
      generationIdx = idx
      break
    }
  }
  if (foundPalace === null) return null

  const palaceNames = ['乾','兑','离','震','巽','坎','艮','坤']
  const palaceIds   = ['qian','dui','li','zhen','xun','kan','gen','kun']
  const palaceId   = palaceIds[foundPalace]
  const palaceName = palaceNames[foundPalace]
  const palaceWx   = BAGUA_WUXING[palaceId] || '土'
  const generation = GENERATION_NAMES[generationIdx]

  // 2. 纳甲
  const innerStem = INNER_STEM[lowerId] || '甲'
  const outerStem = OUTER_STEM[upperId] || '壬'

  // 3. 纳支
  const branches: BranchList = isYangTrigram(lowerId)
    ? [...(YANG_BRANCHES[lowerId] || YANG_BRANCHES.qian)]
    : [...(YIN_BRANCHES[lowerId] || YIN_BRANCHES.kun)]
  const upperBranches: string[] = isYangTrigram(upperId)
    ? [...(YANG_BRANCHES[upperId] || YANG_BRANCHES.qian)]
    : [...(YIN_BRANCHES[upperId] || YIN_BRANCHES.kun)]
  branches[3] = upperBranches[3]
  branches[4] = upperBranches[4]
  branches[5] = upperBranches[5]

  // 4. 世应
  const [shiPos, yingPos] = SHI_YING[generation]

  // 5. 六神起始位
  const shenStart = SHEN_ORDER[dayStem] ?? 0

  // 6. 获取爻值（初→上）
  const lb = baguaMap[lowerId]
  const ub = baguaMap[upperId]
  const yao6FromBottom: number[] = [
    lb.yao[0], lb.yao[1], lb.yao[2],
    ub.yao[0], ub.yao[1], ub.yao[2],
  ]

  // 7. 构建六爻
  const stems = [innerStem, innerStem, innerStem, outerStem, outerStem, outerStem]
  const lines: YaoInfo[] = Array.from({ length: 6 }, (_, i) => {
    const branch = branches[i]
    const wx = DIZHI_WUXING[branch] || '土'
    const liuqin = wxRelation(palaceWx, wx)
    const shenIdx = (shenStart + i) % 6
    return {
      position: i,
      posName: POS_NAMES[i],
      yang: yao6FromBottom[i] === 1,
      stem: stems[i],
      branch,
      wuxing: wx,
      liuqin,
      liushen: LIU_SHEN[shenIdx],
      isShi: i === shiPos,
      isYing: i === yingPos,
    }
  })

  return {
    palaceName: `${palaceName}宫`,
    palaceId,
    palaceWuxing: palaceWx,
    generation,
    innerStem,
    outerStem,
    lines: lines as [YaoInfo, YaoInfo, YaoInfo, YaoInfo, YaoInfo, YaoInfo],
    upperId,
    lowerId,
  }
}

/** 青龙·朱雀·勾陈·螣蛇·白虎·玄武 图标映射 */
export const LIU_SHEN_ICON: Record<string, string> = {
  '青龙':'🐉', '朱雀':'🦜', '勾陈':'🦎',
  '螣蛇':'🐍', '白虎':'🐯', '玄武':'🐢',
}

/** 六亲颜色（古典配色） */
export const LIU_QIN_COLOR: Record<string, string> = {
  '父母':'#e74c3c',   // 红 — 父母为尊
  '兄弟':'#3498db',   // 蓝 — 兄弟如手足
  '妻财':'#f39c12',   // 金 — 妻财为利
  '官鬼':'#2c3e50',   // 黑 — 官鬼为克
  '子孙':'#27ae60',   // 绿 — 子孙为生
}

/** 五行颜色 */
export const WUXING_COLOR: Record<string, string> = {
  '木':'#27ae60', '火':'#e74c3c',
  '土':'#f39c12', '金':'#bdc3c7', '水':'#2980b9',
}

/** 六神颜色 */
export const LIU_SHEN_COLOR: Record<string, string> = {
  '青龙':'#27ae60', '朱雀':'#e74c3c',
  '勾陈':'#f39c12', '螣蛇':'#8e44ad',
  '白虎':'#bdc3c7', '玄武':'#2980b9',
}
