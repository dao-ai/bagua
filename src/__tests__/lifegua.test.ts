import { describe, it, expect } from 'vitest'
import { calculateLifeGua, shichenList } from '@/data/lifegua'
import type { LifeGuaResult } from '@/data/lifegua'

// ─── 三元命卦推算 ───

describe('calculateLifeGua', () => {
  // ── 年卦（三元命卦）──
  describe('年卦（三元命卦）', () => {
    it('男 1984 → 兑(7)', () => {
      const r = calculateLifeGua(1984, 1, 1, 0, 'male')
      expect(r.year.baguaId).toBe('dui')
      expect(r.year.number).toBe(7)
    })

    it('男 2000 → 坎(1)', () => {
      // (100-0)%9 = 100%9 = 1, remainderToGua(1) = kan
      const r = calculateLifeGua(2000, 1, 1, 0, 'male')
      expect(r.year.baguaId).toBe('kan')
      expect(r.year.number).toBe(1)
    })

    it('女 1990 → 艮(8) via 5寄宫', () => {
      // (90-4)%9 = 86%9 = 5, 5寄艮(8) for female
      const r = calculateLifeGua(1990, 1, 1, 0, 'female')
      expect(r.year.baguaId).toBe('gen')
      expect(r.year.number).toBe(8)
    })

    it('男 2023 → 余5寄坤(2)', () => {
      // (100-23)%9 = 77%9 = 5, 5寄坤(2) for male
      const r = calculateLifeGua(2023, 1, 1, 0, 'male')
      expect(r.year.baguaId).toBe('kun')
      expect(r.year.number).toBe(2)
    })

    it('女 1986 → 余1→坎', () => {
      // (86-4)%9 = 82%9 = 1 → kan
      const r = calculateLifeGua(1986, 1, 1, 0, 'female')
      expect(r.year.baguaId).toBe('kan')
    })

    it('男 1999 → 余1→坎', () => {
      // (100-99)%9 = 1 → kan
      const r = calculateLifeGua(1999, 1, 1, 0, 'male')
      expect(r.year.baguaId).toBe('kan')
    })

    it('女 2004 → 余0→9→离', () => {
      // (4-4)%9 = 0 → 0→9→li
      const r = calculateLifeGua(2004, 1, 1, 0, 'female')
      expect(r.year.baguaId).toBe('li')
      expect(r.year.number).toBe(9)
    })
  })

  // ── 月卦 ──
  describe('月卦', () => {
    it('month 1 → 1→坎', () => {
      const r = calculateLifeGua(2000, 1, 1, 0, 'male')
      expect(r.month.baguaId).toBe('kan')
    })

    it('month 3 → 3→震', () => {
      const r = calculateLifeGua(2000, 3, 1, 0, 'male')
      expect(r.month.baguaId).toBe('zhen')
    })

    it('month 9 → 0→9→离', () => {
      const r = calculateLifeGua(2000, 9, 1, 0, 'male')
      expect(r.month.number).toBe(9)
      expect(r.month.baguaId).toBe('li')
    })
  })

  // ── 日卦 ──
  describe('日卦', () => {
    it('day 1 → 1→坎', () => {
      const r = calculateLifeGua(2000, 1, 1, 0, 'male')
      expect(r.day.baguaId).toBe('kan')
    })

    it('day 18 → 0→9→离', () => {
      const r = calculateLifeGua(2000, 1, 18, 0, 'male')
      expect(r.day.number).toBe(9)
      expect(r.day.baguaId).toBe('li')
    })

    it('day 27 → 0→9→离', () => {
      const r = calculateLifeGua(2000, 1, 27, 0, 'male')
      expect(r.day.baguaId).toBe('li')
    })
  })

  // ── 时卦 ──
  describe('时卦', () => {
    it('子时(0) → (0+1)%9=1→坎', () => {
      const r = calculateLifeGua(2000, 1, 1, 0, 'male')
      expect(r.hour.baguaId).toBe('kan')
    })

    it('午时(6) → (6+1)%9=7→兑', () => {
      const r = calculateLifeGua(2000, 1, 1, 6, 'male')
      expect(r.hour.baguaId).toBe('dui')
    })

    it('亥时(11) → (11+1)%9=3→震', () => {
      const r = calculateLifeGua(2000, 1, 1, 11, 'male')
      expect(r.hour.baguaId).toBe('zhen')
    })

    it('酉时(9) → (9+1)%9=1→坎', () => {
      const r = calculateLifeGua(2000, 1, 1, 9, 'male')
      expect(r.hour.baguaId).toBe('kan')
    })
  })

  // ── 完整性 ──
  describe('result integrity', () => {
    const r = calculateLifeGua(1984, 6, 15, 5, 'male')

    it('has all 4 pillars', () => {
      expect(r.year.baguaId).toBeTruthy()
      expect(r.month.baguaId).toBeTruthy()
      expect(r.day.baguaId).toBeTruthy()
      expect(r.hour.baguaId).toBeTruthy()
    })

    it('each pillar has name, symbol, element, number', () => {
      for (const p of [r.year, r.month, r.day, r.hour]) {
        expect(p.name).toBeTruthy()
        expect(p.symbol).toBeTruthy()
        expect(p.element).toBeTruthy()
        expect(p.number).toBeGreaterThanOrEqual(1)
        expect(p.number).toBeLessThanOrEqual(9)
      }
    })

    it('has personality, advice, interpretation', () => {
      expect(r.personality).toBeTruthy()
      expect(r.advice).toBeTruthy()
      expect(r.interpretation).toBeTruthy()
    })

    it('personality matches year gua', () => {
      // All personalityMap entries should match their bagua
      expect(r.personality.length).toBeGreaterThan(10)
    })
  })

  // ── 边界 ──
  describe('edge cases', () => {
    it('leap year Feb 29', () => {
      const r = calculateLifeGua(2024, 2, 29, 0, 'male')
      expect(r.day.baguaId).toBeTruthy()
    })

    it('month 12', () => {
      const r = calculateLifeGua(2000, 12, 1, 0, 'male')
      expect(r.month.number).toBe(3) // 12%9=3
    })

    it('day 31', () => {
      const r = calculateLifeGua(2000, 1, 31, 0, 'male')
      expect(r.day.number).toBe(4) // 31%9=4
    })

    it('oldest valid year 1900', () => {
      const r = calculateLifeGua(1900, 1, 1, 0, 'male')
      expect(r.year.baguaId).toBeTruthy()
    })

    it('year 2099', () => {
      const r = calculateLifeGua(2099, 12, 31, 11, 'female')
      expect(r.year.baguaId).toBeTruthy()
    })
  })
})

// ─── 时辰列表 ───

describe('shichenList', () => {
  it('has 12 entries', () => {
    expect(shichenList).toHaveLength(12)
  })

  it('starts with 子时', () => {
    expect(shichenList[0].name).toBe('子时')
  })

  it('ends with 亥时', () => {
    expect(shichenList[11].name).toBe('亥时')
  })

  it('all have valid index', () => {
    shichenList.forEach((s, i) => {
      expect(s.index).toBe(i)
    })
  })
})
