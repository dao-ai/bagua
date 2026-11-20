import { describe, it, expect } from 'vitest'
import {
  analyzeDivination,
  movingKeysFromSums,
  flipMovingLines,
} from '@/data/divination'
import { getHexagramDetail } from '@/data/hexagrams'
import { computeHexagramChangeMulti } from '@/data/bagua'

// 乾为天：六爻皆阳  yao6 = [上,5,4,3,2,初]
const QIAN: number[] = [1, 1, 1, 1, 1, 1]
// 坤为地：六爻皆阴
const KUN: number[] = [0, 0, 0, 0, 0, 0]
// 地天泰：上坤下乾
const TAI: number[] = [0, 0, 0, 1, 1, 1]

const detail = getHexagramDetail

describe('movingKeysFromSums', () => {
  it('6 与 9 为变爻，7 与 8 不变', () => {
    expect(movingKeysFromSums([7, 8, 7, 8, 7, 8])).toEqual([])
    expect(movingKeysFromSums([9, 7, 6, 8, 7, 8])).toEqual([1, 3])
    expect(movingKeysFromSums([6, 6, 6, 6, 6, 6])).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('顺序为初爻 → 上爻', () => {
    expect(movingKeysFromSums([7, 7, 7, 7, 7, 6])).toEqual([6])
  })
})

describe('flipMovingLines', () => {
  it('只翻转指定变爻，其余保持', () => {
    expect(flipMovingLines(QIAN, [1])).toEqual([1, 1, 1, 1, 1, 0])
    expect(flipMovingLines(QIAN, [])).toEqual(QIAN)
    expect(flipMovingLines(KUN, [2, 4])).toEqual([0, 0, 1, 0, 1, 0])
  })
})

describe('变占规则 · 六爻皆静', () => {
  it('不造变卦，以本卦卦辞占', () => {
    const a = analyzeDivination(QIAN, [], detail)
    expect(a.movingCount).toBe(0)
    expect(a.rule).toBe('六爻皆静')
    expect(a.changedName).toBe('乾')
    expect(a.useNowJudgment).toBe(true)
    expect(a.useChangedJudgment).toBe(false)
    expect(a.refs).toHaveLength(0)
    expect(a.changedYao6).toEqual(QIAN)
  })
})

describe('变占规则 · 一爻变', () => {
  it('取本卦该变爻爻辞为主断', () => {
    const a = analyzeDivination(QIAN, [1], detail)
    expect(a.rule).toBe('一爻变')
    expect(a.changedName).toBe('姤')
    expect(a.refs).toHaveLength(1)
    expect(a.refs[0].source).toBe('now')
    expect(a.refs[0].pos).toBe('初九')
    expect(a.refs[0].primary).toBe(true)
    expect(a.refs[0].text).toBe('潜龙勿用')
  })

  it('上爻变取上九爻辞', () => {
    const a = analyzeDivination(QIAN, [6], detail)
    expect(a.refs[0].pos).toBe('上九')
    expect(a.refs[0].text).toBe('亢龙有悔')
  })
})

describe('变占规则 · 二爻变', () => {
  it('取本卦二变爻，以上爻为主', () => {
    const a = analyzeDivination(QIAN, [1, 2], detail)
    expect(a.rule).toBe('二爻变')
    expect(a.changedName).toBe('遁')
    expect(a.refs).toHaveLength(2)
    const primary = a.refs.find(r => r.primary)!
    expect(primary.pos).toBe('九二')
    expect(a.refs.every(r => r.source === 'now')).toBe(true)
  })
})

describe('变占规则 · 三爻变', () => {
  it('占本卦与变卦卦辞，以本卦为主', () => {
    const a = analyzeDivination(QIAN, [1, 2, 3], detail)
    expect(a.rule).toBe('三爻变')
    expect(a.nowName).toBe('乾')
    expect(a.changedName).toBe('否')
    expect(a.useNowJudgment).toBe(true)
    expect(a.useChangedJudgment).toBe(true)
    expect(a.refs).toHaveLength(0)
    expect(a.primaryLabel).toContain('乾')
  })
})

describe('变占规则 · 四爻变', () => {
  it('取变卦二不变爻，以下爻为主', () => {
    const a = analyzeDivination(QIAN, [1, 2, 3, 4], detail)
    expect(a.rule).toBe('四爻变')
    expect(a.changedName).toBe('观')
    expect(a.refs).toHaveLength(2)
    expect(a.refs.every(r => r.source === 'changed')).toBe(true)
    const primary = a.refs.find(r => r.primary)!
    // 不变的是上爻与五爻，下爻（五爻）为主
    expect(primary.pos).toBe('九五')
  })
})

describe('变占规则 · 五爻变', () => {
  it('取变卦唯一不变爻', () => {
    const a = analyzeDivination(QIAN, [1, 2, 3, 4, 5], detail)
    expect(a.rule).toBe('五爻变')
    expect(a.changedName).toBe('剥')
    expect(a.refs).toHaveLength(1)
    expect(a.refs[0].source).toBe('changed')
    expect(a.refs[0].pos).toBe('上九')
  })
})

describe('变占规则 · 六爻变', () => {
  it('乾卦占用九', () => {
    const a = analyzeDivination(QIAN, [1, 2, 3, 4, 5, 6], detail)
    expect(a.rule).toBe('六爻变')
    expect(a.changedName).toBe('坤')
    expect(a.special?.name).toBe('用九')
    expect(a.special?.text).toBe('见群龙无首，吉')
    expect(a.useChangedJudgment).toBe(false)
  })

  it('坤卦占用六', () => {
    const a = analyzeDivination(KUN, [1, 2, 3, 4, 5, 6], detail)
    expect(a.changedName).toBe('乾')
    expect(a.special?.name).toBe('用六')
    expect(a.special?.text).toBe('利永贞')
  })

  it('乾坤以外以变卦卦辞占', () => {
    const a = analyzeDivination(TAI, [1, 2, 3, 4, 5, 6], detail)
    expect(a.nowName).toBe('泰')
    expect(a.changedName).toBe('否')
    expect(a.special).toBeUndefined()
    expect(a.useChangedJudgment).toBe(true)
    expect(a.useNowJudgment).toBe(false)
  })
})

describe('computeHexagramChangeMulti 与规则层一致', () => {
  it('静卦时变卦等于本卦，movingIndex 为 -1', () => {
    const r = computeHexagramChangeMulti(QIAN, [], detail)
    expect(r.changedHexName).toBe('乾')
    expect(r.movingIndex).toBe(-1)
    expect(r.movingName).toBe('六爻皆静')
    expect(r.movingChange).toBe('无变爻')
  })

  it('多爻变翻转全部变爻并拼出爻题列表', () => {
    const r = computeHexagramChangeMulti(QIAN, [1, 3], detail)
    expect(r.changedYao6).toEqual([1, 1, 1, 0, 1, 0])
    expect(r.movingName).toBe('初爻、三爻')
    expect(r.movingChange).toBe('2 爻变')
  })

  it('单爻变与旧单参数行为一致', () => {
    const r = computeHexagramChangeMulti(QIAN, [6], detail)
    expect(r.movingName).toBe('上爻')
    expect(r.movingChange).toBe('阳变阴')
    expect(r.movingIndex).toBe(0)
  })
})
