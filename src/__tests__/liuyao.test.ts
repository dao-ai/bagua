import { describe, it, expect } from 'vitest'
import {
  computeLiuyao,
  TIAN_GAN,
  DI_ZHI,
  DIZHI_WUXING,
  LIU_SHEN,
  LIU_QIN,
  BAGUA_WUXING,
  PALACE_HEXAGRAMS,
} from '@/data/liuyao'

// ─── 基础常量 ───

describe('TIAN_GAN', () => {
  it('has 10 stems', () => expect(TIAN_GAN).toHaveLength(10))
  it('starts with 甲', () => expect(TIAN_GAN[0]).toBe('甲'))
  it('ends with 癸', () => expect(TIAN_GAN[9]).toBe('癸'))
})

describe('DI_ZHI', () => {
  it('has 12 branches', () => expect(DI_ZHI).toHaveLength(12))
  it('子丑寅卯开头', () => {
    expect(DI_ZHI.slice(0, 4)).toEqual(['子', '丑', '寅', '卯'])
  })
})

describe('DIZHI_WUXING', () => {
  it('子属水', () => expect(DIZHI_WUXING['子']).toBe('水'))
  it('午属火', () => expect(DIZHI_WUXING['午']).toBe('火'))
  it('covers all 12 branches', () => {
    expect(Object.keys(DIZHI_WUXING)).toHaveLength(12)
  })
})

// ─── 八宫分类 ───

describe('PALACE_HEXAGRAMS', () => {
  it('has all 8 palaces', () => {
    expect(Object.keys(PALACE_HEXAGRAMS)).toHaveLength(8)
  })

  it('each palace has exactly 8 hexagrams', () => {
    for (const hexagrams of Object.values(PALACE_HEXAGRAMS)) {
      expect(hexagrams).toHaveLength(8)
    }
  })

  it('covers all 64 unique hexagrams', () => {
    const seen = new Set<string>()
    for (const hexagrams of Object.values(PALACE_HEXAGRAMS)) {
      for (const [l, u] of hexagrams) {
        seen.add(`${l}-${u}`)
      }
    }
    expect(seen.size).toBe(64)
  })
})

// ─── 主函数：computeLiuyao ───

describe('computeLiuyao', () => {
  it('returns null for invalid trigram', () => {
    expect(computeLiuyao('xxx', 'yyy', '甲')).toBeNull()
  })

  // ── 乾为天（乾宫本宫卦）──
  describe('乾为天 (qian-qian)', () => {
    const result = computeLiuyao('qian', 'qian', '甲')!

    it('belongs to 乾宫', () => {
      expect(result.palaceName).toBe('乾宫')
      expect(result.palaceWuxing).toBe('金')
    })

    it('is 本宫卦', () => {
      expect(result.generation).toBe('本宫')
    })

    it('inner stem = 甲, outer stem = 壬', () => {
      expect(result.innerStem).toBe('甲')
      expect(result.outerStem).toBe('壬')
    })

    it('has 6 lines', () => {
      expect(result.lines).toHaveLength(6)
      for (const line of result.lines) {
        expect(line.yang).toBe(true)
      }
    })

    it('shi is at 上爻(5), ying at 三爻(2)', () => {
      expect(result.lines[5].isShi).toBe(true)
      expect(result.lines[2].isYing).toBe(true)
    })

    it('六神 starts with 青龙 on 初爻 (日干=甲)', () => {
      expect(result.lines[0].liushen).toBe('青龙')
      expect(result.lines[1].liushen).toBe('朱雀')
      expect(result.lines[2].liushen).toBe('勾陈')
      expect(result.lines[3].liushen).toBe('螣蛇')
      expect(result.lines[4].liushen).toBe('白虎')
      expect(result.lines[5].liushen).toBe('玄武')
    })

    it('纳支 correctly (qian yang trigram)', () => {
      // qian: [子,寅,辰,午,申,戌] 初→上
      expect(result.lines[0].branch).toBe('子')
      expect(result.lines[1].branch).toBe('寅')
      expect(result.lines[5].branch).toBe('戌')
    })

    it('初爻六亲 = 子孙 (金生水)', () => {
      // 乾宫属金, 初爻子水 → 金生水 = 子孙
      expect(result.lines[0].liuqin).toBe('子孙')
    })
  })

  // ── 坤为地（坤宫本宫卦）──
  describe('坤为地 (kun-kun)', () => {
    const result = computeLiuyao('kun', 'kun', '甲')!

    it('belongs to 坤宫', () => {
      expect(result.palaceName).toBe('坤宫')
      expect(result.palaceWuxing).toBe('土')
    })

    it('all yin lines', () => {
      for (const line of result.lines) {
        expect(line.yang).toBe(false)
      }
    })

    it('纳支 correctly (kun yin trigram)', () => {
      // kun: [未,巳,卯,丑,亥,酉]
      expect(result.lines[0].branch).toBe('未')
      expect(result.lines[5].branch).toBe('酉')
    })
  })

  // ── 天风姤（乾宫一世卦）──
  describe('天风姤 (qian-xun)', () => {
    const result = computeLiuyao('qian', 'xun', '丙')!

    it('belongs to 乾宫', () => {
      expect(result.palaceName).toBe('乾宫')
    })

    it('is 一世卦', () => {
      expect(result.generation).toBe('一世')
    })

    it('shi at 初爻(0), ying at 四爻(3)', () => {
      expect(result.lines[0].isShi).toBe(true)
      expect(result.lines[3].isYing).toBe(true)
    })

    it('六神 starts with 朱雀 on 初爻 (日干=丙)', () => {
      expect(result.lines[0].liushen).toBe('朱雀')
      expect(result.lines[1].liushen).toBe('勾陈')
    })
  })

  // ── 水火既济（坎宫三世卦）──
  describe('水火既济 (kan-li)', () => {
    const result = computeLiuyao('kan', 'li', '甲')!

    it('belongs to 坎宫', () => {
      expect(result.palaceName).toBe('坎宫')
      expect(result.palaceWuxing).toBe('水')
    })

    it('is 三世卦', () => {
      expect(result.generation).toBe('三世')
    })

    it('has 6 lines, alternating yin/yang', () => {
      expect(result.lines[0].yang).toBe(true)   // 初九
      expect(result.lines[1].yang).toBe(false)  // 六二
      expect(result.lines[2].yang).toBe(true)   // 九三
      expect(result.lines[3].yang).toBe(false)  // 六四
      expect(result.lines[4].yang).toBe(true)   // 九五
      expect(result.lines[5].yang).toBe(false)  // 上六
    })
  })

  // ── 地天泰（坤宫三世卦）──
  describe('地天泰 (kun-qian)', () => {
    const result = computeLiuyao('kun', 'qian', '甲')!

    it('belongs to 坤宫 (三世卦)', () => {
      expect(result.palaceName).toBe('坤宫')
      expect(result.generation).toBe('三世')
    })
  })

  // ── 日干变化测试 ──
  describe('六神 rotates correctly', () => {
    it('日干=甲: 初爻=青龙', () => {
      const r = computeLiuyao('qian', 'qian', '甲')!
      expect(r.lines[0].liushen).toBe('青龙')
    })

    it('日干=丙: 初爻=朱雀', () => {
      const r = computeLiuyao('qian', 'qian', '丙')!
      expect(r.lines[0].liushen).toBe('朱雀')
    })

    it('日干=戊: 初爻=勾陈', () => {
      const r = computeLiuyao('qian', 'qian', '戊')!
      expect(r.lines[0].liushen).toBe('勾陈')
    })

    it('日干=庚: 初爻=螣蛇', () => {
      const r = computeLiuyao('qian', 'qian', '庚')!
      expect(r.lines[0].liushen).toBe('螣蛇')
    })

    it('日干=壬: 初爻=白虎', () => {
      const r = computeLiuyao('qian', 'qian', '壬')!
      expect(r.lines[0].liushen).toBe('白虎')
    })

    it('日干=乙: 初爻=青龙 (甲乙同组)', () => {
      const r = computeLiuyao('qian', 'qian', '乙')!
      expect(r.lines[0].liushen).toBe('青龙')
    })
  })

  // ── 纳支测试 ──
  describe('纳支', () => {
    it('震为雷 (yang trigram) uses qian branch pattern', () => {
      const r = computeLiuyao('zhen', 'zhen', '甲')!
      expect(r.lines[0].branch).toBe('子')
      expect(r.lines[1].branch).toBe('寅')
    })

    it('巽为风 (yin trigram) uses correct pattern', () => {
      const r = computeLiuyao('xun', 'xun', '甲')!
      // xun yin: [丑,亥,酉,未,巳,卯]
      expect(r.lines[0].branch).toBe('丑')
      expect(r.lines[5].branch).toBe('卯')
    })
  })

  // ── 六亲逻辑验证 ──
  describe('六亲', () => {
    it('乾宫+乾卦: 爻六亲子水=子孙(金生水)', () => {
      const r = computeLiuyao('qian', 'qian', '甲')!
      // 乾宫属金, 初爻子属水 → 金生水 = 子孙
      expect(r.lines[0].liuqin).toBe('子孙')
      // 五爻申属金 → 金=金 = 兄弟
      expect(r.lines[4].branch).toBe('申')
      expect(r.lines[4].wuxing).toBe('金')
      expect(r.lines[4].liuqin).toBe('兄弟')
    })

    it('坎宫(水)+坎卦: 初爻寅木=子孙(水生木)', () => {
      const r = computeLiuyao('kan', 'kan', '甲')!
      // 坎宫属水, 初爻寅属木 → 水生木 = 子孙
      expect(r.lines[0].branch).toBe('寅')
      expect(r.lines[0].wuxing).toBe('木')
      expect(r.lines[0].liuqin).toBe('子孙')
    })
  })
})

// ─── 全部 64 卦可计算 ───

describe('all 64 hexagrams compute successfully', () => {
  const trigramIds = ['qian', 'dui', 'li', 'zhen', 'xun', 'kan', 'gen', 'kun']

  for (const upper of trigramIds) {
    for (const lower of trigramIds) {
      it(`${upper}-${lower} returns valid result`, () => {
        const result = computeLiuyao(upper, lower, '甲')
        expect(result).not.toBeNull()
        expect(result!.palaceName).toBeTruthy()
        expect(result!.generation).toBeTruthy()
        expect(result!.lines).toHaveLength(6)
        for (const line of result!.lines) {
          expect(line.stem).toBeTruthy()
          expect(line.branch).toBeTruthy()
          expect(line.wuxing).toBeTruthy()
          expect(line.liuqin).toBeTruthy()
          expect(line.liushen).toBeTruthy()
        }
        // exactly one shi and one ying
        const shiCount = result!.lines.filter(l => l.isShi).length
        const yingCount = result!.lines.filter(l => l.isYing).length
        expect(shiCount).toBe(1)
        expect(yingCount).toBe(1)
      })
    }
  }
})
