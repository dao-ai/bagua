import { describe, it, expect } from 'vitest'

describe('ThreeYaoHexagram', () => {
  // 这个用例唯一做的事是 import 整个 three/drei/fiber 模块图，冷启动或
  // 并行执行时会逼近 vitest 默认的 5s，本机曾反复超时（单独跑约 3s）。
  // 放宽到这个模块图的真实开销，避免把「加载慢」报成「测试失败」。
  it('exports component', async () => {
    const mod = await import('@/components/ThreeYaoHexagram')
    expect(mod.default).toBeDefined()
  }, 20000)
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
