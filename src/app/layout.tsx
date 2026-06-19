import type { Metadata } from 'next'
import { Noto_Serif_SC } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Providers from '@/components/Providers'

const notoSerif = Noto_Serif_SC({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

export const metadata: Metadata = {
  title: '八卦 · 入门',
  description: '每天15分钟，搞懂八卦 — 交互式八卦学习网站',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`min-h-screen ${notoSerif.variable}`} style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        <Providers>
          <div className="max-w-[960px] mx-auto px-5">
            <Header />
            <main className="py-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
