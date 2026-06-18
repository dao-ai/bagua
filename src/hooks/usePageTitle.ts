'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const titles: Record<string, string> = {
  '/': '八卦 · 入门',
  '/binary/': '二进制 · 八卦入门',
  '/hexagrams/': '六十四卦 · 八卦入门',
  '/divine/': '起卦 · 八卦入门',
}

export default function usePageTitle() {
  const pathname = usePathname()
  useEffect(() => {
    document.title = titles[pathname] || '八卦 · 入门'
  }, [pathname])
}
