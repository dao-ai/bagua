import { describe, it, expect } from 'vitest'

describe('ThreeYaoHexagram', () => {
  // 这个用例唯一做的事是 import 整个 three/drei/fiber 模块图，冷启动或
  // 并行执行时开销明显高于普通用例（本机单独跑约 3s）；全局 15s 超时
  // （见 vitest.config.ts）已为它留出余量，无需再单独设定。
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
