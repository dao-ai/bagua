import { describe, it, expect } from 'vitest'
import {
  baguaList,
  baguaMap,
  numToBagua,
  getHexagramName,
  getHexagramSymbol,
  findBaguaByYao,
  buildYao6,
  yao6ToTrigramIds,
  computeHexagramChange,
  BAGUA_WUXING,
  YAO_LABELS,
} from '@/data/bagua'

// ─── 八卦数据 ───

describe('baguaList', () => {
  it('has exactly 8 trigrams', () => {
    expect(baguaList).toHaveLength(8)
  })

  it('each trigram has correct yao count', () => {
    for (const b of baguaList) {
      expect(b.yao).toHaveLength(3)
    }
  })

  it('has unique IDs', () => {
    const ids = baguaList.map(b => b.id)
    expect(new Set(ids).size).toBe(8)
  })
})

describe('baguaMap', () => {
  it('maps all 8 IDs', () => {
    expect(Object.keys(baguaMap)).toHaveLength(8)
  })

  it('乾 has correct attributes', () => {
    expect(baguaMap['qian'].name).toBe('乾')
    expect(baguaMap['qian'].yao).toEqual([1, 1, 1])
  })

  it('坤 has correct attributes', () => {
    expect(baguaMap['kun'].name).toBe('坤')
    expect(baguaMap['kun'].yao).toEqual([0, 0, 0])
  })
})

// ─── 工具函数 ───

describe('findBaguaByYao', () => {
  it('finds 乾 by yao [1,1,1]', () => {
    expect(findBaguaByYao([1, 1, 1])).toBe('qian')
  })

  it('finds 坤 by yao [0,0,0]', () => {
    expect(findBaguaByYao([0, 0, 0])).toBe('kun')
  })

  it('finds 坎 by yao [0,1,0]', () => {
    expect(findBaguaByYao([0, 1, 0])).toBe('kan')
  })

  it('returns undefined for invalid yao', () => {
    expect(findBaguaByYao([9, 9, 9])).toBeUndefined()
  })
})

describe('buildYao6', () => {
  it('乾为天 (qian-qian) = all yang', () => {
    const yao6 = buildYao6('qian', 'qian')
    expect(yao6).toEqual([1, 1, 1, 1, 1, 1])
  })

  it('坤为地 (kun-kun) = all yin', () => {
    const yao6 = buildYao6('kun', 'kun')
    expect(yao6).toEqual([0, 0, 0, 0, 0, 0])
  })

  it('round-trips with yao6ToTrigramIds', () => {
    const yao6 = buildYao6('kan', 'li')
    const ids = yao6ToTrigramIds(yao6)
    expect(ids).toEqual({ upperId: 'kan', lowerId: 'li' })
  })
})

describe('yao6ToTrigramIds', () => {
  it('identifies 水火既济 (kan-li)', () => {
    // yao6 = [line6..line1], kan(上) [0,1,0] reversed + li(下) [1,0,1] reversed
    const yao6 = [0, 1, 0, 1, 0, 1]
    const ids = yao6ToTrigramIds(yao6)
    expect(ids).toEqual({ upperId: 'kan', lowerId: 'li' })
  })

  it('returns null for garbage input', () => {
    expect(yao6ToTrigramIds([9, 9, 9, 9, 9, 9])).toBeNull()
  })
})

// ─── 卦名/符号查询 ───

describe('getHexagramName', () => {
  it('乾为天', () => {
    expect(getHexagramName('qian', 'qian')).toBe('乾')
  })

  it('地天泰 (kun upper, qian lower)', () => {
    expect(getHexagramName('kun', 'qian')).toBe('泰')
  })

  it('天地否 (qian upper, kun lower)', () => {
    expect(getHexagramName('qian', 'kun')).toBe('否')
  })

  it('水火既济 (kan upper, li lower)', () => {
    expect(getHexagramName('kan', 'li')).toBe('既济')
  })

  it('火水未济 (li upper, kan lower)', () => {
    expect(getHexagramName('li', 'kan')).toBe('未济')
  })
})

describe('getHexagramSymbol', () => {
  it('乾 = ䷀', () => {
    expect(getHexagramSymbol('qian', 'qian')).toBe('䷀')
  })

  it('泰 = ䷊', () => {
    expect(getHexagramSymbol('kun', 'qian')).toBe('䷊')
  })
})

// ─── 变卦计算 ───

describe('computeHexagramChange', () => {
  const getDetail = () => undefined // not testing detail lookup here

  it('乾初九变 → 姤', () => {
    // yao6 = 乾为天: all yang
    const yao6 = [1, 1, 1, 1, 1, 1]
    const result = computeHexagramChange(yao6, 1, getDetail) // 初爻(1-based)
    expect(result.hexName).toBe('乾')
    expect(result.changedHexName).toBe('姤')
    expect(result.movingName).toBe('初爻')
    expect(result.movingChange).toBe('阳变阴')
    // 初爻(底爻)从阳变阴
    expect(result.changedYao6[5]).toBe(0) // index 5 = 初爻
  })

  it('坤上六变 → 剥', () => {
    const yao6 = [0, 0, 0, 0, 0, 0]
    const result = computeHexagramChange(yao6, 6, getDetail) // 上爻
    expect(result.hexName).toBe('坤')
    expect(result.changedHexName).toBe('剥')
    expect(result.movingName).toBe('上爻')
    expect(result.movingChange).toBe('阴变阳')
  })

  it('泰卦九五变 → 需', () => {
    // 泰 (地天泰): upper=kun[0,0,0], lower=qian[1,1,1]
    // yao6 = kun reversed + qian reversed = [0,0,0, 1,1,1]
    const yao6 = [0, 0, 0, 1, 1, 1]
    const result = computeHexagramChange(yao6, 5, getDetail) // 五爻
    expect(result.hexName).toBe('泰')
    expect(result.changedHexName).toBe('需')
  })

  it('throws on invalid input', () => {
    expect(() => computeHexagramChange([9, 9, 9, 9, 9, 9], 1, getDetail)).toThrow()
  })
})

// ─── 五行映射 ───

describe('BAGUA_WUXING', () => {
  it('has correct mapping for all 8 trigrams', () => {
    expect(BAGUA_WUXING['qian']).toBe('金')
    expect(BAGUA_WUXING['kun']).toBe('土')
    expect(BAGUA_WUXING['zhen']).toBe('木')
    expect(BAGUA_WUXING['xun']).toBe('木')
    expect(BAGUA_WUXING['kan']).toBe('水')
    expect(BAGUA_WUXING['li']).toBe('火')
    expect(BAGUA_WUXING['gen']).toBe('土')
    expect(BAGUA_WUXING['dui']).toBe('金')
  })
})

// ─── 常量 ───

describe('YAO_LABELS', () => {
  it('has 6 labels from 初 to 上', () => {
    expect(YAO_LABELS).toEqual(['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'])
  })
})

describe('numToBagua', () => {
  it('maps numbers correctly', () => {
    expect(numToBagua[1]).toBe('qian')
    expect(numToBagua[8]).toBeUndefined() // only 0-7 defined
    expect(numToBagua[0]).toBe('kun')
  })
})
