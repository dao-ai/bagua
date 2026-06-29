'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const titles: Record<string, string> = {
  '/': '每日一卦 · 八卦入门',
  '/binary/': '二进制 · 八卦入门',
  '/eight/': '认识八卦 · 八卦入门',
  '/hexagrams/': '六十四卦 · 八卦入门',
  '/divine/': '起卦 · 八卦入门',
  '/lifegua/': '本命卦 · 八卦入门',
  '/glossary/': '术语解释 · 八卦入门',
  '/history/': '起卦历史 · 八卦入门',
  '/solar-terms/': '卦象与节气 · 八卦入门',
}

export default function usePageTitle(title?: string) {
  const pathname = usePathname()
  useEffect(() => {
    document.title = title || titles[pathname] || '八卦 · 入门'
  }, [pathname, title])
}
