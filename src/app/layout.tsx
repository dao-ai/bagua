import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '八卦 · 入门',
  description: '每天15分钟，搞懂八卦 — 交互式八卦学习网站',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        {children}
      </body>
    </html>
  )
}
