'use client'

import { useEffect, useState } from 'react'
import { usePinyin, PinyinProvider } from '@/contexts/PinyinContext'

function PinyinClassProvider({ children }: { children: React.ReactNode }) {
  const { showPinyin } = usePinyin()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  // 服务端渲染时默认 false，客户端 mount 后跟随 showPinyin
  return (
    <body className={`min-h-screen${mounted && showPinyin ? ' show-pinyin' : ''}`}
      style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <div className="max-w-[960px] mx-auto px-5">
        {children}
      </div>
    </body>
  )
}

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PinyinProvider>
      <PinyinClassProvider>
        {children}
      </PinyinClassProvider>
    </PinyinProvider>
  )
}
