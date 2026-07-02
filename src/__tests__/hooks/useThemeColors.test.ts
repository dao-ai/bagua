import { describe, it, expect } from 'vitest'
import { readColors } from '@/hooks/useThemeColors'

describe('readColors', () => {
  it('returns default colors when document is undefined', () => {
    const doc = global.document
    // @ts-expect-error testing server path
    delete global.document
    const colors = readColors()
    expect(colors.yang).toBe('#f59e0b')
    expect(colors.yin).toBe('#4a5a7a')
    global.document = doc
  })

  it('returns theme colors from CSS custom properties', () => {
    const el = document.documentElement
    el.style.setProperty('--yang', '#ff0000')
    el.style.setProperty('--yin', '#00ff00')
    el.style.setProperty('--accent', '#0000ff')
    el.style.setProperty('--accent2', '#ffff00')
    el.style.setProperty('--bg', '#ffffff')

    const colors = readColors()
    expect(colors.yang).toBe('#ff0000')
    expect(colors.yin).toBe('#00ff00')
    expect(colors.accent).toBe('#0000ff')
    expect(colors.accent2).toBe('#ffff00')
    expect(colors.bg).toBe('#ffffff')

    el.style.removeProperty('--yang')
    el.style.removeProperty('--yin')
    el.style.removeProperty('--accent')
    el.style.removeProperty('--accent2')
    el.style.removeProperty('--bg')
  })
})
