import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import PageHeader from '@/components/PageHeader'
import Providers from '@/components/Providers'

afterEach(cleanup)

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="测试标题" />)
    expect(screen.getByText('测试标题')).toBeDefined()
  })

  it('renders subtitle when provided', () => {
    render(<PageHeader title="标题" subtitle="副标题" />)
    expect(screen.getByText('副标题')).toBeDefined()
  })

  it('does not render subtitle when not provided', () => {
    const { container } = render(<PageHeader title="标题" />)
    expect(container.querySelector('p')).toBeNull()
  })
})

describe('Providers', () => {
  it('renders children', () => {
    render(
      <Providers>
        <div>child content</div>
      </Providers>
    )
    expect(screen.getByText('child content')).toBeDefined()
  })
})
