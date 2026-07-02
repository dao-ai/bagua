import { getHexagramName, getHexagramSymbol, buildYao6, yao6ToTrigramIds } from './bagua'

export interface RelationResult {
  upperId: string
  lowerId: string
  name: string
  symbol: string
}

/**
 * 互卦 (Interlocking Hexagram) — 六爻卦的二至五爻重新组合
 *
 * 原六爻: [line6, line5, line4, line3, line2, line1]
 *           ^  ^^^^^^  ^^^^^^  ^^^^^^  ^^^^^^
 *           |  上卦第二爻...  下卦第三爻...
 *          上卦上爻
 *
 * 互卦下卦 = [line2, line3, line4]
 * 互卦上卦 = [line3, line4, line5]
 *
 * 在yao6中: line2=yao6[4], line3=yao6[3], line4=yao6[2], line5=yao6[1]
 * 互卦下卦三爻(从下到上) = [yao6[4], yao6[3], yao6[2]]
 * 互卦上卦三爻(从下到上) = [yao6[3], yao6[2], yao6[1]]
 * 组合成新 yao6 = 互卦上卦三爻(以上爻至初爻) + 互卦下卦三爻(以上爻至初爻)
 * = [yao6[1], yao6[2], yao6[3], yao6[2], yao6[3], yao6[4]]
 */
export function getInterlocking(upperId: string, lowerId: string): RelationResult | null {
  const yao6 = buildYao6(upperId, lowerId)

  // 互卦上卦三爻（从下到上）= [line3, line4, line5]
  const upperTrigramYao = [yao6[3], yao6[2], yao6[1]]  // [下,中,上] for new upper trigram
  // 互卦下卦三爻（从下到上）= [line2, line3, line4]
  const lowerTrigramYao = [yao6[4], yao6[3], yao6[2]]  // [下,中,上] for new lower trigram

  // 构建新的yao6用于查找
  const newYao6 = [
    ...upperTrigramYao.slice().reverse(),  // 上卦三爻从y6格式
    ...lowerTrigramYao.slice().reverse(),   // 下卦三爻从y6格式
  ]

  const ids = yao6ToTrigramIds(newYao6)
  if (!ids) return null

  return {
    ...ids,
    name: getHexagramName(ids.upperId, ids.lowerId),
    symbol: getHexagramSymbol(ids.upperId, ids.lowerId),
  }
}

/**
 * 错卦 (Opposite Hexagram) — 全爻阴阳相反
 * 每个爻: yang(1)→yin(0), yin(0)→yang(1)
 */
export function getOpposite(upperId: string, lowerId: string): RelationResult | null {
  const yao6 = buildYao6(upperId, lowerId)
  const oppositeYao6 = yao6.map(y => (y === 1 ? 0 : 1))

  const ids = yao6ToTrigramIds(oppositeYao6)
  if (!ids) return null

  return {
    ...ids,
    name: getHexagramName(ids.upperId, ids.lowerId),
    symbol: getHexagramSymbol(ids.upperId, ids.lowerId),
  }
}

/**
 * 综卦 (Inverted Hexagram) — 六爻上下颠倒
 * yao6 = [line6, line5, line4, line3, line2, line1]
 * 颠倒后 = [line1, line2, line3, line4, line5, line6]
 * 再重新拆分为上下卦
 *
 * 例: 需卦(上坎下乾) yao6 = 坎[0,1,0]→[0,1,0]反 + 乾[1,1,1]→[1,1,1]反
 *   = [0,1,0, 1,1,1]
 * 颠倒 = [1,1,1, 0,1,0] → 上乾下坎 → 讼卦 ✓
 */
export function getInverted(upperId: string, lowerId: string): RelationResult | null {
  const yao6 = buildYao6(upperId, lowerId)
  const invertedYao6 = [...yao6].reverse()

  const ids = yao6ToTrigramIds(invertedYao6)
  if (!ids) return null

  return {
    ...ids,
    name: getHexagramName(ids.upperId, ids.lowerId),
    symbol: getHexagramSymbol(ids.upperId, ids.lowerId),
  }
}
