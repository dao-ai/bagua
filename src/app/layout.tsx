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
        {/* GoatCounter 访问统计 — https://baguadao.goatcounter.com */}
        <script data-goatcounter={process.env.NEXT_PUBLIC_GOATCOUNTER_URL || 'https://baguadao.goatcounter.com/count'} async src={process.env.NEXT_PUBLIC_GOATCOUNTER_SCRIPT || '//gc.zgo.at/count.js'} />
        <Providers>
          <div className="max-w-[960px] mx-auto px-5">
            <Header />
            <main className="py-8">{children}</main>
            {/* 底部反馈区 */}
            <footer className="py-8 border-t border-[var(--border)] text-center">
              <a
                href={process.env.NEXT_PUBLIC_FEEDBACK_URL || 'https://github.com/dao-ai/bagua/issues/new'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] border border-[var(--border)] bg-[var(--bg2)] text-[var(--muted)] no-underline hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors"
              >
                <span>💬</span>
                <span>反馈建议</span>
              </a>
              <p className="mt-4 text-[12px] text-[var(--muted)] opacity-60">
                学而时习之，不亦说乎 · 有朋自远方来，不亦乐乎
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
