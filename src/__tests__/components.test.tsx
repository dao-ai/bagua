import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import Modal from '@/components/Modal'
import PageHeader from '@/components/PageHeader'
import Providers from '@/components/Providers'

afterEach(cleanup)

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal open={false} onClose={() => {}}>
        <div>content</div>
      </Modal>
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders children when open', () => {
    render(
      <Modal open={true} onClose={() => {}} label="测试弹窗">
        <div>测试内容</div>
      </Modal>
    )
    expect(screen.getByText('测试内容')).toBeDefined()
  })

  it('has dialog role, aria-modal, aria-label, and close button', () => {
    render(
      <Modal open={true} onClose={() => {}} label="测试弹窗">
        <div>content</div>
      </Modal>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeDefined()
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.getAttribute('aria-label')).toBe('测试弹窗')

    const closeBtn = screen.getByLabelText('关闭')
    expect(closeBtn).toBeDefined()
  })
})

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
