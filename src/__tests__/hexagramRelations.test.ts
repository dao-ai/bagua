import { describe, it, expect } from 'vitest'
import { getOpposite, getInverted, getInterlocking } from '@/data/hexagramRelations'

// 错卦：全爻阴阳相反
describe('getOpposite (错卦)', () => {
  it('乾为天 → 坤为地 (all yang → all yin)', () => {
    const result = getOpposite('qian', 'qian')
    expect(result).not.toBeNull()
    expect(result!.name).toBe('坤')
  })

  it('坤为地 → 乾为天 (all yin → all yang)', () => {
    const result = getOpposite('kun', 'kun')
    expect(result).not.toBeNull()
    expect(result!.name).toBe('乾')
  })

  it('水火既济 → 火水未济', () => {
    const result = getOpposite('kan', 'li')
    expect(result).not.toBeNull()
    expect(result!.name).toBe('未济')
  })

  it('错卦的错卦 = 本卦 (round trip)', () => {
    const a = getOpposite('qian', 'kun')
    expect(a).not.toBeNull()
    const b = getOpposite(a!.upperId, a!.lowerId)
    expect(b).not.toBeNull()
    expect(b!.name).toBe('否')
  })
})

// 综卦：六爻上下颠倒
describe('getInverted (综卦)', () => {
  it('水火既济 → 火水未济', () => {
    const result = getInverted('kan', 'li')
    expect(result).not.toBeNull()
    expect(result!.name).toBe('未济')
  })

  it('火水未济 → 水火既济', () => {
    const result = getInverted('li', 'kan')
    expect(result).not.toBeNull()
    expect(result!.name).toBe('既济')
  })

  it('乾为天 is self-inverse', () => {
    const result = getInverted('qian', 'qian')
    expect(result).not.toBeNull()
    expect(result!.name).toBe('乾')
  })
})

// 互卦：二至五爻重新组合
describe('getInterlocking (互卦)', () => {
  it('returns a valid hexagram', () => {
    const result = getInterlocking('qian', 'kun')
    expect(result).not.toBeNull()
    expect(result!.name).toBeTruthy()
    expect(result!.upperId).toBeTruthy()
    expect(result!.lowerId).toBeTruthy()
  })
})
