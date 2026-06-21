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
            <footer className="pt-10 pb-8 border-t border-[var(--border)]">
              {/* 装饰线 — 阴阳爻 */}
              <div className="flex items-center justify-center gap-0.5 mb-6 opacity-30">
                <span className="block w-5 h-[3px] rounded-full bg-[var(--yang)]" />
                <span className="block w-2.5 h-[3px] rounded bg-[var(--yin)]" />
                <span className="block w-5 h-[3px] rounded-full bg-[var(--yang)]" />
                <span className="block w-5 h-[3px] rounded-full bg-[var(--yang)]" />
                <span className="block w-2.5 h-[3px] rounded bg-[var(--yin)]" />
                <span className="block w-2.5 h-[3px] rounded bg-[var(--yin)]" />
              </div>

              {/* 链接区 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-center sm:text-left">
                <div>
                  <div className="text-[11px] text-[var(--muted)] font-semibold uppercase tracking-wider mb-2">学习</div>
                  <div className="flex flex-col gap-1.5">
                    <a href="/eight" className="text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline">八卦</a>
                    <a href="/hexagrams" className="text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline">64卦</a>
                    <a href="/flashcard" className="text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline">闪卡</a>
                    <a href="/glossary" className="text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline">术语</a>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--muted)] font-semibold uppercase tracking-wider mb-2">工具</div>
                  <div className="flex flex-col gap-1.5">
                    <a href="/divine" className="text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline">起卦</a>
                    <a href="/simulator" className="text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline">变爻模拟</a>
                    <a href="/ai-reading" className="text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline">AI解卦</a>
                    <a href="/lifegua" className="text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline">本命卦</a>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--muted)] font-semibold uppercase tracking-wider mb-2">探索</div>
                  <div className="flex flex-col gap-1.5">
                    <a href="/contrast" className="text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline">先后天</a>
                    <a href="/compare" className="text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline">卦对比</a>
                    <a href="/history" className="text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline">占卜记录</a>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--muted)] font-semibold uppercase tracking-wider mb-2">关于</div>
                  <div className="flex flex-col gap-1.5">
                    <a href="https://wj.qq.com/s2/27084048/da60" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline">📋 反馈建议</a>
                    <a href="https://github.com/dao-ai/bagua" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline">GitHub</a>
                  </div>
                </div>
              </div>

              {/* 底部语录 */}
              <div className="text-center">
                <p className="text-[11px] text-[var(--muted)] opacity-50 leading-relaxed">
                  学而时习之，不亦说乎 · 有朋自远方来，不亦乐乎
                </p>
                <p className="text-[10px] text-[var(--muted)] opacity-30 mt-2">
                  交互式《易经》学习网站 · 每天15分钟，搞懂八卦
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
