// 伏羲六十四卦方圆图数据
// 依据邵雍《皇极经世》伏羲八卦次序
//
// 伏羲先天八卦数（二进制升序，与baguaIndex相反）：
//   坤0 艮1 坎2 巽3 震4 离5 兑6 乾7
//
// 六十四卦伏羲序 = 下卦 × 8 + 上卦
//   乾(7)×8+乾(7)=63  坤(0)×8+坤(0)=0
//   复(0)×8+震(4)=32  姤(7)×8+巽(3)=59

import { baguaMap, hexagramSymbol, getHexagramName } from './bagua'

/** 先天八卦伏羲数映射 */
export const fuxiBaguaOrder: Record<string, number> = {
  kun: 0, gen: 1, kan: 2, xun: 3,
  zhen: 4, li: 5, dui: 6, qian: 7,
}

/** 伏羲数 → 八卦id */
export const fuxiNumToId: Record<number, string> = {
  0: 'kun', 1: 'gen', 2: 'kan', 3: 'xun',
  4: 'zhen', 5: 'li', 6: 'dui', 7: 'qian',
}

export interface FuxiHexagram {
  fuxiIndex: number       // 0-63
  name: string            // 卦名如「乾」
  lowerId: string         // 下卦id
  upperId: string         // 上卦id
  symbol: string          // unicode卦符
  key: string             // "upperId-lowerId" 用于查hexagramDetail/yao_lines
  yaoLines: number[]      // 6条爻 [line1,...,line6], 1=阳 0=阴 (从下到上)
  yangCount: number       // 阳爻数 (0-6)
  yinCount: number        // 阴爻数 (0-6)
}

/**
 * 计算伏羲序索引
 * 下卦为高3位，上卦为低3位
 * Fuxi order = lower_decimal * 8 + upper_decimal
 * 这样：乾(下7上7)=63, 坤(下0上0)=0
 */
export function getFuxiIndex(lowerId: string, upperId: string): number {
  const lower = fuxiBaguaOrder[lowerId]
  const upper = fuxiBaguaOrder[upperId]
  return lower * 8 + upper
}

/**
 * 获取卦的6位二进制值（伏羲序视角）
 * 下卦为高3位，上卦为低3位
 */
export function getFuxiBinary(fuxiIndex: number): string {
  return fuxiIndex.toString(2).padStart(6, '0')
}

/**
 * 从伏羲序解析上下卦id
 */
export function getTrigramsFromFuxiIndex(fuxiIndex: number): { lowerId: string; upperId: string } {
  const lowerNum = Math.floor(fuxiIndex / 8)
  const upperNum = fuxiIndex % 8
  return {
    lowerId: fuxiNumToId[lowerNum],
    upperId: fuxiNumToId[upperNum],
  }
}

/**
 * 生成六爻数组（从下到上）
 * 下卦三爻为低位，上卦三爻为高位
 */
export function buildYaoLines(lowerId: string, upperId: string): number[] {
  const lower = baguaMap[lowerId]
  const upper = baguaMap[upperId]
  // lower.yao = [下爻, 中爻, 上爻]
  // yaoLines = [lower.下, lower.中, lower.上, upper.下, upper.中, upper.上]
  return [...lower.yao, ...upper.yao]
}

/**
 * 根据爻色值计算卦的阴阳调和度（用于渐变色）
 * 0 = 全阴(坤), 1 = 全阳(乾)
 */
export function getYangRatio(yaoLines: number[]): number {
  return yaoLines.filter(y => y === 1).length / 6
}

/**
 * 生成完整的伏羲序六十四卦数组 [0..63]
 */
export const fuxiOrderedHexagrams: FuxiHexagram[] = (() => {
  const result: FuxiHexagram[] = []
  for (let i = 0; i < 64; i++) {
    const { lowerId, upperId } = getTrigramsFromFuxiIndex(i)
    const name = getHexagramName(upperId, lowerId)
    const symbol = hexagramSymbol[name] || ''
    const key = `${upperId}-${lowerId}`
    const yaoLines = buildYaoLines(lowerId, upperId)
    const yangCount = yaoLines.filter(y => y === 1).length
    const yinCount = 6 - yangCount
    result.push({
      fuxiIndex: i,
      name,
      lowerId,
      upperId,
      symbol,
      key,
      yaoLines,
      yangCount,
      yinCount,
    })
  }
  return result
})()

// 因 hexagramNames[row][col] 行列是 baguaIndex 顺序：
//   行=下卦: 乾0兑1离2震3巽4坎5艮6坤7
//   列=上卦: 同
// 伏羲序方图需要按先天八卦数排列：
//   行=下卦: 坤0艮1坎2巽3震4离5兑6乾7（从下到上）
//   列=上卦: 乾7兑6离5震4巽3坎2艮1坤0（从左到右）
// 所以需要一个映射：baguaIndex→fuxiBaguaOrder

/** 八卦id → baguaIndex行号 */

/** 从伏羲八卦数获取hexagramNames的行列号 */

/**
 * 伏羲方图数据 — 8×8
 * 行（下卦）：坤艮坎巽震离兑乾（从下到上）
 * 列（上卦）：乾兑离震巽坎艮坤（从左到右）
 * 与hexagramNames矩阵通过baguaIndex映射
 */
export interface FuxiSquareCell {
  fuxiIndex: number
  name: string
  symbol: string
  lowerId: string
  upperId: string
  key: string
  yaoLines: number[]
  yangCount: number
  yinCount: number
}

/** 伏羲方图行标题（下卦，从下到上，先天数0→7） */
export const fuxiSquareRowLabels = (() => {
  const labels: { id: string; name: string; symbol: string; fuxiNum: number }[] = []
  for (let n = 0; n < 8; n++) {
    const id = fuxiNumToId[n]
    const b = baguaMap[id]
    labels.push({ id, name: b.name, symbol: b.symbol, fuxiNum: n })
  }
  return labels
})()

/** 伏羲方图列标题（上卦，从左到右，先天数7→0） */
export const fuxiSquareColLabels = (() => {
  const labels: { id: string; name: string; symbol: string; fuxiNum: number }[] = []
  for (let n = 7; n >= 0; n--) {
    const id = fuxiNumToId[n]
    const b = baguaMap[id]
    labels.push({ id, name: b.name, symbol: b.symbol, fuxiNum: n })
  }
  return labels
})()

/** 伏羲方图8×8网格数据 */
export const fuxiSquareGrid: FuxiSquareCell[][] = (() => {
  const grid: FuxiSquareCell[][] = []
  // 行从下到上：坤(0)→乾(7)
  for (let rowNum = 0; rowNum < 8; rowNum++) {
    const row: FuxiSquareCell[] = []
    // 列从左到右：乾(7)→坤(0)
    for (let colNum = 7; colNum >= 0; colNum--) {
      // fuxiIndex = rowNum * 8 + colNum
      const fi = rowNum * 8 + colNum
      const lowerId = fuxiNumToId[rowNum]
      const upperId = fuxiNumToId[colNum]
      const name = getHexagramName(upperId, lowerId)
      const symbol = hexagramSymbol[name] || ''
      const key = `${upperId}-${lowerId}`
      const yaoLines = buildYaoLines(lowerId, upperId)
      const yangCount = yaoLines.filter(y => y === 1).length
      const yinCount = 6 - yangCount
      row.push({
        fuxiIndex: fi,
        name,
        symbol,
        lowerId,
        upperId,
        key,
        yaoLines,
        yangCount,
        yinCount,
      })
    }
    grid.push(row)
  }
  return grid
})()
