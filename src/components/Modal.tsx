'use client'

import { useEffect, useRef } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  label?: string
}

export default function Modal({ open, onClose, children, label }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // 保存打开前的焦点，以便关闭后恢复
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null
    }
  }, [open])

  // Escape 关闭 + 焦点锁定
  useEffect(() => {
    if (!open) return

    const dialog = dialogRef.current
    if (!dialog) return

    // 自动聚焦对话框（第一个可聚焦元素或对话框本身）
    const focusable = dialog.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable) {
      focusable.focus()
    } else {
      dialog.focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }

      // 焦点锁定：Tab/Shift+Tab 在对话框内循环
      if (e.key === 'Tab') {
        const focusableEls = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableEls.length === 0) return

        const first = focusableEls[0]
        const last = focusableEls[focusableEls.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // 关闭后恢复焦点
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={label || '对话框'}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/55 backdrop-blur-sm outline-none"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl max-w-[520px] w-full p-8 max-h-[90vh] overflow-y-auto thin-scroll animate-[slideUp_0.3s_ease] relative">
        <button
          onClick={onClose}
          aria-label="关闭"
          className="absolute top-3 right-4 text-[var(--muted)] text-3xl leading-none hover:text-[var(--fg)] transition-colors bg-transparent border-none cursor-pointer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}
