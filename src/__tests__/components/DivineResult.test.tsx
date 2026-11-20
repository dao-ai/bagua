import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import DivineResult from '@/components/DivineResult'
import { computeHexagramChangeMulti } from '@/data/bagua'
import { getHexagramDetail } from '@/data/hexagrams'

// 3D 卦体与分享卡依赖 canvas / 动态资源，测试中替换为占位
vi.mock('@/components/ThreeYaoHexagram', () => ({
  default: () => <div data-testid="hex-body" />,
}))
vi.mock('@/components/ShareCard', () => ({ default: () => null }))

afterEach(cleanup)

const QIAN = [1, 1, 1, 1, 1, 1]

describe('DivineResult · 多爻变动画', () => {
  it('三个变爻时渲染三条爻，并标注同步爻数', () => {
    const r = computeHexagramChangeMulti(QIAN, [1, 3, 5], getHexagramDetail)
    const { container } = render(<DivineResult result={r} />)

    expect(screen.getByText('初爻、三爻、五爻')).toBeDefined()
    expect(screen.getByText('3 爻同步')).toBeDefined()
    // 三条发光待演示的爻
    expect(container.querySelectorAll('.yl-moving')).toHaveLength(3)
  })

  it('点击后三条爻同时进入闪烁态', () => {
    const r = computeHexagramChangeMulti(QIAN, [1, 3, 5], getHexagramDetail)
    const { container } = render(<DivineResult result={r} />)

    fireEvent.click(screen.getByLabelText('点击演示变爻'))

    expect(container.querySelectorAll('.yl-flash')).toHaveLength(3)
  })

  it('单爻变仍只渲染一条爻', () => {
    const r = computeHexagramChangeMulti(QIAN, [2], getHexagramDetail)
    const { container } = render(<DivineResult result={r} />)

    expect(container.querySelectorAll('.yl-moving')).toHaveLength(1)
    expect(screen.queryByText(/爻同步/)).toBeNull()
  })

  it('静卦不渲染变爻栈，提示以本卦卦辞为断', () => {
    const r = computeHexagramChangeMulti(QIAN, [], getHexagramDetail)
    const { container } = render(<DivineResult result={r} />)

    // 「六爻皆静」在变爻栏与占断卡片各出现一次
    expect(screen.getAllByText('六爻皆静').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('.yl-moving')).toHaveLength(0)
    expect(screen.queryByLabelText('点击演示变爻')).toBeNull()
  })
})
