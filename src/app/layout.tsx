import type { Metadata, Viewport } from 'next'
import { Noto_Serif_SC, Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Providers from '@/components/Providers'
import InstallPrompt from '@/components/InstallPrompt'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const notoSerif = Noto_Serif_SC({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const basePath = process.env.BASE_PATH || ''

export const metadata: Metadata = {
  title: '八卦 · 入门',
  description: '每天15分钟，搞懂八卦 — 交互式易经学习网站',
  other: {
    'mcp-actions': '/mcp-actions.json',
  },
  icons: {
    icon: `${basePath}/favicon.png`,
    apple: `${basePath}/apple-touch-icon.png`,
  },
  manifest: `${basePath}/manifest.json`,
  appleWebApp: {
    capable: true,
    title: '八卦入门',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  themeColor: '#24282f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`min-h-screen ${notoSerif.variable}`} style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        {/* 防止主题闪烁：在 React 渲染前应用 localStorage 中的主题 */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function(){
              try {
                if (localStorage.getItem('bg-theme') === 'classic') {
                  document.documentElement.classList.add('classic');
                }
              } catch(e){}
            })();
          `,
        }} />
        {/* WebMCP — AI agent 动作发现 */}
        <link rel="mcp-actions" href="/mcp-actions.json" />

        {/* PWA Service Worker 注册 */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('${basePath}/sw.js')
                  .then(() => console.log('[PWA] SW registered'))
                  .catch((e) => console.warn('[PWA] SW registration failed:', e));
              });
            }
          `,
        }} />
        {/* GoatCounter 访问统计 — https://baguadao.goatcounter.com */}
        <script data-goatcounter={process.env.NEXT_PUBLIC_GOATCOUNTER_URL || 'https://baguadao.goatcounter.com/count'} async src={process.env.NEXT_PUBLIC_GOATCOUNTER_SCRIPT || '//gc.zgo.at/count.js'} />
        <TooltipProvider>
        <Providers>
          <div className="max-w-[960px] mx-auto px-5">
            <Header />
            <ErrorBoundary>
              <main className="py-8 animate-[fadeIn_0.4s_ease]">{children}</main>
            </ErrorBoundary>
            <Footer />
          </div>
        </Providers>
        </TooltipProvider>
        <Toaster />
        <InstallPrompt />
      </body>
    </html>
  )
}
