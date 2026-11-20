// 变占规则层 —— 依据朱熹《易学启蒙·考变占》七条
//
// 无变爻 → 以本卦卦辞占
// 一爻变 → 以本卦变爻爻辞占
// 二爻变 → 以本卦二变爻爻辞占，以上爻为主
// 三爻变 → 占本卦及之卦卦辞，以本卦为主
// 四爻变 → 占之卦二不变爻爻辞，以下爻为主
// 五爻变 → 占之卦不变爻爻辞
// 六爻变 → 乾坤占用九用六，余卦以之卦卦辞占
//
// 本模块只负责「怎么断」，不负责「怎么起卦」，便于单独测试。

import { getHexagramName, yao6ToTrigramIds, type HexagramDetail } from './bagua'

export type GetDetail = (upperId: string, lowerId: string) => HexagramDetail | undefined

/** yao6 数组下标：0 = 上爻，5 = 初爻（与 bagua.ts 的约定一致） */

export interface YaoRef {
  /** 该爻取自本卦还是变卦 */
  source: 'now' | 'changed'
  /** 在 yao6 数组中的下标，0 为上爻、5 为初爻 */
  index: number
  /** 显示标签，如「乾·初九」 */
  label: string
  /** 爻题，如「初九」 */
  pos: string
  text: string
  meaning: string
  /** 是否为本次占断的主断依据 */
  primary: boolean
}

export interface DivinationAnalysis {
  /** 变爻位置，1-based 从下往上，升序 */
  movingKeys: number[]
  movingCount: number
  nowName: string
  changedName: string
  /** 规则简称，如「二爻变」 */
  rule: string
  /** 规则说明 */
  ruleText: string
  /** 主断依据的一行摘要 */
  primaryLabel: string
  refs: YaoRef[]
  /** 是否以本卦卦辞为断 */
  useNowJudgment: boolean
  /** 是否以变卦卦辞为断 */
  useChangedJudgment: boolean
  /** 六爻全变时的用九 / 用六 */
  special?: { name: string, text: string, meaning: string }
  /** 变卦六爻数组（已翻转全部变爻） */
  changedYao6: number[]
}

const USE_JIU = {
  name: '用九',
  text: '见群龙无首，吉',
  meaning: '六爻皆变，阳气大同，不以刚强居首，反而吉利。',
}

const USE_LIU = {
  name: '用六',
  text: '利永贞',
  meaning: '六爻皆变，阴柔顺从，利于永远守持正道。',
}

/**
 * 从六次投掷结果中取出变爻位置。
 * sums 顺序为「初爻 → 上爻」，每项是 6/7/8/9 的和（6、9 为变爻）。
 */
export function movingKeysFromSums(sums: number[]): number[] {
  const keys: number[] = []
  sums.forEach((s, i) => {
    if (s === 6 || s === 9) keys.push(i + 1)
  })
  return keys
}

/** 按变爻位置翻转六爻数组（1-based，从下往上） */
export function flipMovingLines(yao6: number[], movingKeys: number[]): number[] {
  return yao6.map((v, i) => (movingKeys.includes(6 - i) ? (v === 1 ? 0 : 1) : v))
}

function buildRef(
  source: 'now' | 'changed',
  hexName: string,
  detail: HexagramDetail | undefined,
  index: number,
  primary: boolean,
): YaoRef | null {
  const line = detail?.yaoLines?.[5 - index]
  if (!line) return null
  return {
    source,
    index,
    label: `${hexName}·${line.pos}`,
    pos: line.pos,
    text: line.text,
    meaning: line.meaning,
    primary,
  }
}

/**
 * 按传统变占规则给出占断依据。
 * @param yao6 六爻数组 [line6..line1]，1 = 阳、0 = 阴
 * @param movingKeysIn 变爻位置，1-based 从下往上（可为空）
 * @param getDetail 取卦辞/爻辞的回调，避免数据模块循环依赖
 */
export function analyzeDivination(
  yao6: number[],
  movingKeysIn: number[],
  getDetail: GetDetail,
): DivinationAnalysis {
  const ids = yao6ToTrigramIds(yao6)
  if (!ids) throw new Error('invalid yao6: 无法从六爻推出上下卦')

  const movingKeys = [...new Set(movingKeysIn.filter(k => k >= 1 && k <= 6))].sort((a, b) => a - b)
  const movingIndexes = movingKeys.map(k => 6 - k)
  const stillIndexes = [0, 1, 2, 3, 4, 5].filter(i => !movingIndexes.includes(i))

  const nowName = getHexagramName(ids.upperId, ids.lowerId)
  const nowDetail = getDetail(ids.upperId, ids.lowerId)

  const changedYao6 = flipMovingLines(yao6, movingKeys)
  const cids = yao6ToTrigramIds(changedYao6)
  if (!cids) throw new Error('invalid changed yao6')
  const changedName = getHexagramName(cids.upperId, cids.lowerId)
  const changedDetail = getDetail(cids.upperId, cids.lowerId)

  const base = {
    movingKeys,
    movingCount: movingKeys.length,
    nowName,
    changedName,
    refs: [] as YaoRef[],
    useNowJudgment: false,
    useChangedJudgment: false,
    changedYao6,
  }

  // ── 无变爻：静卦，以本卦卦辞占 ──
  if (movingKeys.length === 0) {
    return {
      ...base,
      rule: '六爻皆静',
      ruleText: '六爻皆静，以本卦卦辞占。事态暂无转折，按本卦所示行事即可。',
      primaryLabel: `${nowName} 卦辞`,
      useNowJudgment: true,
    }
  }

  // ── 一爻变：以本卦该爻爻辞占 ──
  if (movingKeys.length === 1) {
    const idx = movingIndexes[0]
    const ref = buildRef('now', nowName, nowDetail, idx, true)
    return {
      ...base,
      rule: '一爻变',
      ruleText: '以本卦变爻的爻辞占，变卦作为趋势参考。',
      primaryLabel: ref ? ref.label : nowName + ' 变爻',
      refs: ref ? [ref] : [],
    }
  }

  // ── 二爻变：本卦二变爻，以上爻为主 ──
  if (movingKeys.length === 2) {
    const primaryIdx = Math.min(...movingIndexes) // 上爻 = 数组下标更小
    const refs = movingIndexes
      .map(i => buildRef('now', nowName, nowDetail, i, i === primaryIdx))
      .filter((r): r is YaoRef => r !== null)
    const primaryRef = refs.find(r => r.primary)
    return {
      ...base,
      rule: '二爻变',
      ruleText: '以本卦两个变爻的爻辞占，以上爻为主。',
      primaryLabel: primaryRef ? primaryRef.label : nowName + ' 上变爻',
      refs,
    }
  }

  // ── 三爻变：本卦与变卦卦辞，以本卦为主 ──
  if (movingKeys.length === 3) {
    return {
      ...base,
      rule: '三爻变',
      ruleText: '占本卦与变卦的卦辞，以本卦为主，变卦为辅。',
      primaryLabel: `${nowName} 卦辞（主） · ${changedName} 卦辞（辅）`,
      useNowJudgment: true,
      useChangedJudgment: true,
    }
  }

  // ── 四爻变：变卦二不变爻，以下爻为主 ──
  if (movingKeys.length === 4) {
    const primaryIdx = Math.max(...stillIndexes) // 下爻 = 数组下标更大
    const refs = stillIndexes
      .map(i => buildRef('changed', changedName, changedDetail, i, i === primaryIdx))
      .filter((r): r is YaoRef => r !== null)
    const primaryRef = refs.find(r => r.primary)
    return {
      ...base,
      rule: '四爻变',
      ruleText: '占变卦两个不变爻的爻辞，以下爻为主。',
      primaryLabel: primaryRef ? primaryRef.label : changedName + ' 下不变爻',
      refs,
    }
  }

  // ── 五爻变：变卦唯一不变爻 ──
  if (movingKeys.length === 5) {
    const ref = buildRef('changed', changedName, changedDetail, stillIndexes[0], true)
    return {
      ...base,
      rule: '五爻变',
      ruleText: '占变卦唯一不变爻的爻辞。',
      primaryLabel: ref ? ref.label : changedName + ' 不变爻',
      refs: ref ? [ref] : [],
    }
  }

  // ── 六爻变：乾坤用二用，余卦占之卦卦辞 ──
  if (nowName === '乾') {
    return {
      ...base,
      rule: '六爻变',
      ruleText: '六爻皆变，乾卦占用九。',
      primaryLabel: '乾 · 用九',
      special: USE_JIU,
    }
  }
  if (nowName === '坤') {
    return {
      ...base,
      rule: '六爻变',
      ruleText: '六爻皆变，坤卦占用六。',
      primaryLabel: '坤 · 用六',
      special: USE_LIU,
    }
  }
  return {
    ...base,
    rule: '六爻变',
    ruleText: '六爻皆变，以变卦的卦辞占。',
    primaryLabel: `${changedName} 卦辞`,
    useChangedJudgment: true,
  }
}
