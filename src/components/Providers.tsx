'use client'

import { useEffect, useState } from 'react'
import { usePinyin, PinyinProvider } from '@/contexts/PinyinContext'

function PinyinWatcher() {
  const { showPinyin } = usePinyin()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (mounted) {
      document.body.classList.toggle('show-pinyin', showPinyin)
    }
  }, [mounted, showPinyin])
  return null
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PinyinProvider>
      <PinyinWatcher />
      {children}
    </PinyinProvider>
  )
}
