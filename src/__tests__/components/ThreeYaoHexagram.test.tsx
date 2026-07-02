import { describe, it, expect } from 'vitest'

describe('ThreeYaoHexagram', () => {
  it('exports component', async () => {
    const mod = await import('@/components/ThreeYaoHexagram')
    expect(mod.default).toBeDefined()
  })
})

describe('YaoSkeleton', () => {
  it('renders 6 placeholder lines', async () => {
    const React = await import('react')
    const { renderToString } = await import('react-dom/server')
    const { default: Skeleton } = await import('@/components/YaoSkeleton')
    const html = renderToString(React.createElement(Skeleton, { size: 320 }))
    expect(html).toContain('animate-pulse')
  })
})
