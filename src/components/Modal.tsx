'use client'

export default function Modal({ open, onClose, children }: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/55 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl max-w-[520px] w-full p-8 max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-[var(--muted)] text-3xl leading-none hover:text-[var(--fg)] transition-colors bg-transparent border-none cursor-pointer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}
