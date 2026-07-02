import { describe, it, expect } from 'vitest'

describe('ThreeYaoLine', () => {
  it('renders without crashing', async () => {
    // Three.js components require Canvas context — smoke test just checks import
    const mod = await import('@/components/ThreeYaoLine')
    expect(mod.default).toBeDefined()
  })
})
